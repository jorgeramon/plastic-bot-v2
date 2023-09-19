import { DiscordSubcommand } from '@discord/interfaces/discord-subcommand';
import { SubcommandGroupOptions } from '@discord/interfaces/subcommand-group-options';

export interface DiscordSubcommandGroup extends SubcommandGroupOptions {
  subcommands: DiscordSubcommand[];
}
