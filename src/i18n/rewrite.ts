import type { LocationRewrite } from "@tanstack/react-router";
import { DEFAULT_LOCALE, localeFromPathname, localizePathname, stripLocale } from "./config";

/**
 * Keeps the language prefix out of the route tree. On the way in, "/en/hoc-tap"
 * is matched as "/hoc-tap"; on the way out, every Link, navigate() and redirect
 * gets the current language's prefix back, so routes and links never mention
 * the locale.
 *
 * The current language is whatever the last parsed URL said. One rewrite
 * belongs to one router, and the server builds a router per request, so
 * concurrent requests never share it.
 */
export function createLocaleRewrite(): LocationRewrite {
  let current = DEFAULT_LOCALE;

  return {
    input: ({ url }) => {
      current = localeFromPathname(url.pathname);
      url.pathname = stripLocale(url.pathname);
      return url;
    },
    output: ({ url }) => {
      url.pathname = localizePathname(url.pathname, current);
      return url;
    },
  };
}
