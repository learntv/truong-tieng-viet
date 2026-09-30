import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import { LOCALE_COOKIE_NAME, normalizeLocale, parseLocaleCookie } from "./locale";

// Same cookie, same normalisation on both sides, so the server render and the client's first
// render always agree on the language.
export const getLocale = createIsomorphicFn()
  .server(() => normalizeLocale(getCookie(LOCALE_COOKIE_NAME)))
  .client(() => parseLocaleCookie(document.cookie));
