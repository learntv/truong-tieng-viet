import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Download, Volume2, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mascot } from "@/components/Mascot";
import { BackLink } from "@/components/BackLink";
import { PageBanner } from "@/components/site/PageBanner";
import { ALPHABET, type AlphabetLetter, type AlphabetWord } from "@/data/alphabet";
import { loadAlphabetProgress, markLetterSeen } from "@/lib/alphabet-progress";
import { STAGE_COLORS } from "@/components/learning/stageColors";
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
      { title: "Bảng chữ cái — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Khám phá bảng chữ cái tiếng Việt cùng các bạn thú vui nhộn — nghe phát âm và học từ mới.",
      },
      { property: "og:title", content: "Bảng chữ cái — Trường Tiếng Việt Của Em" },
      { property: "og:description", content: "Khám phá bảng chữ cái tiếng Việt cùng các bạn thú vui nhộn — nghe phát âm và học từ mới." },
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
    <main className="pb-24">
      <PageBanner
        title="Bảng chữ cái 🎈"
        subtitle="Bấm vào từng chữ để gặp bạn thú, nghe cách đọc và học từ mới nhé!"
        back={<BackLink to="/hoc-tap" label="Quay lại học tập" />}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Progress — the title that used to head this card now lives in the
          PageBanner, so the card carries the counter alone. */}
        <Card className="mx-auto mb-8 max-w-2xl p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <Mascot pose="reading" decorative className="h-16 sm:h-20" />
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Đã khám phá
                </span>
                <Badge variant="stage-1">
                  {seenCount}/{total} chữ
                </Badge>
              </div>
              <Progress tone="stage-1" value={total > 0 ? (seenCount / total) * 100 : 0} />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <a
              href={ALPHABET_PDF_URL}
              download
              className="flex cursor-pointer items-center gap-2 rounded-full bg-stage-1 px-4 py-2 text-sm font-bold text-white shadow-card transition hover:brightness-110 active:translate-y-[1px]"
            >
              <Download className="h-4 w-4" />
              Tải PDF bảng chữ cái
            </a>
          </div>
        </Card>

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

      <LetterDetailDialog
        letter={activeLetter}
        onOpenChange={(open) => !open && setActiveLetter(null)}
      />
    </main>
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
    <Card
      asChild
      interactive
      className="group relative aspect-square transition-[transform,box-shadow] ease-bounce hover:-translate-y-1 active:translate-y-0"
    >
      <button
        onClick={onClick}
        className="flex cursor-pointer flex-col items-center justify-center gap-1 p-1.5 sm:p-2"
      >
        {isSeen && (
          <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full border-2 border-card bg-stage-1 shadow-card">
            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
          </span>
        )}
        <img
          src={LETTER_IMAGES[letter.id]}
          alt={`Bạn thú chữ ${letter.letter}`}
          className="h-1/2 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
        <span className="font-display text-xl font-bold text-ink sm:text-2xl">
          {letter.letter.toUpperCase()}/{letter.letter}
        </span>
      </button>
    </Card>
  );
}

type StageColor = (typeof STAGE_COLORS)[number];

function LetterSoundButton({
  text,
  label,
  color,
}: {
  text: string;
  label: string;
  color: StageColor;
}) {
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
        className={[
          "grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full text-white",
          "transition-[transform,box-shadow,filter] duration-150 ease-bounce hover:brightness-110 active:translate-y-[2px]",
          color.gradient,
          "shadow-card",
        ].join(" ")}
      >
        <Volume2 className="h-5 w-5" />
      </button>
    </>
  );
}

function WordRow({ word, color }: { word: AlphabetWord; color: StageColor }) {
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
        className={[
          "group flex cursor-pointer items-center gap-4 rounded-2xl p-3.5 text-left",
          "transition-[transform,filter] duration-150 ease-bounce hover:brightness-95 active:translate-y-[2px]",
          color.bgSoft,
        ].join(" ")}
      >
        <span className="text-3xl transition-transform group-hover:scale-110">{word.emoji}</span>
        <span className="flex-1">
          <span className="block font-display text-base font-bold text-ink">{word.vi}</span>
          <span className="block text-sm text-muted-foreground">{word.en}</span>
        </span>
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
  const color = useMemo(() => {
    if (!letter) return STAGE_COLORS[0];
    const index = ALPHABET.findIndex((l) => l.id === letter.id);
    return STAGE_COLORS[index % STAGE_COLORS.length];
  }, [letter]);

  return (
    <Dialog open={!!letter} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-3xl gap-0 overflow-hidden border-0 bg-card p-0"
      >
        <DialogClose className="absolute right-3 top-3 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/90 text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.15)] ring-1 ring-black/10 transition hover:scale-105">
          <X className="h-5 w-5" strokeWidth={2.5} />
          <span className="sr-only">Đóng</span>
        </DialogClose>
        {letter && (
          <div className="flex max-h-[92vh] flex-col overflow-y-auto sm:flex-row sm:overflow-hidden">
            {/* Left: the letter's animal friend on a soft stage-colored panel */}
            <div
              className={[
                "flex shrink-0 items-center justify-center p-8 sm:w-2/5 sm:p-10",
                color.bgSoft,
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
                <DialogTitle className="font-display text-4xl font-bold text-ink sm:text-5xl">
                  {letter.letter.toUpperCase()}/{letter.letter}
                </DialogTitle>
                <LetterSoundButton text={letter.soundName} label={letter.letter} color={color} />
              </div>

              <div className="flex flex-col gap-3">
                {letter.words.map((word) => (
                  <WordRow key={word.vi} word={word} color={color} />
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
