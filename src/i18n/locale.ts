export const LOCALES = ["vi", "en"] as const;
export type Locale = (typeof LOCALES)[number];

// What a visitor without a `locale` cookie (and every crawler) gets.
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE_NAME = "locale";
// Not HttpOnly on purpose: the client reads it on navigation and the switcher writes it.
export const LOCALE_COOKIE_ATTRIBUTES = "Path=/; Max-Age=31536000; SameSite=Lax";

// BCP 47 tags for Intl formatting.
export const INTL_LOCALE: Record<Locale, string> = { vi: "vi-VN", en: "en-US" };

export function normalizeLocale(value: string | null | undefined): Locale {
  return (LOCALES as readonly string[]).includes(value ?? "") ? (value as Locale) : DEFAULT_LOCALE;
}

// Reads the locale out of a raw Cookie header (or document.cookie).
export function parseLocaleCookie(cookieHeader: string | null | undefined): Locale {
  if (!cookieHeader) return DEFAULT_LOCALE;
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === LOCALE_COOKIE_NAME) return normalizeLocale(decodeURIComponent(rest.join("=")));
  }
  return DEFAULT_LOCALE;
}

/** Whether a language has ever been chosen in this browser (any locale cookie at all). */
export function hasLocaleCookie(cookieHeader: string | null | undefined): boolean {
  return (cookieHeader ?? "")
    .split(";")
    .some((part) => part.trim().startsWith(`${LOCALE_COOKIE_NAME}=`));
}

export function writeLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; ${LOCALE_COOKIE_ATTRIBUTES}`;
}
