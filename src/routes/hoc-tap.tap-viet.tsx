import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  CaseLower,
  Hash,
  Link2,
  Pause,
  Play,
  Rabbit,
  RotateCcw,
  Spline,
  Turtle,
  X,
  type LucideIcon,
} from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Mascot } from "@/components/Mascot";
import { IconButton } from "@/components/tap-viet/IconButton";
import { SquareStage } from "@/components/tap-viet/SquareStage";
import { SkyBoxRibbon } from "@/components/ui/sky-box";
import { TracePad } from "@/components/tap-viet/TracePad";
import { skyButton } from "@/components/ui/sky-button";
import { messagesFor, useT } from "@/i18n";
import { pageTitle } from "@/i18n/head";
import * as SwitchPrimitive from "@radix-ui/react-switch";
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

export const Route = createFileRoute("/hoc-tap/tap-viet")({
  head: ({ match }) => {
    const { locale } = match.context;
    const m = messagesFor(locale).meta.tapViet;
    const title = pageTitle(locale, m.title);
    return {
      meta: [
        { title },
        { name: "description", content: m.description },
        { property: "og:title", content: title },
        { property: "og:description", content: m.description },
        { property: "og:url", content: "/hoc-tap/tap-viet" },
      ],
      links: [{ rel: "canonical", href: "/hoc-tap/tap-viet" }],
    };
  },
  component: TapVietPage,
});

// Two speeds, turtle and rabbit. On top of the 5× already baked into the files (see
// src/data/tap-viet.ts), so they play the original at 5× and 10× — "a" takes about
// 9 s slow and 4 s fast. Kept at 2× or under because some mobile browsers ignore
// higher playback rates.
const SLOW_RATE = 1;
const FAST_RATE = 2;

function TapVietPage() {
  const t = useT();
  const [categoryIndex, setCategoryIndex] = useState(1); // Chữ cái first — it's what most kids come for
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [rate, setRate] = useState<number>(SLOW_RATE);

  const category = TAP_VIET[categoryIndex];
  const pageRef = useRef<HTMLDivElement>(null);

  // The page sits straight on the sky (see BARE_SKY_ROUTES in __root): a ribbon
  // heading, then the notebook itself, floating, with Trâu con peeking over it.
  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-6 flex flex-col items-center gap-1 text-center sm:mb-8">
        {/* A floating pill rather than BackLink's folded corner, which needs a
          white card corner to fold out of — same as a Khai Minh Đức lesson. */}
        <Link
          to="/hoc-tap"
          className="mb-3 inline-flex items-center gap-2 self-start rounded-full border-[3px] border-white bg-white/85 px-4 py-1.5 font-display text-sm font-extrabold text-sky-ink shadow-[0_4px_12px_rgba(12,58,110,0.2)] transition hover:bg-ribbon hover:text-indigo-deep"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          {t.hocTap.crumb}
        </Link>
        <h1>
          <SkyBoxRibbon size="lg">{t.tapViet.title}</SkyBoxRibbon>
        </h1>
        <p className="max-w-md font-display text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(12,58,110,0.45)] sm:text-lg">
          {t.tapViet.intro}
        </p>
      </header>

      <div className="relative">
        <NotebookTabs selected={categoryIndex} onSelect={setCategoryIndex} pageRef={pageRef} />

        <div className="relative">
          {/* Trâu con peeks over the page's top edge, past the tabs. The pose is
            cropped flat at the bottom, so it tucks behind the page (z-0 under
            its z-10). Desktop only: narrower, the tabs reach across to where he sits. */}
          <Mascot
            pose="peeking-over"
            decorative
            className="absolute bottom-full right-10 z-0 hidden h-28 translate-y-3 lg:block"
          />
          <SpiralBinding />
          {/* One ô li page: the blank grid tile repeats as the background, one
            copy per tile slot, so the lines run on unbroken and a short last row
            is still ruled paper. A 2px oli-line border runs inside the white one;
            the open tab carries it up its own sides, so one outline wraps both. */}
          <div
            ref={pageRef}
            id={`tap-viet-page-${category.id}`}
            role="tabpanel"
            aria-labelledby={`tap-viet-tab-${category.id}`}
            className={[
              "relative z-10 grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] content-start overflow-hidden rounded-[1.25rem] rounded-tl-none border-[6px] border-white bg-white bg-repeat shadow-[inset_0_0_0_2px_var(--oli-line),0_18px_40px_rgba(12,58,110,0.3)] [background-size:calc(100%/var(--cols))_auto] sm:rounded-[1.5rem] sm:rounded-tl-none",
              "aspect-(--ratio-0) [--cols:var(--cols-0)] sm:aspect-(--ratio-1) sm:[--cols:var(--cols-1)] lg:aspect-(--ratio-2) lg:[--cols:var(--cols-2)]",
            ].join(" ")}
            style={{
              backgroundImage: `url(${tapVietGridTile(category.id)})`,
              ...pageLayout(category),
            }}
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
      </div>

      <WritingDialog
        category={category}
        index={activeIndex}
        rate={rate}
        onRateChange={setRate}
        onIndexChange={setActiveIndex}
      />
    </div>
  );
}

