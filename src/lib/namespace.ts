export type StripNamespace<
  T extends string,
  Namespace extends string,
> = T extends `${Namespace}:${infer U}` ? U : never;

export const stripNamespace = (namespacedValue: string) => namespacedValue.split(":")[1];

export type PrefixNamespace<T extends { [K: string]: any }, Namespace extends string> = {
  [K in `${Namespace}:${keyof T & string}`]: T[keyof T & string];
};

export const prefixNamespace = <Namespace extends string, S extends string>(
  namespace: Namespace,
  s: S
) => `${namespace}:${s}` as const;
export const prefixNamespaceObject = <T extends { [K: string]: any }, Namespace extends string>(
  namespace: Namespace,
  object: T
) => {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [`${namespace}:${key}`, value])
  ) as PrefixNamespace<T, Namespace>;
};
