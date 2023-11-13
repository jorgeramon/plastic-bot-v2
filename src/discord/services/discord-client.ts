import { Environment } from '@common/enums/environment';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { CommandParameterType } from '@discord/enums/command-parameter-type';
import { CommandParameter } from '@discord/interfaces/command-parameter';
import { DiscordCommand } from '@discord/interfaces/discord-command';
import { DiscordSubcommand } from '@discord/interfaces/discord-subcommand';
import { DiscordSubcommandGroup } from '@discord/interfaces/discord-subcommand-group';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandDiscovery } from '@discord/services/command-discovery';
import { Routes } from 'discord-api-types/v10';
import {
  Client,
  CommandInteraction,
  IntentsBitField,
  Interaction,
  GatewayIntentBits,
  Message,
  MessageReaction,
  Partials,
  User,
} from 'discord.js';
import { Observable, Subscriber } from 'rxjs';

@Injectable()
export class DiscordClient extends Client {
  private readonly logger: Logger = new Logger(DiscordClient.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly discovery: CommandDiscovery,
  ) {
    super({
      intents: [
        IntentsBitField.Flags.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });
  }

  connect(): Promise<string> {
    const token: string = this.configService.get<string>(
      Environment.DISCORD_TOKEN,
    );
    return this.login(token);
  }

  onReady(): Observable<void> {
    return new Observable((subscriber: Subscriber<void>) => {
      this.on('ready', () => subscriber.next());
    });
  }

  onInteraction(): Observable<CommandInteraction> {
    return new Observable((subscriber: Subscriber<CommandInteraction>) => {
      this.on('interactionCreate', (interaction: Interaction) =>
        subscriber.next(interaction as CommandInteraction),
      );
    });
  }

  onMessage(): Observable<Message> {
    return new Observable((subscriber: Subscriber<Message>) => {
      this.on('messageCreate', (message: Message) => subscriber.next(message));
    });
  }

  onReactionAdd(): Observable<[MessageReaction, User]> {
    return new Observable((subscriber: Subscriber<[MessageReaction, User]>) => {
      this.on('messageReactionAdd', (message: MessageReaction, user: User) =>
        subscriber.next([message, user]),
      );
    });
  }

  onReactionRemove(): Observable<[MessageReaction, User]> {
    return new Observable((subscriber: Subscriber<[MessageReaction, User]>) => {
      this.on('messageReactionRemove', (message: MessageReaction, user: User) =>
        subscriber.next([message, user]),
      );
    });
  }

  async registerCommands(): Promise<void> {
    const token: string = this.configService.get<string>(
      Environment.DISCORD_TOKEN,
    );
    const clientId: string = this.configService.get<string>(
      Environment.DISCORD_CLIENT,
    );
    const rest = new REST({ version: '10' }).setToken(token);

    const slashCommands = this.buildCommands(this.discovery.getCommands());

    try {
      if (process.env.NODE_ENV === 'production') {
        await rest.put(Routes.applicationCommands(clientId), {
          body: slashCommands,
        });

        this.logger.log('Successfully registered application commands');
      } else {
        const guildId: string = this.configService.get<string>(
          Environment.DISCORD_TEST_GUILD,
        );

        this.logger.debug(slashCommands);

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
          body: slashCommands,
        });

        this.logger.log('Successfully registered guild commands');
      }
    } catch (e) {
      this.logger.error(e.message);
      this.logger.error(e.stack);
    }
  }

  private buildCommands(commands: DiscordCommand[]): any[] {
    return commands.map((command) => {
      const builder = new SlashCommandBuilder();

      this.buildCommandOrSubcommand(builder, command);

      if (command.subcommandGroups.length > 0) {
        this.buildSubcommandGroups(builder, command.subcommandGroups);
      }

      if (command.subcommands.length > 0) {
        this.buildSubcommands(builder, command.subcommands);
      }

      return builder.toJSON();
    });
  }

  private buildCommandOrSubcommand(
    builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
    command: DiscordCommand | DiscordSubcommand,
  ): SlashCommandBuilder | SlashCommandSubcommandBuilder {
    builder.setName(command.name).setDescription(command.description);

    if (command.parameters) {
      command.parameters.forEach((parameter) =>
        this.buildParameter(builder, parameter),
      );
    }

    if (command.permissions) {
      (builder as SlashCommandBuilder).setDefaultMemberPermissions(
        command.permissions.reduce((acc, val) => acc | val, BigInt(0)),
      );
    }

    return builder;
  }

  private buildSubcommands(
    builder: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder,
    subcommands: DiscordSubcommand[],
  ): void {
    subcommands.forEach((subcommand) =>
      builder.addSubcommand(
        (option) =>
          this.buildCommandOrSubcommand(
            option,
            subcommand,
          ) as SlashCommandSubcommandBuilder,
      ),
    );
  }

  private buildSubcommandGroups(
    builder: SlashCommandBuilder,
    subcommandGroups: DiscordSubcommandGroup[],
  ): void {
    subcommandGroups.forEach((subcommandGroup) =>
      builder.addSubcommandGroup((option) => {
        option
          .setName(subcommandGroup.name)
          .setDescription(subcommandGroup.description);

        this.buildSubcommands(option, subcommandGroup.subcommands);

        return option;
      }),
    );
  }

  private buildParameter(
    builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
    parameter: CommandParameter,
  ): void {
    switch (parameter.type) {
      case CommandParameterType.String:
        builder.addStringOption((option) =>
          option
            .setName(parameter.name)
            .setDescription(parameter.description)
            .setRequired(!!parameter.required),
        );
        break;

      case CommandParameterType.Number:
        builder.addNumberOption((option) =>
          option
            .setName(parameter.name)
            .setDescription(parameter.description)
            .setRequired(!!parameter.required),
        );
        break;

      case CommandParameterType.Boolean:
        builder.addBooleanOption((option) =>
          option
            .setName(parameter.name)
            .setDescription(parameter.description)
            .setRequired(!!parameter.required),
        );
        break;

      case CommandParameterType.User:
        builder.addUserOption((option) =>
          option
            .setName(parameter.name)
            .setDescription(parameter.description)
            .setRequired(!!parameter.required),
        );
        break;

      case CommandParameterType.Channel:
        builder.addChannelOption((option) =>
          option
            .setName(parameter.name)
            .setDescription(parameter.description)
            .setRequired(!!parameter.required),
        );
        break;

      case CommandParameterType.Mentionable:
        builder.addMentionableOption((option) =>
          option
            .setName(parameter.name)
            .setDescription(parameter.description)
            .setRequired(!!parameter.required),
        );
        break;

      case CommandParameterType.Role:
        builder.addRoleOption((option) =>
          option
            .setName(parameter.name)
            .setDescription(parameter.description)
            .setRequired(!!parameter.required),
        );
        break;

      case CommandParameterType.Integer:
        builder.addIntegerOption((option) =>
          option
            .setName(parameter.name)
            .setDescription(parameter.description)
            .setRequired(!!parameter.required),
        );
        break;
    }
  }
}
