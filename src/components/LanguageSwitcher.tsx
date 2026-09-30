import { Check, Languages } from "lucide-react";
import { LOCALES, useLocale, useT } from "@/i18n";
import { useSwitchLocale } from "@/i18n/useSwitchLocale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Header control: the current language code, opening a menu of languages in their own names. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useT();
  const { locale } = useLocale();
  const switchTo = useSwitchLocale();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={t.lang.label}
          className={[
            "flex h-9 shrink-0 items-center gap-1.5 rounded-full px-2.5 font-display text-sm font-bold uppercase text-white transition-colors hover:bg-white/20",
            className,
          ].join(" ")}
        >
          <Languages className="h-4 w-4" strokeWidth={2.5} />
          {locale}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LOCALES.map((code) => (
          <DropdownMenuItem
            key={code}
            lang={code}
            onClick={() => switchTo(code)}
            className="flex cursor-pointer items-center justify-between"
          >
            {t.lang[code]}
            {code === locale && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Sidebar row: every language as plain text, the active one in gold like the active page. */
export function LanguageSwitcherList() {
  const t = useT();
  const { locale } = useLocale();
  const switchTo = useSwitchLocale();

  return (
    <div role="group" aria-label={t.lang.label} className="flex items-center gap-5 py-3.5">
      <Languages className="h-4 w-4 shrink-0 text-white/70" strokeWidth={2.5} aria-hidden="true" />
      {LOCALES.map((code) => (
        <button
          key={code}
          lang={code}
          aria-pressed={code === locale}
          onClick={() => switchTo(code)}
          className={[
            "font-display text-base font-bold transition-colors",
            code === locale ? "text-gold" : "text-white hover:text-gold-soft",
          ].join(" ")}
        >
          {t.lang[code]}
        </button>
      ))}
    </div>
  );
}
