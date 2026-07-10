import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Check, Volume2, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ALPHABET, type AlphabetLetter } from "@/data/alphabet";
import { speak } from "@/lib/speech";
import { loadAlphabetProgress, markLetterSeen } from "@/lib/alphabet-progress";
import { STAGE_COLORS } from "@/components/learning/StageCard";

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
      { title: "Bảng chữ cái — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content: "Khám phá bảng chữ cái tiếng Việt cùng các bạn thú vui nhộn — nghe phát âm và học từ mới.",
      },
    ],
  }),
  component: BangChuCaiTab,
});

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
    <main className="relative -mb-8 flex-1 overflow-hidden bg-gradient-to-b from-sky-300 to-sky-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <SkyClouds />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Hero + progress card */}
        <div className="mx-auto mb-8 max-w-sm rounded-3xl bg-white p-5 text-center shadow-soft sm:p-6">
          <h1 className="font-display text-3xl font-extrabold text-navy">Bảng chữ cái 🎈</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Bấm vào từng chữ để gặp bạn thú, nghe cách đọc và học từ mới nhé!
          </p>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-navy/70">
              <span>Đã khám phá</span>
              <span>
                {seenCount}/{total} chữ
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted shadow-inner ring-1 ring-black/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-sky-400 transition-all duration-500 ease-out"
                style={{ width: `${total > 0 ? (seenCount / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Letter grid */}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5">
          {ALPHABET.map((letter) => (
            <LetterCard
              key={letter.id}
              letter={letter}
              isSeen={!!progress[letter.id]}
              onClick={() => openLetter(letter)}
            />
          ))}
        </div>
      </div>

      <LetterDetailDialog letter={activeLetter} onOpenChange={(open) => !open && setActiveLetter(null)} />
    </main>
  );
}

function SkyClouds() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Cloud className="left-[4%] top-6 h-10 w-24 opacity-90 sm:h-14 sm:w-32" />
      <Cloud className="right-[6%] top-16 h-8 w-20 opacity-80 sm:h-11 sm:w-28" style={{ animationDelay: "0.6s" }} />
      <Cloud className="left-[20%] top-40 h-7 w-16 opacity-70 sm:h-9 sm:w-20" style={{ animationDelay: "1.2s" }} />
      <Cloud className="right-[18%] top-52 h-9 w-20 opacity-70 sm:h-12 sm:w-28" style={{ animationDelay: "0.3s" }} />
      <Cloud className="left-[45%] top-4 h-6 w-14 opacity-60 sm:h-8 sm:w-20" style={{ animationDelay: "1.6s" }} />
    </div>
  );
}

function Cloud({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={["absolute animate-float-slow", className].join(" ")} style={style}>
      <div className="relative h-full w-full">
        <div className="absolute inset-x-0 bottom-0 h-3/5 rounded-full bg-white" />
        <div className="absolute bottom-1/4 left-0 h-4/5 w-2/5 rounded-full bg-white" />
        <div className="absolute bottom-1/3 right-0 h-3/5 w-2/5 rounded-full bg-white" />
        <div className="absolute bottom-1/3 left-1/3 h-full w-2/5 rounded-full bg-white" />
      </div>
    </div>
  );
}

function LetterCard({
  letter,
  isSeen,
  onClick,
}: {
  letter: AlphabetLetter;
  isSeen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-black/5 bg-white p-1.5 transition-all duration-200 ease-bounce hover:-translate-y-1 hover:border-primary/20 hover:animate-wiggle active:scale-95 sm:p-2"
    >
      {isSeen && (
        <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-sm">
          <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
        </span>
      )}
      <img
        src={LETTER_IMAGES[letter.id]}
        alt={`Bạn thú chữ ${letter.letter}`}
        className="h-1/2 w-auto object-contain drop-shadow-sm"
      />
      <span className="font-display text-xl font-extrabold text-navy sm:text-2xl">
        {letter.letter.toUpperCase()}/{letter.letter}
      </span>
    </button>
  );
}

function LetterDetailDialog({
  letter,
  onOpenChange,
}: {
  letter: AlphabetLetter | null;
  onOpenChange: (open: boolean) => void;
}) {
  const color = useMemo(() => {
    if (!letter) return STAGE_COLORS[0];
    const index = ALPHABET.findIndex((l) => l.id === letter.id);
    return STAGE_COLORS[index % STAGE_COLORS.length];
  }, [letter]);

  return (
    <Dialog open={!!letter} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-w-3xl overflow-hidden rounded-3xl border-none bg-white p-0 shadow-soft sm:rounded-[2.5rem]"
      >
        <DialogClose className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow-card transition hover:bg-red-600 active:scale-95">
          <X className="h-5 w-5" strokeWidth={2.5} />
          <span className="sr-only">Đóng</span>
        </DialogClose>
        {letter && (
          <div className="flex flex-col sm:flex-row">
            {/* Left: mascot on a soft colored background */}
            <div
              className={[
                "flex items-center justify-center p-10 sm:w-2/5",
                color.bgSoft,
              ].join(" ")}
            >
              <img
                src={LETTER_IMAGES[letter.id]}
                alt={`Bạn thú chữ ${letter.letter}`}
                className="h-56 w-auto object-contain drop-shadow-md animate-bob sm:h-64"
              />
            </div>

            {/* Right: header + sound icon, word list, on white background */}
            <div className="flex flex-1 flex-col gap-6 bg-white p-8 text-center sm:text-left">
              <div className="flex items-center justify-center gap-4 sm:justify-start">
                <DialogTitle className="font-display text-5xl font-extrabold text-navy">
                  {letter.letter.toUpperCase()}/{letter.letter}
                </DialogTitle>
                <button
                  onClick={() => speak(letter.soundName)}
                  aria-label={`Nghe đọc chữ ${letter.letter}`}
                  className={[
                    "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition active:scale-95",
                    color.gradient,
                    "shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:brightness-110",
                  ].join(" ")}
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {letter.words.map((word) => (
                  <button
                    key={word.vi}
                    onClick={() => speak(word.vi)}
                    className={[
                      "group flex cursor-pointer items-center gap-4 rounded-2xl p-3.5 text-left transition active:scale-95",
                      color.bgSoft,
                      "hover:brightness-95",
                    ].join(" ")}
                  >
                    <span className="text-3xl transition-transform group-hover:scale-110">{word.emoji}</span>
                    <span className="flex-1">
                      <span className="block font-display text-base font-extrabold text-navy">{word.vi}</span>
                      <span className="block text-sm text-muted-foreground">{word.en}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
