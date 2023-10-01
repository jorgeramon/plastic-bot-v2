import { Decorator } from '@discord/enums/decorator';

export const Mention =
  (): MethodDecorator =>
  (
    target: Record<string, string>,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(Decorator.MENTION, {}, target, propertyKey);
    return descriptor;
  };
