import { Decorator } from '@discord/enums/decorator';
import { CommandOptions } from '@discord/interfaces/command-options';
import { isMethod } from 'common/utils/is-method';

export const ExtendsSubcommandGroup = (): ClassDecorator => (target: any) => {
  const prototype = Object.getPrototypeOf(target);

  if (prototype) {
    const options: CommandOptions = Reflect.getMetadata(
      Decorator.SUBCOMMAND_GROUP,
      prototype,
    );

    if (!options) {
      return target;
    }

    Reflect.defineMetadata(Decorator.SUBCOMMAND_GROUP, options, prototype);

    for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
      if (!isMethod(target.prototype, propertyName)) {
        continue;
      }

      Reflect.defineMetadata(
        Decorator.SUBCOMMAND_GROUP,
        options,
        target.prototype,
        propertyName,
      );
    }
  }

  return target;
};
