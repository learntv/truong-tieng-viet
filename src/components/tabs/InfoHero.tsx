import { ArrowRight, ChevronDown, Map } from "lucide-react";
import { Link } from "@tanstack/react-router";
import nonLa from "@/assets/symbols/non-la.png";
import hoaSen from "@/assets/symbols/hoa-sen.png";
import trauCo from "@/assets/mascot/flag.png";
import chimLac from "@/assets/symbols/chim-lac.png";
import chuaMotCot from "@/assets/symbols/chua-mot-cot.png";
import caPheSuaDa from "@/assets/symbols/ca-phe-sua-da.png";

/**
 * Symbols drifting in the hero's margins, three per side, clear of the centre
 * column. Each gets its own float duration so they drift out of sync rather
 * than bobbing in unison. Hidden below `lg`, where the centred column fills the
 * width and they would crowd the headline rather than frame it.
 */
const DECOR = [
  { src: chimLac, className: "left-[5%] top-[22%] h-14", duration: "3.2s" },
  { src: hoaSen, className: "left-[11%] top-[46%] h-16", duration: "4.1s" },
  // Trâu con with the flag, sized up a little — he's the mascot, not a motif.
  { src: trauCo, className: "bottom-[16%] left-[5%] h-24", duration: "3.6s" },
  { src: nonLa, className: "right-[6%] top-[24%] h-16", duration: "3.9s" },
  { src: chuaMotCot, className: "right-[12%] top-[48%] h-14", duration: "3.3s" },
  { src: caPheSuaDa, className: "bottom-[20%] right-[7%] h-14", duration: "4.4s" },
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

      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {BUBBLES.map((b, i) => (
          <span key={i} className={`absolute rounded-full opacity-70 ${b}`} />
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
            className={`absolute animate-float object-contain opacity-90 ${d.className}`}
          />
        ))}
      </div>

      {/* Bottom padding carries the height the smaller headline gave up, so the
        section keeps its original proportions. Top padding is left alone — it
        is what clears the sticky nav pill. */}
      <div className="relative mx-auto flex max-w-3xl flex-1 flex-col justify-center px-4 pb-12 pt-32 text-center sm:px-6 sm:pb-16 sm:pt-36 lg:pt-40">
        {/* self-center keeps the pill shrink-to-fit: as a flex-column child it
          would otherwise stretch to the full container width. */}
        <span className="animate-in fade-in slide-in-from-bottom-3 self-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary duration-700">
          Thông tin dự án
        </span>
        {/* Sized to keep "Trường Tiếng Việt Của Em" on two lines, breaking
          after "Việt" rather than orphaning "Em" onto a third. */}
        <h1 className="mt-5 animate-in fade-in slide-in-from-bottom-4 font-display text-[2rem] font-extrabold leading-[1.12] text-navy duration-700 sm:text-5xl lg:text-6xl">
          Trường Tiếng Việt Của Em
        </h1>
        <p className="mx-auto mt-5 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-base leading-relaxed text-muted-foreground duration-1000 sm:text-lg">
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
          <Link
            to="/hoc-tap"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-bold text-navy transition-colors hover:border-primary/40 hover:text-primary sm:text-base"
          >
            <Map className="h-5 w-5" />
            Khám phá lộ trình
          </Link>
        </div>

        <div className="mt-7 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {["bg-stage-4", "bg-stage-5", "bg-stage-1", "bg-stage-2"].map((c, i) => (
              <div
                key={i}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-card ${c} text-xs`}
              >
                😊
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Hơn 10.000 trẻ em đang học mỗi ngày
          </span>
        </div>
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
