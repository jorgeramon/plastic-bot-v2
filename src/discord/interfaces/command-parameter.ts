import { CommandParameterType } from '@discord/enums/command-parameter-type';
import { CommandBaseOptions } from '@discord/interfaces/command-base-options';

export interface CommandParameter extends CommandBaseOptions {
  type: CommandParameterType;
  required?: boolean;
}
