import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Eraser } from "lucide-react";
import { ConfettiBurst } from "@/components/learning/ConfettiBurst";
import { StarRow } from "@/components/learning/StarRow";
import { Mascot } from "@/components/Mascot";
import { skyButton } from "@/components/ui/sky-button";
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
const INK_WIDTH = 24;
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
  let hit = 0;
  let ink = 0;
  let off = 0;
  for (let i = 0; i < GRID * GRID; i++) {
    if (px[i * 4 + 3] < 40) continue;
    ink++;
    if (mask.on[i]) hit++;
    if (!mask.near[i]) off++;
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
    <div className="relative flex min-h-0 flex-1 flex-col items-center gap-3">
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
      </SquareStage>

      {/* Fixed height so the buttons below don't jump when the stars appear. */}
      <div className="flex min-h-[3.5rem] items-center justify-center gap-3" aria-live="polite">
        {stars === null ? (
          <p className="text-center font-display text-base font-extrabold text-sky-ink-soft">
            {hasInk ? "Tô xong thì bấm “Xong rồi!” nhé." : "Em dùng ngón tay tô theo nét xám nhé!"}
          </p>
        ) : (
          <>
            <Mascot
              pose={stars === 3 ? "cheer" : stars > 0 ? "thumbs-up" : "thinking"}
              size="sm"
              decorative
            />
            <div className="flex flex-col items-start gap-1">
              <StarRow stars={stars} size="h-7 w-7" />
              <p className="font-display text-base font-extrabold text-sky-ink">
                {MESSAGES[stars]}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={clear}
          disabled={!hasInk}
          className={skyButton(
            "white",
            "px-5 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
          )}
        >
          <Eraser className="h-5 w-5" strokeWidth={2.5} />
          Xoá
        </button>
        <button
          type="button"
          onClick={check}
          disabled={!hasInk}
          className={skyButton(
            "green",
            "px-6 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
          )}
        >
          <Check className="h-5 w-5" strokeWidth={3} />
          Xong rồi!
        </button>
      </div>
    </div>
  );
}
