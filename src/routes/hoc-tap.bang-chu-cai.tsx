import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Printer, Volume2, X } from "lucide-react";
import { jsPDF } from "jspdf";
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

/** Splits a word into [before, match, after] around the first case-insensitive
 * occurrence of `char`, so the letter being taught can be highlighted in place. */
function splitOnLetter(word: string, char: string): [string, string, string] {
  const index = word.toLowerCase().indexOf(char.toLowerCase());
  if (index === -1) return [word, "", ""];
  return [word.slice(0, index), word.slice(index, index + char.length), word.slice(index + char.length)];
}

function drawWordLine(
  ctx: CanvasRenderingContext2D,
  word: AlphabetWord,
  letterChar: string,
  centerX: number,
  y: number,
  fontSize: number,
  highlightColor: string,
) {
  const [before, match, after] = splitOnLetter(word.vi, letterChar);
  const normalFont = `400 ${fontSize}px "Segoe UI", Arial, sans-serif`;
  const boldFont = `700 ${fontSize}px "Segoe UI", Arial, sans-serif`;

  const segments: { text: string; font: string; color: string }[] = [
    { text: `${word.emoji} `, font: normalFont, color: "#444444" },
    { text: before, font: normalFont, color: "#444444" },
    { text: match, font: boldFont, color: highlightColor },
    { text: `${after} — ${word.en}`, font: normalFont, color: "#444444" },
  ];

  ctx.textAlign = "left";
  let totalWidth = 0;
  for (const seg of segments) {
    ctx.font = seg.font;
    totalWidth += ctx.measureText(seg.text).width;
  }

  let cursorX = centerX - totalWidth / 2;
  for (const seg of segments) {
    ctx.font = seg.font;
    ctx.fillStyle = seg.color;
    ctx.fillText(seg.text, cursorX, y);
    cursorX += ctx.measureText(seg.text).width;
  }
}

