import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Download, Volume2, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Mascot } from "@/components/Mascot";
import { PageBanner } from "@/components/site/PageBanner";
import { skyButton } from "@/components/ui/sky-button";
import { ALPHABET, type AlphabetLetter, type AlphabetWord } from "@/data/alphabet";
import { loadAlphabetProgress, markLetterSeen } from "@/lib/alphabet-progress";
import { toneAt } from "@/components/learning/boxTones";
import { useSingletonAudio } from "@/hooks/useSingletonAudio";
import { ttsSrc } from "@/lib/tts/text";

import aImg from "@/assets/alphabet/a.png";
import aBreveImg from "@/assets/alphabet/a-breve.png";
import aCircumflexImg from "@/assets/alphabet/a-circumflex.png";
import bImg from "@/assets/alphabet/b.png";
import cImg from "@/assets/alphabet/c.png";
import dImg from "@/assets/alphabet/d.png";
import dBarImg from "@/assets/alphabet/d-bar.png";
import eImg from "@/assets/alphabet/e.png";
import eCircumflexImg from "@/assets/alphabet/e-circumflex.png";
import gImg from "@/assets/alphabet/g.png";
import hImg from "@/assets/alphabet/h.png";
import iImg from "@/assets/alphabet/i.png";
import kImg from "@/assets/alphabet/k.png";
import lImg from "@/assets/alphabet/l.png";
import mImg from "@/assets/alphabet/m.png";
import nImg from "@/assets/alphabet/n.png";
import oImg from "@/assets/alphabet/o.png";
import oCircumflexImg from "@/assets/alphabet/o-circumflex.png";
import oHornImg from "@/assets/alphabet/o-horn.png";
import pImg from "@/assets/alphabet/p.png";
import qImg from "@/assets/alphabet/q.png";
import rImg from "@/assets/alphabet/r.png";
import sImg from "@/assets/alphabet/s.png";
import tImg from "@/assets/alphabet/t.png";
import uImg from "@/assets/alphabet/u.png";
import uHornImg from "@/assets/alphabet/u-horn.png";
import vImg from "@/assets/alphabet/v.png";
import xImg from "@/assets/alphabet/x.png";
import yImg from "@/assets/alphabet/y.png";

const LETTER_IMAGES: Record<string, string> = {
  a: aImg,
  "a-breve": aBreveImg,
  "a-circumflex": aCircumflexImg,
  b: bImg,
  c: cImg,
  d: dImg,
  "d-bar": dBarImg,
  e: eImg,
  "e-circumflex": eCircumflexImg,
  g: gImg,
  h: hImg,
  i: iImg,
  k: kImg,
  l: lImg,
  m: mImg,
  n: nImg,
  o: oImg,
  "o-circumflex": oCircumflexImg,
  "o-horn": oHornImg,
  p: pImg,
  q: qImg,
  r: rImg,
  s: sImg,
  t: tImg,
  u: uImg,
  "u-horn": uHornImg,
  v: vImg,
  x: xImg,
  y: yImg,
};

export const Route = createFileRoute("/hoc-tap/bang-chu-cai")({
  head: () => ({
    meta: [
      { title: "Bảng chữ cái | Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Khám phá bảng chữ cái tiếng Việt cùng các bạn thú vui nhộn: nghe phát âm và học từ mới.",
      },
      { property: "og:title", content: "Bảng chữ cái | Trường Tiếng Việt Của Em" },
      { property: "og:description", content: "Khám phá bảng chữ cái tiếng Việt cùng các bạn thú vui nhộn: nghe phát âm và học từ mới." },
      { property: "og:url", content: "/hoc-tap/bang-chu-cai" },
    ],
    links: [{ rel: "canonical", href: "/hoc-tap/bang-chu-cai" }],
  }),
  component: BangChuCaiTab,
});

const ALPHABET_PDF_URL = "https://bucket.bambootech.fi/misc/bang-chu-cai-tieng-viet-v2.pdf";

function BangChuCaiTab() {
  const [progress, setProgress] = useState<Record<string, true>>({});
  const [activeLetter, setActiveLetter] = useState<AlphabetLetter | null>(null);

  useEffect(() => {
    setProgress(loadAlphabetProgress());
  }, []);

  const seenCount = Object.keys(progress).length;
  const total = ALPHABET.length;

  const openLetter = (letter: AlphabetLetter) => {
    setActiveLetter(letter);
    setProgress(markLetterSeen(letter.id));
  };

  return (
    <div className="pb-10 sm:pb-12">
      <PageBanner
        title="Bảng chữ cái"
        parents={[{ label: "Học tập", to: "/hoc-tap" }]}
        art={<Mascot pose="reading" decorative className="relative h-24 sm:h-36" />}
      />

      <div className="px-4 pt-8 sm:px-8">
        {/* Progress on the left, the printable chart on the right. */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.08em] text-sky-ink-soft">
                Đã khám phá
              </span>
              <span className="font-display text-sm font-bold text-sky-ink">
                {seenCount}/{total} chữ
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-green transition-[width] duration-500 ease-out"
                style={{ width: `${total > 0 ? (seenCount / total) * 100 : 0}%` }}
              />
            </div>
          </div>

          <a
            href={ALPHABET_PDF_URL}
            download
            className={skyButton("white", "shrink-0 self-start ring-1 ring-sky-ink/10 sm:self-auto")}
          >
            <Download className="h-4 w-4" strokeWidth={2.5} />
            Tải PDF bảng chữ cái
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
          {ALPHABET.map((letter, i) => (
            <LetterCard
              key={letter.id}
              letter={letter}
              index={i}
              isSeen={!!progress[letter.id]}
              onClick={() => openLetter(letter)}
            />
          ))}
        </div>
      </div>

      <LetterDetailDialog
        letter={activeLetter}
        onOpenChange={(open) => !open && setActiveLetter(null)}
      />
    </div>
  );
}

