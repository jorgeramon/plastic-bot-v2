import { Decorator } from '@discord/enums/decorator';
import { CommandOptions } from '@discord/interfaces/command-options';
import { isMethod } from 'common/utils/is-method';

export const ExtendsCommand = (): ClassDecorator => (target: any) => {
  const prototype = Object.getPrototypeOf(target);

  if (prototype) {
    const options: CommandOptions = Reflect.getMetadata(
      Decorator.COMMAND,
      prototype,
    );

    if (!options) {
      return target;
    }

    Reflect.defineMetadata(Decorator.COMMAND, options, prototype);

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
