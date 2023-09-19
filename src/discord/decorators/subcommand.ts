import { Decorator } from '@discord/enums/decorator';
import { SubcommandOptions } from '@discord/interfaces/subcommand-options';

export const Subcommand =
  (options: SubcommandOptions): MethodDecorator =>
  (
    target: Record<string, string>,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(Decorator.SUBCOMMAND, options, target, propertyKey);
    return descriptor;
  };
