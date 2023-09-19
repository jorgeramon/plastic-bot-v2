import { Decorator } from '@discord/enums/decorator';
import { SubcommandGroupOptions } from '@discord/interfaces/subcommand-group-options';
import { isMethod } from 'common/utils/is-method';

export const SubcommandGroup =
  (options: SubcommandGroupOptions): MethodDecorator & ClassDecorator =>
  (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor) {
      Reflect.defineMetadata(
        Decorator.SUBCOMMAND_GROUP,
        options,
        target,
        propertyKey,
      );
    } else {
      Reflect.defineMetadata(Decorator.SUBCOMMAND_GROUP, options, target);

      for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
        if (!isMethod(target, propertyName)) {
          continue;
        }

        Reflect.defineMetadata(
          Decorator.SUBCOMMAND_GROUP,
          options,
          target,
          propertyName,
        );
      }
    }

    return target;
  };