// One coil of a spiral binding: a punched hole just inside the page's edge and a
// metal loop curling out over the border to the left. Repeated down the page.
const SPIRAL_COIL = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='28' height='26'>" +
    "<circle cx='21' cy='14' r='3.5' fill='#174b6e' fill-opacity='.3'/>" +
    "<path d='M21 14C15 7.5 7 7.5 4 12' fill='none' stroke='#6b7c95' stroke-width='4.5' stroke-linecap='round'/>" +
    "<path d='M19.5 12.3C14.5 8.6 8 8.6 5.3 11' fill='none' stroke='#fff' stroke-opacity='.6' stroke-width='1.2' stroke-linecap='round'/>" +
    "</svg>",
)}")`;

/** The notebook's spiral binding down the page's left edge, half on the page and
 *  half hanging off it, above the page and its border. */
function SpiralBinding() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-3.5 bottom-6 top-6 z-20 w-7 bg-repeat-y"
      style={{ backgroundImage: SPIRAL_COIL }}
    />
  );
}

const TAB_LOOK: Record<TapVietCategoryId, { icon: LucideIcon; tone: string }> = {
  net: { icon: Spline, tone: "bg-box-ice" },
  chu: { icon: CaseLower, tone: "bg-box-mint" },
  ghep: { icon: Link2, tone: "bg-box-lavender" },
  so: { icon: Hash, tone: "bg-box-peach" },
};

/** The four sections as index tabs, like the coloured dividers in a school binder.
 *  The closed tabs are pastel and tucked behind the page's top edge; the open one
 *  joins the page's border with no seam and carries its grid, so tab and page
 *  read as one sheet of paper. */
function NotebookTabs({
  selected,
  onSelect,
  pageRef,
}: {
  selected: number;
  onSelect: (index: number) => void;
  pageRef: React.RefObject<HTMLDivElement | null>;
}) {
  const t = useT();
  const listRef = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // The open tab's grid has to line up with the page's: the same tile size (the
  // page's width over its --cols, which changes with the breakpoint) and shifted
  // left by however far the tab sits from the page's left edge. Anchoring it to
  // the tab's bottom — which is exactly where the page's grid starts — lines the
  // rows up on its own. Measured before paint, and again whenever the page or the
  // tabs resize (a late web font changes the tabs' widths).
  const [grid, setGrid] = useState<{ size: number; x: number } | null>(null);
  useLayoutEffect(() => {
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
    if (listRef.current) observer.observe(listRef.current);
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
      ref={listRef}
      role="tablist"
      aria-label={t.tapViet.tabsLabel}
      onKeyDown={onKeyDown}
      // A fixed height, so the row doesn't grow or shrink with whichever tab is
      // open (on phones some labels wrap to two lines).
      className="flex h-[4.5rem] items-end gap-1 sm:h-14 sm:gap-2"
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
                    backgroundImage: `url(${tapVietGridTile(c.id)})`,
                    backgroundSize: `${grid.size}px auto`,
                    // The tab runs 2px past the page's grid top (to cover the
                    // page's line), so the grid is anchored 2px up from its foot.
                    backgroundPosition: `left ${grid.x}px bottom 2px`,
                  }
                : undefined
            }
            className={[
              "flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-t-[1rem] border-[6px] border-b-0 border-white px-1.5 font-display text-xs font-extrabold leading-tight text-sky-ink transition-transform duration-200 ease-bounce sm:flex-none sm:flex-row sm:gap-2 sm:rounded-t-[1.25rem] sm:px-5 sm:text-base",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ribbon",
              isOpen
                ? // In front of the page (z-20 over its z-10), hanging over its
                  // 6px top border and 2px line so both disappear under the
                  // open tab, with the line carried up its sides and top.
                  "relative z-20 -mb-[8px] h-[calc(100%+8px)] bg-white pb-1.5 shadow-[inset_2px_0_0_var(--oli-line),inset_-2px_0_0_var(--oli-line),inset_0_2px_0_var(--oli-line)]"
                : // Behind the page, dropped so its foot tucks under the page edge.
                  [
                    "relative z-0 h-[calc(100%-0.25rem)] translate-y-1.5 pb-1.5 hover:translate-y-0.5",
                    tone,
                  ].join(" "),
            ].join(" ")}
          >
            <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" strokeWidth={2.5} aria-hidden />
            <span className="text-center sm:whitespace-nowrap">{t.tapViet.categories[c.id]}</span>
          </button>
        );
      })}
    </div>
  );
}

