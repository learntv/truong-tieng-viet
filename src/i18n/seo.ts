import { DEFAULT_LOCALE, LOCALES, localizePathname } from "./config";

export const SITE_URL = "https://truongtiengviet.cvcec.org";

/**
 * Pages whose content is translated, not just the navbar and footer around it.
 * Only these get hreflang alternates and a sitemap entry per language; every
 * other page still works under /en but is only offered to search engines in
 * Vietnamese. Add a path here once its page is translated.
 */
export const TRANSLATED_PATHS = ["/"];

/** hreflang alternates for a translated page, one per language plus x-default. */
export function alternateLinks(pathname: string) {
  return [
    ...LOCALES.map((locale) => ({
      rel: "alternate",
      hrefLang: locale,
      href: SITE_URL + localizePathname(pathname, locale),
    })),
    {
      rel: "alternate",
      hrefLang: "x-default",
      href: SITE_URL + localizePathname(pathname, DEFAULT_LOCALE),
    },
  ];
}
