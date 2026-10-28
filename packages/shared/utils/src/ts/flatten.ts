export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null
  | Date;

export type FlattenKeys<T> = T extends Primitive | unknown[]
  ? never
  : {
      [K in keyof T & string]: T[K] extends Primitive | unknown[]
        ? K
        : `${K}` | `${K}.${FlattenKeys<T[K]>}`;
    }[keyof T & string];

export type GetProperty<
  T,
  K extends string,
> = K extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? GetProperty<T[Key], Rest>
    : never
  : K extends keyof T
    ? T[K]
    : never;

export type Flatten<T extends object> = {
  [K in FlattenKeys<T>]: GetProperty<T, K>;
};
