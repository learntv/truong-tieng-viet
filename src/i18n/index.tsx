import { createContext, useContext, useMemo, type ReactNode } from "react";

import en from "./messages/en";
import type { Messages } from "./messages/types";
import vi from "./messages/vi";
import { getLocale } from "./get-locale";
import { INTL_LOCALE, type Locale } from "./locale";

export type { Messages } from "./messages/types";
export * from "./locale";

const CATALOGS: Record<Locale, Messages> = { vi, en };

export function messagesFor(locale: Locale): Messages {
  return CATALOGS[locale];
}

export function formattersFor(locale: Locale) {
  const tag = INTL_LOCALE[locale];
  return {
    fmtNumber: (n: number, options?: Intl.NumberFormatOptions) => n.toLocaleString(tag, options),
    fmtDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) =>
      new Date(date).toLocaleDateString(tag, options),
  };
}

const LocaleContext = createContext<Locale | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

// The root route's error and not-found screens can render in place of the component that
// mounts the provider, so without one we read the cookie directly.
function useActiveLocale(): Locale {
  return useContext(LocaleContext) ?? getLocale();
}

/** The active catalog: `const t = useT(); t.nav.home`. */
export function useT(): Messages {
  return messagesFor(useActiveLocale());
}

/** The active locale code plus Intl formatters bound to it. */
export function useLocale() {
  const locale = useActiveLocale();
  return useMemo(() => ({ locale, ...formattersFor(locale) }), [locale]);
}
