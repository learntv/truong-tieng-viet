import { useRouter } from "@tanstack/react-router";
import { useLocale } from "./index";
import { writeLocaleCookie, type Locale } from "./locale";

/**
 * Saves the choice in the cookie, then re-runs the root beforeLoad so the new locale flows
 * through router context: the page and its <title> re-render in place, query data is left
 * alone. The cookie is written even when the locale doesn't change, so picking the language
 * already on screen still counts as having chosen (see LanguageWelcome).
 */
export function useSwitchLocale() {
  const router = useRouter();
  const { locale: current } = useLocale();
  return (locale: Locale) => {
    writeLocaleCookie(locale);
    if (locale === current) return;
    // The shell's <html> is never re-rendered on the client, so set lang by hand.
    document.documentElement.lang = locale;
    void router.invalidate();
  };
}
