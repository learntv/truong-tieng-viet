/**
 * The site's languages. Adding one is: add its code here, give it a name in
 * LOCALE_NAMES, and add `messages/<code>.json` with the same keys as vi.json.
 *
 * Vietnamese is the default and lives at the bare URLs (/hoc-tap); every other
 * language gets a path prefix (/en/hoc-tap). Route slugs stay Vietnamese in
 * every language, so the route tree never changes.
 */
export const LOCALES = ["vi", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "vi";

/** Each language named in itself, for the language switcher. */
export const LOCALE_NAMES: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

/** "/en/hoc-tap" → "en", "/hoc-tap" → "vi". */
export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split("/")[1];
  return first !== DEFAULT_LOCALE && isLocale(first) ? first : DEFAULT_LOCALE;
}

/** "/en/hoc-tap" → "/hoc-tap". Bare paths come back unchanged. */
export function stripLocale(pathname: string): string {
  const locale = localeFromPathname(pathname);
  if (locale === DEFAULT_LOCALE) return pathname;
  return pathname.slice(locale.length + 1) || "/";
}

/** ("/hoc-tap", "en") → "/en/hoc-tap"; ("/hoc-tap", "vi") → "/hoc-tap". */
export function localizePathname(pathname: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return pathname;
  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}
