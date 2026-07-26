import { ArrowRight, ChevronDown, Map } from "lucide-react";
import { Link } from "@tanstack/react-router";
import nonLa from "@/assets/symbols/non-la.png";
import hoaSen from "@/assets/symbols/hoa-sen.png";
import trauCo from "@/assets/mascot/flag.png";
import chimLac from "@/assets/symbols/chim-lac.png";
import tre from "@/assets/symbols/tre.png";
import caPheSuaDa from "@/assets/symbols/ca-phe-sua-da.png";

/**
 * Symbols drifting in the hero's margins, three per side, clear of the centre
 * column. Each gets its own float duration so they drift out of sync rather
 * than bobbing in unison.
 *
 * From `lg` up there is real margin either side of the 3xl column, so they
 * frame the text. Below that the column fills the width and the same
 * percentages put them under the copy instead — which is fine, since the
 * content column paints above this layer. They only shrink a little and ease
 * off in opacity. Hidden below `sm`, where a phone has no room at any weight.
 */
const DECOR = [
  { src: chimLac, className: "left-[5%] top-[22%] h-12 lg:h-14", duration: "3.2s" },
  { src: hoaSen, className: "left-[11%] top-[46%] h-14 lg:h-16", duration: "4.1s" },
  // Trâu con with the flag, sized up a little — he's the mascot, not a motif.
  { src: trauCo, className: "bottom-[16%] left-[5%] h-20 lg:h-24", duration: "3.6s" },
  { src: nonLa, className: "right-[6%] top-[24%] h-14 lg:h-16", duration: "3.9s" },
  { src: tre, className: "right-[12%] top-[48%] h-12 lg:h-14", duration: "3.3s" },
  { src: caPheSuaDa, className: "bottom-[20%] right-[7%] h-12 lg:h-14", duration: "4.4s" },
];

/**
 * Narrow-but-tall phones (a 20:9 handset in portrait) have no side margin for
 * DECOR, but they do have deep empty bands above and below the centred copy.
 * These four move into that vertical space instead — two under the nav, two
 * above the scroll cue — and only render in that shape.
 */
const TALL_DECOR = [
  { src: chimLac, className: "left-[8%] top-[11%] h-12", duration: "3.2s" },
  { src: nonLa, className: "right-[9%] top-[15%] h-12", duration: "3.9s" },
  { src: tre, className: "left-[11%] bottom-[15%] h-12", duration: "3.3s" },
  { src: trauCo, className: "right-[7%] bottom-[11%] h-16", duration: "3.6s" },
];

/** Small flat bubbles scattered between the symbols. */
const BUBBLES = [
  "left-[16%] top-[38%] h-24 w-24 bg-primary/[0.09]",
  "right-[17%] bottom-[26%] h-[4.5rem] w-[4.5rem] bg-gold/[0.22]",
  "right-[22%] top-[30%] h-11 w-11 bg-maroon/[0.10]",
];

