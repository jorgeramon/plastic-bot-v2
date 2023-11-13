import { CommandMetadata } from '@discord/interfaces/command-metadata';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CommandDiscovery } from '@discord/services/command-discovery';
import { DiscordClient } from '@discord/services/discord-client';
import {
  Collection,
  CommandInteraction,
  CommandInteractionOptionResolver,
  OAuth2Guild,
} from 'discord.js';
import { RuntimeException } from 'common/exceptions/runtime';
import {
  catchError,
  combineLatest,
  filter,
  forkJoin,
  from,
  Observable,
  of,
  switchMap,
  map,
  tap,
} from 'rxjs';
import { AutoRoleMessageRepository } from '@database/repositories/autorole-message';

@Injectable()
export class DiscordBot implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(DiscordBot.name);

  constructor(
    private readonly client: DiscordClient,
    private readonly commandDiscovery: CommandDiscovery,
    private readonly autoRoleMessageRepository: AutoRoleMessageRepository,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.commandDiscovery.discoverCommands();
    this.client.registerCommands();

    await this.connect();
  }

  async connect(): Promise<void> {
    this.onReady();
    this.onInteraction();
    this.onMessage();
    this.onReactionAdd();
    this.onReactionRemove();

    await this.client.connect();
  }

  onReady(): void {
    this.client
      .onReady()
      .pipe(
        tap(() => this.logger.log('[onReady] Connected to Discord')),
        switchMap(() => this.client.guilds.fetch()),
        switchMap((guilds: Collection<string, OAuth2Guild>) =>
          from(guilds.toJSON()),
        ),
        tap((guild: OAuth2Guild) =>
          this.logger.log(`[onReady] Guild ${guild.id}`),
        ),
      )
      .subscribe();
  }

  onInteraction() {
    this.client
      .onInteraction()
      .pipe(
        filter((interaction: CommandInteraction) => interaction.isCommand()),
        switchMap((interaction: CommandInteraction) =>
          combineLatest([
            of(interaction),
            of(this.findCommandMetadata(interaction)),
          ]),
        ),
        filter(
          ([_, command]: [CommandInteraction, CommandMetadata]) => !!command,
        ),
        switchMap(
          ([interaction, command]: [CommandInteraction, CommandMetadata]) => {
            const { instance, method } = command;

            const interactionExecution = instance[method](interaction);

            const observableInteraction: Observable<unknown> =
              interactionExecution instanceof Observable
                ? interactionExecution
                : from(interactionExecution);

            return observableInteraction.pipe(
              catchError((err) => {
                this.logger.error(err);

                if (err.stack) {
                  this.logger.error(err.stack);
                }

                const defaultErrorMessage =
                  'Oops... ocurrió un error inesperado al procesar el comando. Intenta de nuevo';

                const content = `**ERROR:**   ${
                  err?.status === 'error' || err instanceof RuntimeException
                    ? err.message
                    : defaultErrorMessage
                }`;

                return interaction.deferred
                  ? interaction.editReply({
                      content,
                    })
                  : interaction.reply({
                      content,
                      ephemeral: true,
                    });
              }),
            );
          },
        ),
      )
      .subscribe();
  }

  onMessage() {
    this.client
      .onMessage()
      .pipe(
        filter((message) => message.mentions.has(this.client.user.id)),
        switchMap((message) => {
          const observables: Observable<any>[] = this.findMentionMetadata().map(
            ({ instance, method }) => {
              const result = instance[method](message);
              return result instanceof Promise || result instanceof Observable
                ? from(result)
                : of(result);
            },
          );
          return forkJoin(observables);
        }),
      )
      .subscribe();
  }

  onReactionAdd() {
    this.client
      .onReactionAdd()
      .pipe(
        switchMap((reaction) =>
          combineLatest([
            of(reaction),
            this.autoRoleMessageRepository.findOneByMessage(
              reaction.message.id,
            ),
          ]),
        ),
        filter(([_, autoRoleMessage]) => !!autoRoleMessage),
        switchMap(([reaction, autoRoleMessage]) =>
          combineLatest([
            reaction.partial ? reaction.fetch() : of(reaction),
            of(autoRoleMessage),
          ]),
        ),
        switchMap(([reaction, autoRoleMessage]) => {
          const emoji =
            reaction.emoji.id !== null
              ? `<:${reaction.emoji.identifier}>`
              : reaction.emoji.name;

          const configuration = autoRoleMessage.roles.find(
            (x) => x.emoji === emoji,
          );

          return combineLatest([of(reaction), of(configuration)]);
        }),
        filter(([_, configuration]) => !!configuration),
        tap(([reaction, configuration]) =>
          this.logger.log(
            `Adding role ${configuration.role} to ${reaction.message.member.user.username}`,
          ),
        ),
        switchMap(([reaction, configuration]) =>
          reaction.message.member.roles.add(configuration.role),
        ),
      )
      .subscribe();
  }

  onReactionRemove() {
    this.client
      .onReactionRemove()
      .pipe(
        switchMap((reaction) =>
          combineLatest([
            of(reaction),
            this.autoRoleMessageRepository.findOneByMessage(
              reaction.message.id,
            ),
          ]),
        ),
        filter(([_, autoRoleMessage]) => !!autoRoleMessage),
        switchMap(([reaction, autoRoleMessage]) =>
          combineLatest([
            reaction.partial ? reaction.fetch() : of(reaction),
            of(autoRoleMessage),
          ]),
        ),
        switchMap(([reaction, autoRoleMessage]) => {
          const emoji =
            reaction.emoji.id !== null
              ? `<:${reaction.emoji.identifier}>`
              : reaction.emoji.name;

          const configuration = autoRoleMessage.roles.find(
            (x) => x.emoji === emoji,
          );

          return combineLatest([of(reaction), of(configuration)]);
        }),
        filter(([_, configuration]) => !!configuration),
        tap(([reaction, configuration]) =>
          this.logger.log(
            `Removing role ${configuration.role} to ${reaction.message.member.user.username}`,
          ),
        ),
        switchMap(([reaction, configuration]) =>
          reaction.message.member.roles.remove(configuration.role),
        ),
      )
      .subscribe();
  }

  private findMentionMetadata(): CommandMetadata[] {
    return this.commandDiscovery
      .getMetadata()
      .filter((command) => command.isMention);
  }

  private findCommandMetadata(
    interaction: CommandInteraction,
  ): CommandMetadata {
    const subcommandName = (
      interaction.options as CommandInteractionOptionResolver
    ).getSubcommand(false);

    const subcommandGroupName = (
      interaction.options as CommandInteractionOptionResolver
    ).getSubcommandGroup(false);

    const isCommand = !subcommandName;
    const isSubcommand = !!subcommandName;
    const isSubcommandGroup = !!subcommandGroupName;

    const metadata = this.commandDiscovery
      .getMetadata()
      .filter((metadata) => !metadata.isMention)
      .filter(({ command }) => command.name === interaction.commandName);

    if (isCommand) {
      return metadata[0];
    }

    if (isSubcommandGroup) {
      return metadata
        .filter(
          ({ subcommandGroup, subcommand }) =>
            !!subcommandGroup && !!subcommand,
        )
        .find(
          ({ subcommandGroup, subcommand }) =>
            subcommandGroup.name === subcommandGroupName &&
            subcommand.name === subcommandName,
        );
    }

    if (isSubcommand) {
      return metadata
        .filter(({ subcommand }) => !!subcommand)
        .find(({ subcommand }) => subcommand.name === subcommandName);
    }
  }
}