// The page is 24 li across on phones, 48 from sm and 72 from lg in every tab, so
// one li — and with it the pen width — is the same size on screen in every tab.
// Tile widths (8, 12, 6 li) must divide 24.
const PAGE_WIDTH_LI = [24, 48, 72] as const;
const tilesPerRow = (c: TapVietCategory, width: number) => width / c.tile.cols;
// Tall enough for the longest tab at each width, so switching tabs never moves
// anything below the page.
const PAGE_HEIGHT_LI = PAGE_WIDTH_LI.map((w) =>
  Math.max(...TAP_VIET.map((c) => Math.ceil(c.items.length / tilesPerRow(c, w)) * c.tile.rows)),
);

/** --cols-N (tiles per row) and --ratio-N (page aspect) for each breakpoint N. */
function pageLayout(c: TapVietCategory): CSSProperties {
  const vars: Record<string, string> = {};
  PAGE_WIDTH_LI.forEach((w, i) => {
    vars[`--cols-${i}`] = String(tilesPerRow(c, w));
    vars[`--ratio-${i}`] = `${w} / ${PAGE_HEIGHT_LI[i]}`;
  });
  return vars as CSSProperties;
}

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
          {item.title.replace(/^Nét /, "")}
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
  const t = useT();
  const open = index !== null;
  // Keep showing the last item while the dialog animates closed.
  const lastItem = useRef<TapVietItem | null>(null);
  if (open) lastItem.current = category.items[index];
  const item = lastItem.current;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onIndexChange(null)}>
      <DialogContent
        hideCloseButton
        className="flex h-[min(94dvh,44rem)] w-[calc(100%-1.5rem)] max-w-5xl flex-col gap-0 overflow-hidden border-0 bg-card p-0"
      >
        <DialogClose className="absolute right-3 top-3 z-10 grid h-10 w-10 cursor-pointer place-items-center rounded-[0.6rem] bg-white text-indigo-deep shadow-btn transition-[colors,box-shadow] hover:bg-box-white-deep active:shadow-btn-active">
          <X className="h-5 w-5" strokeWidth={2.5} />
          <span className="sr-only">{t.learning.close}</span>
        </DialogClose>

        {item && (
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-6">
            {/* No visible text in the popup: the controls are icons, and the
              names (here and in the panels) are for screen readers only. */}
            <DialogTitle className="sr-only">{item.title}</DialogTitle>

            {/* Video and pad side by side (stacked on phones). Each panel's square
              and buttons are direct items of this grid (display: contents), so
              the two squares share equal rows and always match in size however
              the buttons wrap. Keyed so a new item remounts both panels. */}
            <div
              key={item.id}
              className="relative grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] gap-x-6 gap-y-3 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-[minmax(0,1fr)_auto]"
            >
              <WatchPanel id={item.id} rate={rate} onRateChange={onRateChange} />
              <TracePad id={item.id} />
            </div>
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
  const t = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  // Set by onPlay, not assumed: some browsers block even muted autoplay.
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // defaultPlaybackRate survives the load that would otherwise reset playbackRate.
    v.defaultPlaybackRate = rate;
    v.playbackRate = rate;
  }, [rate]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play().catch(() => {});
  };

  return (
    <div role="group" aria-label={t.tapViet.watchLabel} className="contents">
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
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="h-full w-full rounded-2xl bg-white ring-1 ring-black/10"
        />
      </SquareStage>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <SpeedSwitch
          fast={rate === FAST_RATE}
          onChange={(fast) => onRateChange(fast ? FAST_RATE : SLOW_RATE)}
        />
        <IconButton label={playing ? t.tapViet.pause : t.tapViet.play} onClick={togglePlay}>
          {playing ? <Pause /> : <Play />}
        </IconButton>
        <IconButton label={t.tapViet.replay} onClick={replay}>
          <RotateCcw />
        </IconButton>
      </div>
    </div>
  );
}

/** Turtle – switch – rabbit. Big enough for a child's thumb, and the icon on
 *  the side that's on lights up. */
function SpeedSwitch({ fast, onChange }: { fast: boolean; onChange: (fast: boolean) => void }) {
  const t = useT();
  return (
    <div className="flex items-center gap-2">
      <Turtle
        aria-hidden
        className={["h-7 w-7 transition-colors", fast ? "text-sky-ink/35" : "text-grass-deep"].join(
          " ",
        )}
        strokeWidth={2.25}
      />
      <SwitchPrimitive.Root
        checked={fast}
        onCheckedChange={onChange}
        aria-label={t.tapViet.fast}
        className="relative h-9 w-16 shrink-0 cursor-pointer rounded-full bg-grass-deep shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ribbon data-[state=checked]:bg-primary"
      >
        <SwitchPrimitive.Thumb className="block h-7 w-7 translate-x-1 rounded-full bg-white shadow-btn transition-transform duration-200 ease-bounce data-[state=checked]:translate-x-8" />
      </SwitchPrimitive.Root>
      <Rabbit
        aria-hidden
        className={["h-7 w-7 transition-colors", fast ? "text-primary" : "text-sky-ink/35"].join(
          " ",
        )}
        strokeWidth={2.25}
      />
    </div>
  );
}
