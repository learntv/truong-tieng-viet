import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Icon } from "@iconify/react";
import roundArrowBack from "@iconify-icons/ic/round-arrow-back";
import roundArrowForward from "@iconify-icons/ic/round-arrow-forward";
import roundClose from "@iconify-icons/ic/round-close";
import roundVolumeUp from "@iconify-icons/ic/round-volume-up";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BOX_TONES } from "@/components/learning/boxTones";
import { Mascot } from "@/components/Mascot";
import { PageBanner } from "@/components/site/PageBanner";
import { SectionHeading } from "@/components/tabs/HocTapHome";
import { IdiomArt } from "@/components/thanh-ngu/IdiomArt";
import { IdiomGames } from "@/components/thanh-ngu/IdiomGames";
import { IDIOMS, idiomText, type Idiom, type IdiomText } from "@/data/thanh-ngu";
import { useSingletonAudio } from "@/hooks/useSingletonAudio";
import { glossOf } from "@/lib/localized";
import { sfx } from "@/lib/sfx";
import { ttsSrc } from "@/lib/tts/text";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/hoc-tap/thanh-ngu")({
  head: () => ({
    meta: [
      { title: m.learn_meta_idioms_title() },
      { name: "description", content: m.learn_meta_idioms_description() },
      { property: "og:title", content: m.learn_meta_idioms_title() },
      { property: "og:description", content: m.learn_meta_idioms_description() },
      { property: "og:url", content: "/hoc-tap/thanh-ngu" },
    ],
    links: [{ rel: "canonical", href: "/hoc-tap/thanh-ngu" }],
  }),
  component: ThanhNguPage,
});

/**
 * Thành ngữ: a wall of picture cards, each idiom drawn at its word, then the
 * idiom games. A card, or a game's "see the meaning", opens the
 * idiom's page: the words one by one, the picture they paint, what people
 * really mean by it, and a sentence that uses it.
 */
function ThanhNguPage() {
  const [active, setActive] = useState<number | null>(null);

  const open = (index: number) => {
    sfx.pop();
    setActive(index);
  };

  return (
    <div className="pb-10 sm:pb-12">
      <PageBanner
        title={m.learn_idioms()}
        back={{ label: m.learn_learning(), to: "/hoc-tap" }}
        art={<Mascot pose="thinking" decorative className="relative h-24 sm:h-36" />}
      />

      <section className="mt-8 px-4 sm:mt-10 sm:px-8">
        <SectionHeading title={m.learn_idioms_collection()} />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {IDIOMS.map((idiom, i) => (
            <IdiomCard key={idiom.id} idiom={idiom} index={i} onClick={() => open(i)} />
          ))}
        </div>
      </section>

      <section className="mt-10 px-4 sm:mt-12 sm:px-8">
        <SectionHeading title={m.learn_idioms_games()} />
        <IdiomGames onSeeMeaning={(idiom) => open(IDIOMS.indexOf(idiom))} />
      </section>

      <IdiomDialog
        index={active}
        onIndexChange={setActive}
        onOpenChange={(o) => !o && setActive(null)}
      />
    </div>
  );
}

/** Cards sit a touch askew, like stickers on a page, and straighten up on hover. */
const TILTS = ["-rotate-1", "rotate-1", "rotate-0", "rotate-[0.6deg]", "-rotate-[0.6deg]"];

function IdiomCard({
  idiom,
  index,
  onClick,
}: {
  idiom: Idiom;
  index: number;
  onClick: () => void;
}) {
  const tone = BOX_TONES[idiom.tone];
  const gloss = glossOf(idiom.translation);
  return (
    <button
      onClick={onClick}
      className={[
        "idiom-card relative flex cursor-pointer flex-col rounded-[1.25rem] p-2 text-left shadow-[0_6px_20px_rgba(12,58,110,0.14)] outline-4 outline-offset-0 outline-transparent transition-[outline-color,scale,rotate] duration-150 hover:z-10 hover:rotate-0 hover:scale-[1.04] sm:rounded-[1.5rem]",
        TILTS[index % TILTS.length],
        tone.deep,
        tone.outline,
      ].join(" ")}
    >
      <div
        className={[
          "aspect-[3/2] overflow-hidden rounded-[0.9rem] sm:rounded-[1.1rem]",
          tone.light,
        ].join(" ")}
      >
        <IdiomArt id={idiom.id} className="block h-full w-full" />
      </div>
      <div className="px-2 pb-1.5 pt-3">
        <h3
          lang="vi"
          className="font-display text-base font-bold leading-tight text-sky-ink sm:text-lg"
        >
          {idiomText(idiom)}
        </h3>
        {gloss && <p className="mt-1 text-xs leading-snug text-sky-ink-soft sm:text-sm">{gloss}</p>}
      </div>
    </button>
  );
}

/** The round play button that reads `text` aloud. */
function ListenButton({ text, size = "md" }: { text: string; size?: "sm" | "md" }) {
  const { play, playing, audioRef, src, onEnded, onPause, onError } = useSingletonAudio(
    ttsSrc(text),
  );
  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onEnded={onEnded}
        onPause={onPause}
        onError={onError}
      />
      <button
        onClick={play}
        aria-label={m.learn_listen_to({ text })}
        className={[
          "grid shrink-0 cursor-pointer place-items-center rounded-full bg-primary text-white shadow-btn transition-[transform,box-shadow,background-color] hover:bg-primary-glow active:translate-y-[1px] active:shadow-btn-active",
          size === "md" ? "h-11 w-11" : "h-9 w-9",
          playing ? "animate-pulse" : "",
        ].join(" ")}
      >
        <Icon icon={roundVolumeUp} className={size === "md" ? "h-5 w-5" : "h-4 w-4"} aria-hidden />
      </button>
    </>
  );
}

