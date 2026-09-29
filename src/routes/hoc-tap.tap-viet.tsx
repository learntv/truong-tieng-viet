import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  CaseLower,
  Hash,
  Link2,
  Pencil,
  Play,
  Rabbit,
  RotateCcw,
  Spline,
  Turtle,
  X,
  type LucideIcon,
} from "lucide-react";
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
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <main className="pb-24">
      <PageBanner
        title="Tập viết ✏️"
        subtitle="Xem cô viết mẫu, rồi em lấy ngón tay tô theo nhé!"
        back={<BackLink to="/hoc-tap" label="Quay lại học tập" />}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <NotebookTabs selected={categoryIndex} onSelect={setCategoryIndex} pageRef={pageRef} />

        {/* One ô li page: the blank grid tile repeats as the background, one copy
          per tile slot, so the lines run on unbroken between items and a short
          last row is still ruled paper. Its top-left corner is square because
          the first tab grows out of it. A 2px blue line (the grid's solid-line
          colour, #1ea4dc) runs inside the white border; the open tab draws the
          same line on its sides and top and covers the page's line under
          itself, so one blue outline wraps tab and page together. */}
        <div
          ref={pageRef}
          id={`tap-viet-page-${category.id}`}
          role="tabpanel"
          aria-labelledby={`tap-viet-tab-${category.id}`}
          className={[
            "relative z-10 grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] overflow-hidden rounded-[1.25rem] rounded-tl-none border-[6px] border-white bg-white bg-repeat shadow-[inset_0_0_0_2px_#1ea4dc,0_10px_28px_rgba(12,58,110,0.22)] [background-size:calc(100%/var(--cols))_auto] sm:rounded-[1.5rem] sm:rounded-tl-none",
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

// The four sections as index tabs on the notebook page, like the coloured
// dividers in a school binder. The tabs not in use are pastel and tucked a little
// behind the page's top edge; the open one joins the page's white border with no
// seam and carries the page's own grid, lined up so the ruling runs on up into
// it — tab and page read as one sheet of paper.
const TAB_LOOK: Record<TapVietCategoryId, { icon: LucideIcon; tone: string }> = {
  net: { icon: Spline, tone: "bg-box-ice" },
  chu: { icon: CaseLower, tone: "bg-box-mint" },
  ghep: { icon: Link2, tone: "bg-box-lavender" },
  so: { icon: Hash, tone: "bg-box-peach" },
};

function NotebookTabs({
  selected,
  onSelect,
  pageRef,
}: {
  selected: number;
  onSelect: (index: number) => void;
  pageRef: React.RefObject<HTMLDivElement | null>;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const openId = TAP_VIET[selected].id;

  // The open tab's grid has to line up with the page's: the same tile size (the
  // page's width over its --cols, which changes with the breakpoint) and shifted
  // left by however far the tab sits from the page's left edge. Anchoring it to
  // the tab's bottom — which is exactly where the page's grid starts — lines the
  // rows up on its own. Re-measured whenever the page resizes.
  const [grid, setGrid] = useState<{ size: number; x: number } | null>(null);
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const measure = () => {
      const tab = refs.current[selected];
      if (!tab) return;
      const cols = Number(getComputedStyle(page).getPropertyValue("--cols")) || 1;
      setGrid({
        size: page.clientWidth / cols,
        x: page.getBoundingClientRect().left - tab.getBoundingClientRect().left,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(page);
    return () => observer.disconnect();
  }, [pageRef, selected]);

  // Arrow keys move between tabs and open them, per the ARIA tabs pattern; only
  // the open tab sits in the Tab order.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = TAP_VIET.length - 1;
    const next =
      e.key === "ArrowRight"
        ? (selected + 1) % TAP_VIET.length
        : e.key === "ArrowLeft"
          ? (selected - 1 + TAP_VIET.length) % TAP_VIET.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    onSelect(next);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Chọn bài tập viết"
      onKeyDown={onKeyDown}
      className="flex items-end gap-1 sm:gap-2"
    >
      {TAP_VIET.map((c, i) => {
        const isOpen = i === selected;
        const { icon: Icon, tone } = TAB_LOOK[c.id];
        return (
          <button
            key={c.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`tap-viet-tab-${c.id}`}
            type="button"
            role="tab"
            aria-selected={isOpen}
            aria-controls={`tap-viet-page-${c.id}`}
            tabIndex={isOpen ? 0 : -1}
            onClick={() => onSelect(i)}
            style={
              isOpen && grid
                ? {
                    backgroundImage: `url(${tapVietGridTile(openId)})`,
                    backgroundSize: `${grid.size}px auto`,
                    // The tab runs 2px past the page's grid top (to cover the
                    // page's blue line), so the grid is anchored 2px up from its foot.
                    backgroundPosition: `left ${grid.x}px bottom 2px`,
                  }
                : undefined
            }
            className={[
              "flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-t-[1rem] border-[6px] border-b-0 border-white px-1.5 pt-1.5 font-display text-xs font-extrabold leading-tight text-sky-ink transition-[transform,padding] duration-200 ease-bounce sm:flex-none sm:flex-row sm:gap-2 sm:rounded-t-[1.25rem] sm:px-5 sm:text-base",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ribbon",
              isOpen
                ? // In front of the page (z-20 over its z-10), hanging over its
                  // 6px top border and 2px blue line so both disappear under the
                  // open tab, with the blue line carried up its sides and top.
                  "relative z-20 -mb-[8px] bg-white pb-3.5 shadow-[inset_2px_0_0_#1ea4dc,inset_-2px_0_0_#1ea4dc,inset_0_2px_0_#1ea4dc] sm:pb-4"
                : // Behind the page, dropped so its foot tucks under the page edge.
                  ["relative z-0 translate-y-1.5 pb-2 hover:translate-y-0.5", tone].join(" "),
            ].join(" ")}
          >
            <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" strokeWidth={2.5} aria-hidden />
            <span className="text-center sm:whitespace-nowrap">{c.label}</span>
          </button>
        );
      })}
    </div>
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
