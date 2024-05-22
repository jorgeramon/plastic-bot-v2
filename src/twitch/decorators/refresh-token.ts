export const RefreshToken =
  (): MethodDecorator =>
  (
    _: Record<string, string>,
    __: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalFunction = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalFunction.apply(this, args);
        return result;
      } catch (e) {
        if (e?.response?.data?.status === 401) {
          await this.authorize();
          return await originalFunction.apply(this, args);
        }
      }
    };

    return descriptor;
  };
