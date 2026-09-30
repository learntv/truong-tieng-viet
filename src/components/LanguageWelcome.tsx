import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { FlagImg } from "@/components/FlagImg";
import { Mascot } from "@/components/Mascot";
import { hasLocaleCookie, type Locale } from "@/i18n";
import { useSwitchLocale } from "@/i18n/useSwitchLocale";

// We don't know the visitor's language yet, so this one dialog speaks both and doesn't go
// through the catalogs. A flag stands in for each language: the UK for English, Việt Nam for
// Vietnamese. English leads because it's what the page behind is already showing.
const OPTIONS: { locale: Locale; name: string; flag: string; tone: string }[] = [
  { locale: "en", name: "English", flag: "GB", tone: "bg-box-ice hover:bg-box-ice-deep" },
  { locale: "vi", name: "Tiếng Việt", flag: "VN", tone: "bg-box-peach hover:bg-box-peach-deep" },
];

/**
 * First visit only: Trâu con, set out on his hike, asks which language to use. Opens after
 * hydration when no language has ever been chosen in this browser, so the server render (and
 * every crawler) is untouched. It can't be dismissed: the only way out is one of the two
 * buttons, which saves the choice, so it never asks twice.
 */
export function LanguageWelcome() {
  const [open, setOpen] = useState(false);
  const switchTo = useSwitchLocale();

  useEffect(() => {
    if (!hasLocaleCookie(document.cookie)) setOpen(true);
  }, []);

  const choose = (next: Locale) => {
    switchTo(next);
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        hideCloseButton
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="w-[calc(100%-2rem)] max-w-sm gap-0 overflow-hidden rounded-[2rem] border-[6px] border-white bg-white p-0 shadow-2xl sm:max-w-md sm:border-[8px]"
      >
        {/* Sky band with Trâu con striding across a hill: the same top-to-mid blue as the
          page's own sky, with the white circles reading as clouds. */}
        <div className="relative flex h-40 items-end justify-center overflow-hidden rounded-[1.4rem] bg-gradient-to-b from-sky-top to-sky-mid sm:h-48">
          <div
            aria-hidden="true"
            className="absolute -left-8 -top-10 h-32 w-32 rounded-full bg-white/50"
          />
          <div
            aria-hidden="true"
            className="absolute -right-6 top-6 h-20 w-20 rounded-full bg-white/40"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-16 left-1/2 h-28 w-[140%] -translate-x-1/2 rounded-[100%] bg-grass"
          />
          <Mascot pose="hiking" decorative className="relative mb-3 h-32 sm:h-40" />
        </div>

        <div className="px-5 pb-6 pt-5 text-center sm:px-7 sm:pb-7">
          <DialogTitle className="font-display text-3xl font-extrabold leading-tight text-sky-ink">
            <span lang="vi">Xin chào!</span>{" "}
            <span lang="en" className="text-indigo">
              Hello!
            </span>
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm font-semibold text-sky-ink-soft sm:text-base">
            <span lang="vi">Chọn ngôn ngữ</span>
            <span aria-hidden="true"> · </span>
            <span lang="en">Choose your language</span>
          </DialogDescription>

          <div className="mt-5 flex flex-col gap-3">
            {OPTIONS.map((option) => (
              <button
                key={option.locale}
                type="button"
                lang={option.locale}
                onClick={() => choose(option.locale)}
                className={[
                  "group flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-3.5 text-left shadow-btn transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 active:translate-y-[1px] active:shadow-btn-active",
                  option.tone,
                ].join(" ")}
              >
                <span className="shrink-0 overflow-hidden rounded-md ring-2 ring-white">
                  <FlagImg code={option.flag} size={44} />
                </span>
                <span className="flex-1 font-display text-lg font-bold text-sky-ink">
                  {option.name}
                </span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/80 text-sky-ink transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
