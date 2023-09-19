import { CommandOptions } from '@discord/interfaces/command-options';
import { DiscordSubcommand } from '@discord/interfaces/discord-subcommand';
import { DiscordSubcommandGroup } from '@discord/interfaces/discord-subcommand-group';

export interface DiscordCommand extends CommandOptions {
  subcommandGroups?: DiscordSubcommandGroup[];
  subcommands?: DiscordSubcommand[];
}
