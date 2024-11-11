import "i18next";
import en from "./locales/en.json";

// Create a type for our translation structure
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof en;
    };
  }
}

// Helper type for nested keys
export type TranslationKey = RecursiveKeyOf<typeof en>;

// This creates proper types for nested translation keys
type RecursiveKeyOf<
  TObj extends Record<string, any>,
  Depth extends number = 4
> = [Depth] extends [never]
  ? never
  : {
      [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, any>
        ? `${TKey}.${RecursiveKeyOf<TObj[TKey], Subtract<Depth, 1>>}`
        : `${TKey}`;
    }[keyof TObj & string];

type Subtract<N extends number, M extends number> = TupleOf<N> extends [
  ...TupleOf<M>,
  ...infer Rest
]
  ? Rest["length"]
  : never;
type TupleOf<N extends number, T extends any[] = []> = T["length"] extends N
  ? T
  : TupleOf<N, [...T, any]>;
