import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pencil, Play, Rabbit, RotateCcw, Turtle, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BackLink } from "@/components/BackLink";
import { PageBanner } from "@/components/site/PageBanner";
import { SquareStage } from "@/components/tap-viet/SquareStage";
import { TracePad } from "@/components/tap-viet/TracePad";
import { skyButton } from "@/components/ui/sky-button";
import { SkySegmented } from "@/components/ui/sky-segmented";
import {
  TAP_VIET,
  tapVietGridTile,
  tapVietGuide,
  tapVietThumb,
  tapVietVideo,
  type TapVietCategory,
  type TapVietCategoryId,
  type TapVietItem,
} from "@/data/tap-viet";

const DESCRIPTION =
  "Xem cô viết mẫu từng nét, chữ cái, chữ ghép và chữ số, rồi tô theo bằng ngón tay.";

export const Route = createFileRoute("/hoc-tap/tap-viet")({
  head: () => ({
    meta: [
      { title: "Tập viết — Trường Tiếng Việt Của Em" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Tập viết — Trường Tiếng Việt Của Em" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "/hoc-tap/tap-viet" },
    ],
    links: [{ rel: "canonical", href: "/hoc-tap/tap-viet" }],
  }),
  component: TapVietPage,
});

// On top of the 5× already baked into the files (see src/data/tap-viet.ts), so these
// play the original at 4.5×, 6× and 10× — "a" takes about 7 s at Vừa. Kept at 2× or
// under because some mobile browsers ignore higher playback rates.
const SPEEDS = [
  { value: 0.9, label: "Chậm", icon: Turtle },
  { value: 1.2, label: "Vừa", icon: null },
  { value: 2, label: "Nhanh", icon: Rabbit },
] as const;

type Mode = "watch" | "trace";

const MODES = [
  { value: "watch", label: "Xem mẫu", icon: Play },
  { value: "trace", label: "Tô theo", icon: Pencil },
] as const;

function TapVietPage() {
  const [categoryIndex, setCategoryIndex] = useState(1); // Chữ cái first — it's what most kids come for
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [rate, setRate] = useState<number>(1.2);

  const category = TAP_VIET[categoryIndex];

  return (
    <main className="pb-24">
      <PageBanner
        title="Tập viết ✏️"
        subtitle="Xem cô viết mẫu, rồi em lấy ngón tay tô theo nhé!"
        back={<BackLink to="/hoc-tap" label="Quay lại học tập" />}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div
          role="tablist"
          aria-label="Chọn bài tập viết"
          className="mb-6 flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          {TAP_VIET.map((c, i) => {
            const selected = i === categoryIndex;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setCategoryIndex(i)}
                className={skyButton(selected ? "primary" : "white")}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* One ô li page: the blank grid tile repeats as the background, one copy
          per tile slot, so the lines run on unbroken between items and a short
          last row is still ruled paper. */}
        <div
          role="tabpanel"
          aria-label={category.label}
          className={[
            "grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] overflow-hidden rounded-[1.25rem] border-[6px] border-white bg-white bg-repeat shadow-[0_10px_28px_rgba(12,58,110,0.22)] [background-size:calc(100%/var(--cols))_auto] sm:rounded-[1.5rem]",
            PAGE_COLS[category.id],
          ].join(" ")}
          style={{ backgroundImage: `url(${tapVietGridTile(category.id)})` }}
        >
          {category.items.map((item, i) => (
            <ItemTile
              key={item.id}
              item={item}
              category={category}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </div>

      <WritingDialog
        category={category}
        index={activeIndex}
        rate={rate}
        onRateChange={setRate}
        onIndexChange={setActiveIndex}
      />
    </main>
  );
}

// Tiles per row on the page, as the --cols the grid and its background both read.
// Every tab is 24 li across on phones, 48 from sm and 72 from lg, so one li — and
// with it the pen width — is the same size on screen in every tab. Tiles per row
// is that width over the tab's tile width (8, 12 or 6 li).
const PAGE_COLS: Record<TapVietCategoryId, string> = {
  net: "[--cols:3] sm:[--cols:6] lg:[--cols:9]",
  chu: "[--cols:3] sm:[--cols:6] lg:[--cols:9]",
  ghep: "[--cols:2] sm:[--cols:4] lg:[--cols:6]",
  so: "[--cols:4] sm:[--cols:8] lg:[--cols:12]",
};

// Every tile shows the handwriting from the video rather than typed text: the
// handwriting kids learn differs from print (b, k, r, s…). The image is ink only,
// drawn on the same grid as the page, so it lands on the page's own lines.
// Strokes have no character of their own, so their tiles also carry the
// stroke's name, in the empty rows above the stroke like a notebook heading.
function ItemTile({
  item,
  category,
  onClick,
}: {
  item: TapVietItem;
  category: TapVietCategory;
  onClick: () => void;
}) {
  const { cols, rows } = category.tile;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={item.title}
      style={{ aspectRatio: `${cols} / ${rows}` }}
      className="group relative cursor-pointer transition-colors hover:bg-ribbon/25 focus-visible:bg-ribbon/25 focus-visible:outline-none"
    >
      <img
        src={tapVietThumb(item.id)}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full transition-transform duration-200 ease-bounce group-hover:scale-105"
      />
      {category.id === "net" && (
        <span className="absolute inset-x-0 top-[4%] px-1 text-center font-display text-[11px] font-extrabold leading-tight text-sky-ink sm:text-xs">
          {item.label}
        </span>
      )}
    </button>
  );
}

function WritingDialog({
  category,
  index,
  rate,
  onRateChange,
  onIndexChange,
}: {
  category: TapVietCategory;
  index: number | null;
  rate: number;
  onRateChange: (rate: number) => void;
  onIndexChange: (index: number | null) => void;
}) {
  const [mode, setMode] = useState<Mode>("watch");
  const item = index === null ? null : category.items[index];

  // Each new item starts on the model video.
  useEffect(() => {
    setMode("watch");
  }, [item?.id]);

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onIndexChange(null)}>
      <DialogContent
        hideCloseButton
        className="flex h-[min(94dvh,46rem)] w-[calc(100%-1.5rem)] max-w-xl flex-col gap-0 overflow-hidden border-0 bg-card p-0"
      >
        <DialogClose className="absolute right-3 top-3 z-10 grid h-10 w-10 cursor-pointer place-items-center rounded-[0.6rem] bg-white text-indigo-deep shadow-btn transition-[colors,box-shadow] hover:bg-box-white-deep active:shadow-btn-active">
          <X className="h-5 w-5" strokeWidth={2.5} />
          <span className="sr-only">Đóng</span>
        </DialogClose>

        {item && (
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-6">
            <DialogTitle className="pr-10 font-display text-2xl font-extrabold text-sky-ink sm:text-3xl">
              {item.title}
            </DialogTitle>

            <SkySegmented options={MODES} value={mode} onChange={setMode} label="Chọn cách học" />

            {mode === "watch" ? (
              <WatchPanel key={item.id} id={item.id} rate={rate} onRateChange={onRateChange} />
            ) : (
              <TracePad key={item.id} id={item.id} />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function WatchPanel({
  id,
  rate,
  onRateChange,
}: {
  id: string;
  rate: number;
  onRateChange: (rate: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
  }, [rate]);

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play().catch(() => {});
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center gap-3">
      <SquareStage>
        <video
          ref={videoRef}
          src={tapVietVideo(id)}
          poster={tapVietGuide(id)}
          // Silent videos, so muted autoplay is allowed everywhere; loop so the
          // child can watch the strokes as many times as they like.
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => {
            e.currentTarget.playbackRate = rate;
          }}
          className="h-full w-full rounded-2xl bg-white ring-1 ring-black/10"
        />
      </SquareStage>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <SkySegmented options={SPEEDS} value={rate} onChange={onRateChange} label="Tốc độ" />
        <button type="button" onClick={replay} className={skyButton("white", "px-4")}>
          <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
          Xem lại
        </button>
      </div>
    </div>
  );
}