type Tone = ReturnType<typeof toneAt>;

/**
 * A letter's tile: its animal friend and the letter on a tone, cycled by
 * position like the Học tập practice cards, growing slightly on hover with
 * a deeper rim of its own tone.
 */
function LetterCard({
  letter,
  index,
  isSeen,
  onClick,
}: {
  letter: AlphabetLetter;
  index: number;
  isSeen: boolean;
  onClick: () => void;
}) {
  const tone = toneAt(index);
  return (
    <button
      onClick={onClick}
      className={[
        "relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-[1.25rem] p-2 shadow-[0_4px_14px_rgba(12,58,110,0.12)] outline-4 outline-offset-0 outline-transparent transition-[outline-color,scale] duration-150 hover:z-10 hover:scale-[1.04]",
        tone.light,
        tone.outline,
      ].join(" ")}
    >
      {isSeen && (
        <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white text-green">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
          <span className="sr-only">Đã xem</span>
        </span>
      )}
      <img
        src={LETTER_IMAGES[letter.id]}
        alt={`Bạn thú chữ ${letter.letter}`}
        className="h-1/2 w-auto object-contain"
      />
      <span className="font-display text-xl font-bold text-sky-ink sm:text-2xl">
        {letter.letter.toUpperCase()}/{letter.letter}
      </span>
    </button>
  );
}

function LetterSoundButton({ text, label }: { text: string; label: string }) {
  const { play, audioRef, src, onEnded, onPause, onError } = useSingletonAudio(ttsSrc(text));
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
        aria-label={`Nghe đọc chữ ${label}`}
        className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full bg-primary text-white shadow-btn transition-[transform,box-shadow,background-color] hover:bg-primary-glow active:translate-y-[1px] active:shadow-btn-active"
      >
        <Volume2 className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </>
  );
}

function WordRow({ word, tone }: { word: AlphabetWord; tone: Tone }) {
  const { play, audioRef, src, onEnded, onPause, onError } = useSingletonAudio(ttsSrc(word.vi));
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
        aria-label={`Nghe đọc: ${word.vi}`}
        className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-border/70 bg-card p-2.5 pr-4 text-left shadow-[0_2px_10px_rgba(15,23,42,0.05)] transition-shadow duration-150 hover:shadow-[0_6px_20px_rgba(15,23,42,0.09)]"
      >
        <span
          className={[
            "grid h-12 w-12 shrink-0 place-items-center rounded-xl text-3xl",
            tone.light,
          ].join(" ")}
        >
          <span className="transition-transform group-hover:scale-110">{word.emoji}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-base font-bold text-sky-ink">{word.vi}</span>
          <span className="block text-sm text-sky-ink-soft">{word.en}</span>
        </span>
        <Volume2 className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-sky-ink" strokeWidth={2.5} />
      </button>
    </>
  );
}

function LetterDetailDialog({
  letter,
  onOpenChange,
}: {
  letter: AlphabetLetter | null;
  onOpenChange: (open: boolean) => void;
}) {
  // Same tone as the letter's tile in the grid.
  const tone = useMemo(
    () => toneAt(letter ? ALPHABET.findIndex((l) => l.id === letter.id) : 0),
    [letter],
  );

  return (
    <Dialog open={!!letter} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-3xl gap-0 overflow-hidden rounded-[1.75rem] border-[6px] border-white bg-white p-0 shadow-2xl sm:rounded-[2rem] sm:border-[8px]"
      >
        <DialogClose className="absolute right-3 top-3 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white text-sky-ink shadow-btn transition-transform hover:scale-105 active:translate-y-[1px] active:shadow-btn-active">
          <X className="h-5 w-5" strokeWidth={2.5} />
          <span className="sr-only">Đóng</span>
        </DialogClose>
        {letter && (
          <div className="flex max-h-[92vh] flex-col overflow-y-auto sm:flex-row sm:overflow-hidden">
            {/* Left: the letter's animal friend on its tile's tone */}
            <div
              className={[
                "flex shrink-0 items-center justify-center rounded-[1.25rem] p-8 sm:w-2/5 sm:rounded-[1.5rem] sm:p-10",
                tone.light,
              ].join(" ")}
            >
              <img
                src={LETTER_IMAGES[letter.id]}
                alt={`Bạn thú chữ ${letter.letter}`}
                className="h-40 w-auto animate-breathe object-contain sm:h-64"
              />
            </div>

            {/* Right: letter + sound button, then the word list */}
            <div className="flex flex-1 flex-col gap-6 p-6 text-center sm:overflow-y-auto sm:p-8 sm:text-left">
              <div className="flex items-center justify-center gap-4 sm:justify-start">
                <DialogTitle className="font-display text-4xl font-bold text-sky-ink sm:text-5xl">
                  {letter.letter.toUpperCase()}/{letter.letter}
                </DialogTitle>
                <LetterSoundButton text={letter.soundName} label={letter.letter} />
              </div>

              <div className="flex flex-col gap-3">
                {letter.words.map((word) => (
                  <WordRow key={word.vi} word={word} tone={tone} />
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
