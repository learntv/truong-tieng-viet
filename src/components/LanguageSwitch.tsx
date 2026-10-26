import { Icon } from "@iconify/react";
import roundTranslate from "@iconify-icons/ic/round-translate";
import { m } from "@/paraglide/messages";
import { getLocale, setLocale } from "@/paraglide/runtime";

/** Flips the UI between Vietnamese and English. The label names the language
    you'd switch to, in that language. setLocale writes the cookie and reloads,
    so the server renders the next page in the new locale. */
export function LanguageSwitch({ className }: { className?: string }) {
  const next = getLocale() === "vi" ? "en" : "vi";

  return (
    <button type="button" onClick={() => setLocale(next)} className={className}>
      <Icon icon={roundTranslate} className="h-5 w-5 shrink-0" aria-hidden />
      <span lang={next}>{m.language_switch()}</span>
    </button>
  );
}