export function InfoHero() {
  return (
    // -mt pulls the tint up under the sticky nav pill, which sits in normal
    // flow and would otherwise leave a band of plain background above the hero.
    // The inner container's top padding puts the content back clear of it.
    // The hero fills the viewport so the carousel starts off-screen. Its bottom
    // edge lands a little above the fold (the negative margin exceeds the nav's
    // flow height), which is what keeps "Khám phá" visible; InfoCarousel's top
    // padding covers the small gap that leaves.
    <section className="relative -mt-[4.5rem] flex min-h-svh w-full flex-col overflow-hidden bg-gradient-to-b from-rose-tint to-background">
      {/* Two large radial blobs, red from the top-right and gold from the left.
        Radial gradients rather than blurred shapes: they fade to fully
        transparent at 70%, so there is no edge to catch the eye. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-36 -top-44 h-[35rem] w-[35rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--primary) 15%, transparent) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -left-36 top-40 h-[25rem] w-[25rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--gold) 22%, transparent) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Portrait handsets taller than 20:11 — the vertical arrangement above.
        Everything here is off by `sm`, where DECOR takes over. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden [@media(max-aspect-ratio:11/20)]:block sm:[@media(max-aspect-ratio:11/20)]:hidden"
      >
        {TALL_DECOR.map((d, i) => (
          <img
            key={i}
            src={d.src}
            alt=""
            style={{
              animationDuration: d.duration,
              filter:
                "drop-shadow(0 10px 18px color-mix(in oklab, var(--maroon-deep) 12%, transparent))",
            }}
            className={`absolute animate-float object-contain opacity-70 ${d.className}`}
          />
        ))}
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
        {BUBBLES.map((b, i) => (
          <span key={i} className={`absolute rounded-full opacity-60 lg:opacity-70 ${b}`} />
        ))}
        {DECOR.map((d, i) => (
          <img
            key={i}
            src={d.src}
            alt=""
            style={{
              animationDuration: d.duration,
              filter:
                "drop-shadow(0 10px 18px color-mix(in oklab, var(--maroon-deep) 12%, transparent))",
            }}
            className={`absolute animate-float object-contain opacity-70 lg:opacity-90 ${d.className}`}
          />
        ))}
      </div>

      {/* Bottom padding carries the height the smaller headline gave up, so the
        section keeps its original proportions. Top padding is left alone — it
        is what clears the sticky nav pill. */}
      <div className="relative mx-auto flex max-w-3xl flex-1 flex-col justify-center px-4 pb-12 pt-32 text-center sm:px-6 sm:pb-16 sm:pt-36 lg:pt-40">
        {/* self-center keeps the pill shrink-to-fit: as a flex-column child it
          would otherwise stretch to the full container width. */}
        <span className="self-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
          Thông tin dự án
        </span>
        {/* Sized to keep "Trường Tiếng Việt Của Em" on two lines, breaking
          after "Việt" rather than orphaning "Em" onto a third. LCP element —
          no entry animation so the browser paints it immediately. */}
        <h1 className="mt-5 font-display text-[2rem] font-extrabold leading-[1.12] text-navy sm:text-5xl lg:text-6xl">
          Trường Tiếng Việt Của Em
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Hành trình gìn giữ và lan tỏa tiếng Việt, văn hóa Việt đến với thế hệ trẻ kiều bào trên
          khắp thế giới.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/hoc-tap"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-card transition-colors hover:bg-primary/90 sm:text-base"
          >
            Học ngay
            <ArrowRight className="h-5 w-5" />
          </Link>
          {/* Scrolls to the lộ trình band rather than navigating — "Học ngay"
            already covers /hoc-tap, and this mirrors the "Khám phá" cue below. */}
          <button
            type="button"
            onClick={() => {
              document
                .getElementById("lo-trinh")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-bold text-navy transition-colors hover:border-primary/40 hover:text-primary sm:text-base"
          >
            <Map className="h-5 w-5" />
            Khám phá lộ trình
          </button>
        </div>

        {/* Replaces a row of stand-in faces and a "hơn 10.000 trẻ em" figure
          that implied a userbase we cannot vouch for. */}
        <p className="mt-7 text-sm font-medium text-muted-foreground">
          Chơi mà học, học mà chơi — cùng{" "}
          <strong className="font-bold text-primary">Trâu Con</strong> khám phá tiếng Việt mỗi ngày
        </p>
      </div>

      {/* Scroll-down indicator */}
      <button
        type="button"
        aria-label="Cuộn xuống phần hình ảnh"
        onClick={() => {
          document
            .getElementById("hinh-anh")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className="group relative mx-auto mt-auto flex w-fit shrink-0 flex-col items-center gap-1 pb-6 text-muted-foreground transition-colors hover:text-primary"
      >
        <span className="text-xs font-semibold uppercase tracking-widest">Khám phá</span>
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </button>
    </section>
  );
}
