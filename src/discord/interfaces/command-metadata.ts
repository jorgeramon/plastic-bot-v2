import { CommandOptions } from '@discord/interfaces/command-options';
import { SubcommandGroupOptions } from '@discord/interfaces/subcommand-group-options';
import { SubcommandOptions } from '@discord/interfaces/subcommand-options';

export interface CommandMetadata {
  instance: any;
  method: string;
  command: CommandOptions;
  subcommand?: SubcommandOptions;
  subcommandGroup?: SubcommandGroupOptions;
}