/** One word of the idiom, its English under it; tapping says it aloud. */
function WordChip({ word, tone }: { word: Idiom["words"][number]; tone: string }) {
  const { play, playing, audioRef, src, onEnded, onPause, onError } = useSingletonAudio(
    ttsSrc(word.vi),
  );
  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onEnded={onEnded}
        onPause={onPause}
        onError={onError}
      />
      <button
        onClick={play}
        aria-label={m.learn_listen_to({ text: word.vi })}
        className={[
          "flex cursor-pointer flex-col items-center rounded-2xl px-3.5 py-2 transition-[scale] duration-150 hover:scale-105 active:scale-95",
          tone,
          playing ? "scale-105" : "",
        ].join(" ")}
      >
        <span lang="vi" className="font-display text-lg font-bold leading-tight text-sky-ink">
          {word.vi}
        </span>
        <span className="text-xs font-semibold text-sky-ink-soft">{word.en}</span>
      </button>
    </>
  );
}

const LABEL = "text-xs font-extrabold uppercase tracking-[0.08em] text-sky-ink-soft";

/** A line of explanation, with its English beneath when the site is in English. */
function Explained({ text, strong = false }: { text: IdiomText; strong?: boolean }) {
  const gloss = glossOf(text);
  return (
    <>
      <p
        lang="vi"
        className={[
          "mt-1.5 leading-relaxed text-sky-ink",
          strong ? "font-display text-lg font-bold" : "text-base",
        ].join(" ")}
      >
        {text.vi}
      </p>
      {gloss && <p className="mt-1 text-sm leading-relaxed text-sky-ink-soft">{gloss}</p>}
    </>
  );
}

function IdiomDialog({
  index,
  onIndexChange,
  onOpenChange,
}: {
  index: number | null;
  onIndexChange: (index: number) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const idiom = index === null ? null : IDIOMS[index];

  const step = (by: number) => {
    if (index === null) return;
    sfx.click();
    onIndexChange((index + by + IDIOMS.length) % IDIOMS.length);
  };

  return (
    <Dialog open={!!idiom} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
        className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-4xl gap-0 overflow-hidden rounded-[1.75rem] border-0 bg-white p-0 shadow-2xl sm:rounded-[2rem]"
      >
        <DialogClose className="absolute right-3 top-3 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white text-sky-ink shadow-btn transition-transform hover:scale-105 active:translate-y-[1px] active:shadow-btn-active">
          <Icon icon={roundClose} className="h-5 w-5" aria-hidden />
          <span className="sr-only">{m.learn_close()}</span>
        </DialogClose>
        {idiom && (
          <IdiomDetail
            key={idiom.id}
            idiom={idiom}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * An idiom's page, sized to fit without scrolling on a desktop: the idiom on
 * top, then the picture whole at its own 3:2 shape with what it shows beneath,
 * and beside it the words, what it means and an example. Space and hairlines
 * set them apart rather than boxes; the picture and the word chips carry the
 * colour, and the rest stays quiet.
 */
function IdiomDetail({
  idiom,
  onPrev,
  onNext,
}: {
  idiom: Idiom;
  onPrev: () => void;
  onNext: () => void;
}) {
  const tone = BOX_TONES[idiom.tone];
  const text = idiomText(idiom);
  const gloss = glossOf(idiom.translation);
  const stepButton =
    "grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/90 text-sky-ink shadow-btn transition-[transform,background-color] hover:bg-white active:translate-y-[1px] active:shadow-btn-active";

  return (
    <div className="max-h-[92vh] overflow-y-auto p-5 sm:p-7">
      <div className="flex items-center gap-3 pr-10">
        <div className="min-w-0">
          <DialogTitle
            lang="vi"
            className="font-display text-2xl font-bold leading-tight text-sky-ink sm:text-3xl"
          >
            {text}
          </DialogTitle>
          {gloss && <p className="mt-1 text-base text-sky-ink-soft sm:text-lg">{gloss}</p>}
        </div>
        <ListenButton text={text} />
      </div>

      <div className="mt-5 grid gap-6 sm:grid-cols-2 sm:gap-8">
        {/* Left: the scene, playing, and what it shows. */}
        <div>
          <div className={["relative overflow-hidden rounded-[1.25rem]", tone.light].join(" ")}>
            <IdiomArt
              id={idiom.id}
              label={m.learn_idioms_art_alt({ idiom: text })}
              className="block aspect-[3/2] w-full animate-in fade-in duration-300"
            />
            <div className="absolute inset-x-3 bottom-3 flex justify-between">
              <button onClick={onPrev} aria-label={m.learn_idioms_prev()} className={stepButton}>
                <Icon icon={roundArrowBack} className="h-5 w-5" aria-hidden />
              </button>
              <button onClick={onNext} aria-label={m.learn_idioms_next()} className={stepButton}>
                <Icon icon={roundArrowForward} className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
          <section className="mt-4">
            <h3 className={LABEL}>{m.learn_idioms_literal()}</h3>
            <Explained text={idiom.literal} />
          </section>
        </div>

        {/* Right: the words one by one, what it means, and an example. */}
        <div>
          <div className="flex flex-wrap gap-2">
            {idiom.words.map((word, i) => (
              <WordChip key={i} word={word} tone={tone.light} />
            ))}
          </div>
          <div className="mt-5 divide-y divide-sky-ink/10 border-t border-sky-ink/10">
            <section className="py-4">
              <h3 className={LABEL}>{m.learn_idioms_meaning()}</h3>
              <Explained text={idiom.meaning} strong />
            </section>
            <section className="pt-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className={LABEL}>{m.learn_idioms_example()}</h3>
                <ListenButton text={idiom.example.vi} size="sm" />
              </div>
              <Explained text={idiom.example} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
