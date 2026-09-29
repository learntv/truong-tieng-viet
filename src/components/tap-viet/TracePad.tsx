import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Eraser } from "lucide-react";
import { ConfettiBurst } from "@/components/learning/ConfettiBurst";
import { StarRow } from "@/components/learning/StarRow";
import { Mascot } from "@/components/Mascot";
import { IconButton } from "./IconButton";
import { SquareStage } from "./SquareStage";
import { tapVietGuide, tapVietMask } from "@/data/tap-viet";
import type { Stars } from "@/lib/speech";

// Canvas units match the 540×540 guide image; the mask is the same square at a quarter
// of that, so one mask cell covers 4×4 canvas pixels.
const SIZE = 540;
const CELL = 4;
const GRID = SIZE / CELL;
// How far (in mask cells) ink may stray from the guide before it counts as off the line.
const TOLERANCE = 4;
// A touch wider than the video's grey guide (~14 at this scale), so a child can cover it
// without the crayon looking like a marker.
const INK_WIDTH = 16;
const INK_COLOR = "#4f63e8"; // --primary

type Mask = { on: Uint8Array; near: Uint8Array; count: number };

function loadMask(src: string): Promise<Mask> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = GRID;
      c.height = GRID;
      const ctx = c.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, GRID, GRID);
      const px = ctx.getImageData(0, 0, GRID, GRID).data;
      const on = new Uint8Array(GRID * GRID);
      let count = 0;
      for (let i = 0; i < on.length; i++) {
        if (px[i * 4] > 128) {
          on[i] = 1;
          count++;
        }
      }
      const near = new Uint8Array(GRID * GRID);
      for (let y = 0; y < GRID; y++) {
        for (let x = 0; x < GRID; x++) {
          if (!on[y * GRID + x]) continue;
          for (let dy = -TOLERANCE; dy <= TOLERANCE; dy++) {
            for (let dx = -TOLERANCE; dx <= TOLERANCE; dx++) {
              const X = x + dx;
              const Y = y + dy;
              if (X >= 0 && Y >= 0 && X < GRID && Y < GRID) near[Y * GRID + X] = 1;
            }
          }
        }
      }
      resolve({ on, near, count });
    };
    img.onerror = reject;
    img.src = src;
  });
}

/** Coverage = share of the guide the child inked over; spill = share of their ink that
 *  landed away from it. Scribbling over everything covers the guide but spills a lot. */
function score(canvas: HTMLCanvasElement, mask: Mask): Stars {
  const c = document.createElement("canvas");
  c.width = GRID;
  c.height = GRID;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(canvas, 0, 0, GRID, GRID);
  const px = ctx.getImageData(0, 0, GRID, GRID).data;
  const inked = new Uint8Array(GRID * GRID);
  let ink = 0;
  let off = 0;
  for (let i = 0; i < GRID * GRID; i++) {
    if (px[i * 4 + 3] < 40) continue;
    inked[i] = 1;
    ink++;
    if (!mask.near[i]) off++;
  }
  // A guide cell counts as covered when ink is on it or one cell away: the crayon
  // is only a little wider than the guide, and a finger drifts a few pixels.
  let hit = 0;
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (!mask.on[y * GRID + x]) continue;
      let covered = false;
      for (let dy = -1; dy <= 1 && !covered; dy++) {
        for (let dx = -1; dx <= 1 && !covered; dx++) {
          const X = x + dx;
          const Y = y + dy;
          covered = X >= 0 && Y >= 0 && X < GRID && Y < GRID && inked[Y * GRID + X] === 1;
        }
      }
      if (covered) hit++;
    }
  }
  const coverage = hit / Math.max(1, mask.count);
  const spill = ink ? off / ink : 0;
  if (coverage >= 0.8 && spill <= 0.2) return 3;
  if (coverage >= 0.6 && spill <= 0.35) return 2;
  if (coverage >= 0.3) return 1;
  return 0;
}

const MESSAGES: Record<Stars, string> = {
  3: "Giỏi quá! Em viết đẹp lắm!",
  2: "Tốt lắm! Gần giống mẫu rồi.",
  1: "Cố lên! Em tô sát nét xám hơn nhé.",
  0: "Em thử lại nhé, em làm được mà!",
};

/** The child traces the grey guide with a finger, stylus or mouse, then gets 0–3 stars.
 *  Mount with `key={id}` so switching items starts from a clean page. */
export function TracePad({ id }: { id: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<Mask | null>(null);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const [hasInk, setHasInk] = useState(false);
  const [stars, setStars] = useState<Stars | null>(null);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    let alive = true;
    loadMask(tapVietMask(id)).then(
      (m) => {
        if (alive) maskRef.current = m;
      },
      () => {},
    );
    return () => {
      alive = false;
    };
  }, [id]);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * SIZE) / r.width,
      y: ((e.clientY - r.top) * SIZE) / r.height,
    };
  };

  const strokeTo = (to: { x: number; y: number }) => {
    const ctx = canvasRef.current?.getContext("2d");
    const from = lastRef.current;
    if (!ctx || !from) return;
    ctx.strokeStyle = INK_COLOR;
    ctx.lineWidth = INK_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    lastRef.current = to;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = point(e);
    lastRef.current = p;
    strokeTo(p); // a tap leaves a dot
    setHasInk(true);
    setStars(null);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!lastRef.current) return;
    strokeTo(point(e));
  };

  const endStroke = () => {
    lastRef.current = null;
  };

  const clear = () => {
    canvasRef.current?.getContext("2d")?.clearRect(0, 0, SIZE, SIZE);
    setHasInk(false);
    setStars(null);
  };

  const check = () => {
    const canvas = canvasRef.current;
    const mask = maskRef.current;
    if (!canvas || !mask) return;
    const s = score(canvas, mask);
    setStars(s);
    if (s === 3) setConfetti(true);
  };

  const hideConfetti = useCallback(() => setConfetti(false), []);

  return (
    // Laid out by the popup's grid: the square and the buttons are its items
    // (display: contents), so the square matches the video's size exactly.
    <div role="group" aria-label="Em tô theo" className="contents">
      {confetti && <ConfettiBurst onDone={hideConfetti} />}

      <SquareStage className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/10">
        <img
          src={tapVietGuide(id)}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none"
        />
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          aria-label="Chỗ để em tô theo nét xám"
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
        />

        {/* The result floats over the top of the page as a bubble, so the pad
          needs no feedback row and stays the same size as the video beside it.
          It lets touches through, and the next stroke clears it. */}
        <div aria-live="polite" className="pointer-events-none absolute inset-x-2 top-2">
          {stars !== null && (
            <div className="mx-auto flex w-fit items-center gap-2 rounded-2xl bg-white/95 p-2 pr-3 shadow-[0_4px_12px_rgba(12,58,110,0.2)] ring-1 ring-black/5">
              <Mascot
                pose={stars === 3 ? "cheer" : stars > 0 ? "thumbs-up" : "thinking"}
                decorative
                className="h-12"
              />
              <StarRow stars={stars} size="h-8 w-8" />
              {/* No visible text in the popup; screen readers still hear it. */}
              <p className="sr-only">{MESSAGES[stars]}</p>
            </div>
          )}
        </div>
      </SquareStage>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <IconButton label="Xoá" onClick={clear} disabled={!hasInk}>
          <Eraser />
        </IconButton>
        <IconButton label="Xong rồi" tone="green" onClick={check} disabled={!hasInk}>
          <Check />
        </IconButton>
      </div>
    </div>
  );
}
