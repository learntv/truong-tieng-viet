import { Check, Globe } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { useLocale, useTranslations } from "use-intl";
import { LOCALES, LOCALE_NAMES, localizePathname } from "@/i18n/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Globe + language code in the navbar, opening a list of languages each named
 * in itself. Each entry is a plain link to the same page under that language's
 * prefix: a full load, so the page comes back with the new language's
 * messages from the server.
 */
export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const current = useLocale();
  // The router's location is already stripped of the language prefix.
  const { pathname, searchStr, hash } = useRouterState({ select: (s) => s.location });
  const suffix = searchStr + (hash ? `#${hash}` : "");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={t("language")}
        className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-2 font-display text-sm font-bold text-white uppercase transition hover:bg-white/20"
      >
        <Globe className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        {current}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {LOCALES.map((locale) => (
          <DropdownMenuItem key={locale} asChild>
            <a
              href={localizePathname(pathname, locale) + suffix}
              hrefLang={locale}
              lang={locale}
              aria-current={locale === current ? "true" : undefined}
              className="flex cursor-pointer items-center justify-between"
            >
              {LOCALE_NAMES[locale]}
              {locale === current && <Check className="h-4 w-4" aria-hidden />}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
