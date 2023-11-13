import { Decorator } from '@discord/enums/decorator';
import { CommandOptions } from '@discord/interfaces/command-options';
import { isMethod } from 'common/utils/is-method';

export const Command =
  (options: CommandOptions): MethodDecorator & ClassDecorator =>
  (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor) {
      Reflect.defineMetadata(Decorator.COMMAND, options, target, propertyKey);
    } else {
      Reflect.defineMetadata(Decorator.COMMAND, options, target);

      for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
        if (!isMethod(target.prototype, propertyName)) {
          continue;
        }

        Reflect.defineMetadata(
          Decorator.COMMAND,
          options,
          target.prototype,
          propertyName,
        );
      }
    }

    return target;
  };