function drawWatermark(
  ctx: CanvasRenderingContext2D,
  text: string,
  canvasW: number,
  canvasH: number,
  scale: number,
) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const textColor = "rgba(204, 0, 0, 0.14)";
  const boxColor = "rgba(204, 0, 0, 0.12)";

  const lines = text.split(",").map((line) => line.trim());
  const fontSize = 18 * scale;
  ctx.font = `800 ${fontSize}px "Segoe UI", Arial, sans-serif`;
  const lineHeight = fontSize * 1.35;

  const padding = 12 * scale;
  const textWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
  const boxWidth = textWidth + padding * 2;
  const boxHeight = lineHeight * lines.length + padding * 2;

  const stepX = boxWidth + 50 * scale;
  const stepY = boxHeight + 50 * scale;
  const diagonal = Math.hypot(canvasW, canvasH);

  ctx.translate(canvasW / 2, canvasH / 2);
  ctx.rotate(-Math.PI / 6);
  ctx.lineWidth = 1.5 * scale;

  for (let y = -diagonal; y <= diagonal; y += stepY) {
    for (let x = -diagonal; x <= diagonal; x += stepX) {
      ctx.strokeStyle = boxColor;
      ctx.strokeRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);

      ctx.fillStyle = textColor;
      lines.forEach((line, i) => {
        const lineY = y - (lineHeight * (lines.length - 1)) / 2 + i * lineHeight;
        ctx.fillText(line, x, lineY);
      });
    }
  }

  ctx.restore();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function generateAlphabetPdf() {
  const images = await Promise.all(
    ALPHABET.map((letter) => loadImage(LETTER_IMAGES[letter.id])),
  );

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidthPt = doc.internal.pageSize.getWidth();
  const pageHeightPt = doc.internal.pageSize.getHeight();

  // Render each page onto an offscreen canvas so Vietnamese diacritics
  // (unsupported by jsPDF's built-in fonts) come from the browser's own
  // text rendering instead.
  const scale = 2;
  const canvasW = Math.round(pageWidthPt * scale);
  const canvasH = Math.round(pageHeightPt * scale);
  const margin = 36 * scale;
  const cols = 4;
  const rows = 4;
  const titleH = 48 * scale;
  const gap = 14 * scale;
  const cardW = (canvasW - margin * 2 - gap * (cols - 1)) / cols;
  const cardH = (canvasH - margin * 2 - titleH - gap * (rows - 1)) / rows;
  const perPage = cols * rows;

  const pageCount = Math.ceil(ALPHABET.length / perPage);

  for (let page = 0; page < pageCount; page++) {
    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasW, canvasH);

    ctx.fillStyle = "#1f1f1f";
    ctx.textAlign = "center";
    ctx.font = `700 ${22 * scale}px "Segoe UI", Arial, sans-serif`;
    ctx.fillText("Bảng chữ cái tiếng Việt", canvasW / 2, margin + 8 * scale);

    const start = page * perPage;
    const pageLetters = ALPHABET.slice(start, start + perPage);

    pageLetters.forEach((letter, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = margin + col * (cardW + gap);
      const y = margin + titleH + row * (cardH + gap);

      const img = images[start + i];
      const imgH = cardH * 0.42;
      const imgW = (img.width / img.height) * imgH;
      ctx.drawImage(img, x + (cardW - imgW) / 2, y + 8 * scale, imgW, imgH);

      ctx.fillStyle = "#1f1f1f";
      ctx.textAlign = "center";
      ctx.font = `700 ${17 * scale}px "Segoe UI", Arial, sans-serif`;
      ctx.fillText(
        `${letter.letter.toUpperCase()}/${letter.letter}`,
        x + cardW / 2,
        y + imgH + 28 * scale,
      );

      letter.words.forEach((word, wi) => {
        drawWordLine(
          ctx,
          word,
          letter.letter,
          x + cardW / 2,
          y + imgH + 46 * scale + wi * 14 * scale,
          11 * scale,
          "#cc0000",
        );
      });
    });

    drawWatermark(ctx, "Bản nháp chưa hoàn thiện, không sử dụng", canvasW, canvasH, scale);

    if (page > 0) doc.addPage();
    doc.addImage(canvas.toDataURL("image/jpeg", 0.85), "JPEG", 0, 0, pageWidthPt, pageHeightPt);
  }

  printPdfBlob(doc.output("blob"));
}

/** Loads a PDF blob into a hidden iframe and opens the browser's native
 * print dialog on it — the "Ctrl+P" flow, letting the user choose to save
 * as PDF or print, rather than forcing a silent download. */
function printPdfBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.src = url;

  const cleanup = () => {
    URL.revokeObjectURL(url);
    iframe.remove();
  };

  iframe.onload = () => {
    const win = iframe.contentWindow;
    if (!win) {
      cleanup();
      return;
    }
    win.addEventListener("afterprint", cleanup);
    win.focus();
    win.print();
    // Fallback cleanup in case afterprint never fires (e.g. dialog dismissed via Esc on some browsers).
    setTimeout(cleanup, 60_000);
  };

  document.body.appendChild(iframe);
}

function BangChuCaiTab() {
  const [progress, setProgress] = useState<Record<string, true>>({});
  const [activeLetter, setActiveLetter] = useState<AlphabetLetter | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    setProgress(loadAlphabetProgress());
  }, []);

  const seenCount = Object.keys(progress).length;
  const total = ALPHABET.length;

  const openLetter = (letter: AlphabetLetter) => {
    setActiveLetter(letter);
    setProgress(markLetterSeen(letter.id));
  };

  const handlePrintPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      await generateAlphabetPdf();
    } finally {
      setIsGeneratingPdf(false);
    }
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
            <button
              type="button"
              onClick={handlePrintPdf}
              disabled={isGeneratingPdf}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-stage-1 px-4 py-2 text-sm font-bold text-white shadow-card transition hover:brightness-110 active:translate-y-[1px] disabled:cursor-wait disabled:opacity-70"
            >
              {isGeneratingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Printer className="h-4 w-4" />
              )}
              {isGeneratingPdf ? "Đang chuẩn bị..." : "In bảng chữ cái"}
            </button>
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
