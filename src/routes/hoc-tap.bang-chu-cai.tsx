import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Download, Languages, Volume2, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mascot } from "@/components/Mascot";
import { BackLink } from "@/components/BackLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
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
      {
        property: "og:description",
        content:
          "Khám phá bảng chữ cái tiếng Việt cùng các bạn thú vui nhộn — nghe phát âm và học từ mới.",
      },
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
    <>
      <PageHeader
        icon={Languages}
        hue="grape"
        title="Bảng chữ cái"
        lede="Bấm vào từng chữ để gặp bạn thú, nghe cách đọc và học từ mới nhé!"
        back={<BackLink to="/hoc-tap" label="Học tập" />}
        aside={
          <div className="w-full rounded-3xl border border-ink-100 bg-white p-5 shadow-md md:w-80">
            <div className="flex items-center gap-4">
              <Mascot pose="reading" decorative className="h-16" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-600">Đã khám phá</p>
                <p className="text-h2 text-ink-900 tabular-nums">
                  {seenCount}
                  <span className="text-lede font-semibold text-ink-400">/{total} chữ</span>
                </p>
              </div>
            </div>
            <Progress
              tone="stage-3"
              value={total > 0 ? (seenCount / total) * 100 : 0}
              className="mt-4"
              aria-label="Số chữ đã khám phá"
            />
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <a href={ALPHABET_PDF_URL} download>
                <Download aria-hidden />
                Tải PDF bảng chữ cái
              </a>
            </Button>
          </div>
        }
      />

      <Container className="pb-16 sm:pb-24">
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
          {ALPHABET.map((letter, i) => (
            <li key={letter.id}>
              <LetterCard
                letter={letter}
                color={STAGE_COLORS[i % STAGE_COLORS.length]}
                isSeen={!!progress[letter.id]}
                onClick={() => openLetter(letter)}
              />
            </li>
          ))}
        </ul>
      </Container>

      <LetterDetailDialog
        letter={activeLetter}
        onOpenChange={(open) => !open && setActiveLetter(null)}
      />
    </>
  );
}

function LetterCard({
  letter,
  color,
  isSeen,
  onClick,
}: {
  letter: AlphabetLetter;
  color: StageColor;
  isSeen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Chữ ${letter.letter}${isSeen ? " — đã khám phá" : ""}`}
      className={[
        "group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-3xl p-2 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-md active:scale-95",
        color.bgSoft,
      ].join(" ")}
    >
      {isSeen && (
        <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-leaf-600 text-white shadow-sm">
          <Check className="size-3.5" strokeWidth={3} aria-hidden />
        </span>
      )}
      <img
        src={LETTER_IMAGES[letter.id]}
        alt=""
        className="h-1/2 w-auto object-contain transition-transform duration-300 ease-spring group-hover:scale-110"
      />
      <span className={["text-xl font-extrabold sm:text-2xl", color.text].join(" ")}>
        {letter.letter.toUpperCase()}
        <span className="text-ink-400">/</span>
        {letter.letter}
      </span>
    </button>
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
          "grid size-12 shrink-0 cursor-pointer place-items-center rounded-full text-white",
          "transition-transform duration-200 hover:-translate-y-0.5 active:scale-90",
          color.bg,
          color.bevel,
        ].join(" ")}
      >
        <Volume2 className="size-5" />
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
          "group flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-ink-100 bg-white p-3 text-left",
          "transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-ink-200 hover:shadow-sm active:scale-[0.98]",
        ].join(" ")}
      >
        <span
          className={[
            "grid size-12 shrink-0 place-items-center rounded-xl text-2xl transition-transform group-hover:scale-110",
            color.bgSoft,
          ].join(" ")}
        >
          {word.emoji}
        </span>
        <span className="flex-1">
          <span className="block text-lg font-bold text-ink-900">{word.vi}</span>
          <span className="block text-sm text-ink-500">{word.en}</span>
        </span>
        <Volume2
          className={[
            "size-5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100",
            color.text,
          ].join(" ")}
          aria-hidden
        />
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
        className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-3xl gap-0 overflow-hidden p-0 sm:p-0"
      >
        <DialogClose className="absolute top-4 right-4 z-10 grid size-10 cursor-pointer place-items-center rounded-full bg-white text-ink-700 shadow-md transition-transform hover:scale-105">
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
                className="h-40 w-auto animate-float object-contain sm:h-64"
              />
            </div>

            {/* Right: letter + sound button, then the word list */}
            <div className="flex flex-1 flex-col gap-6 p-6 text-center sm:overflow-y-auto sm:p-8 sm:text-left">
              <div className="flex items-center justify-center gap-4 sm:justify-start">
                <DialogTitle className="text-[3rem] leading-none font-extrabold tracking-[-0.03em] text-ink-900 sm:text-[3.75rem]">
                  {letter.letter.toUpperCase()}/{letter.letter}
                </DialogTitle>
                <LetterSoundButton text={letter.soundName} label={letter.letter} color={color} />
              </div>

              <div className="flex flex-col gap-2.5">
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
