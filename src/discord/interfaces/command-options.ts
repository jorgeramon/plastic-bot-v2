import { CommandBaseOptions } from '@discord/interfaces/command-base-options';
import { CommandParameter } from '@discord/interfaces/command-parameter';

export interface CommandOptions extends CommandBaseOptions {
  parameters?: CommandParameter[];
}
