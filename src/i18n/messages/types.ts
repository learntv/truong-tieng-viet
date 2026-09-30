import type vi from "./vi";

// `vi` is declared `as const`, so its leaves are literal types. Widen them so another locale
// has to supply the same keys and the same message shapes, but can use its own text.
type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => string
    ? (...args: A) => string
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : { readonly [K in keyof T]: Widen<T[K]> };

export type Messages = Widen<typeof vi>;
