export const isMethod = (prototype: Record<string, unknown>, prop: string) => {
  const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);

  if (!descriptor || descriptor.set || descriptor.get) {
    return false;
  }

  return prop !== 'constructor' && descriptor.value instanceof Function;
};
