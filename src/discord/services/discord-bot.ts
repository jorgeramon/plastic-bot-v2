import { Environment } from '@common/enums/environment';
import { CommandMetadata } from '@discord/interfaces/command-metadata';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandDiscovery } from '@discord/services/command-discovery';
import { DiscordClient } from '@discord/services/discord-client';
import { Collection, CommandInteraction, OAuth2Guild } from 'discord.js';
import { RuntimeException } from 'common/exceptions/runtime';
import {
  catchError,
  combineLatest,
  filter,
  from,
  Observable,
  of,
  switchMap,
  tap,
  mergeMap,
} from 'rxjs';

@Injectable()
export class DiscordBot implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(DiscordBot.name);

  constructor(
    private readonly client: DiscordClient,
    private readonly configService: ConfigService,
    private readonly commandDiscovery: CommandDiscovery,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.commandDiscovery.discoverCommands();
    this.client.registerCommands();

    await this.connect();
  }

  async connect(): Promise<void> {
    this.onReady();
    this.onInteraction();

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

  private findCommandMetadata(
    interaction: CommandInteraction,
  ): CommandMetadata {
    return this.commandDiscovery
      .getMetadata()
      .filter(({ command }) => command.name === interaction.commandName)
      .find((command) => {
        if (!command.subcommand && !command.subcommandGroup) {
          return command;
        }

        /* TODO: Check subcommands
        if (command.subcommandGroup && command.subcommand) {
          const subcommandGroupName = interaction.;

          const subcommandName = interaction.options.getSubcommand();

          if (
            subcommandGroupName &&
            command.subcommandGroup.name === subcommandGroupName &&
            subcommandName === command.subcommand.name
          ) {
            return command;
          }
        }

        if (!command.subcommandGroup && command.subcommand) {
          const subcommandName = interaction.options.getSubcommand();

          if (subcommandName && command.subcommand.name === subcommandName) {
            return command;
          }
        }*/

        return false;
      });
  }
}
