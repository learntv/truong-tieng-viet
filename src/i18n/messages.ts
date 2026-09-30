import type vi from "./messages/vi.json";
import { DEFAULT_LOCALE, type Locale } from "./config";

/**
 * vi.json is the source of truth for which messages exist. Every other
 * language's file must have exactly the same keys; the check below fails the
 * type check when one drifts.
 */
export type Messages = typeof vi;

type SameKeys<A, B> = [keyof A] extends [keyof B]
  ? [keyof B] extends [keyof A]
    ? { [K in keyof A & keyof B]: A[K] extends string ? true : SameKeys<A[K], B[K]> }[keyof A &
        keyof B]
    : false
  : false;

type AssertTrue<T extends true> = T;
export type MessagesCheck = AssertTrue<SameKeys<Messages, typeof import("./messages/en.json")>>;

declare module "use-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}

/* Each language is its own chunk, fetched only by the pages that use it. */
const bundled = import.meta.glob("./messages/*.json") as Record<
  string,
  () => Promise<{ default: Messages }>
>;

async function loadBundled(locale: Locale): Promise<Messages> {
  const load = bundled[`./messages/${locale}.json`];
  if (!load) throw new Error(`No messages for locale "${locale}"`);
  return (await load()).default;
}

type Tree = { [key: string]: string | Tree };

/* Missing keys fall back to the default language rather than showing a raw key. */
function mergeMessages(base: Tree, over: Tree): Tree {
  const out: Tree = { ...base };
  for (const [key, value] of Object.entries(over)) {
    const prev = out[key];
    out[key] =
      typeof value === "object" && typeof prev === "object" ? mergeMessages(prev, value) : value;
  }
  return out;
}

/**
 * The one place messages come from. Today that is the JSON bundled with the
 * app. When copy moves to the CMS, fetch the CMS's messages for `locale` here
 * and merge them over the bundled ones: components keep calling
 * useTranslations() and never learn where the text came from.
 */
export async function loadMessages(locale: Locale): Promise<Messages> {
  const base = await loadBundled(DEFAULT_LOCALE);
  if (locale === DEFAULT_LOCALE) return base;
  return mergeMessages(base, await loadBundled(locale)) as Messages;
}
