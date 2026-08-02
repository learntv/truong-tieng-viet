import { ArrowRight, ChevronDown, Map } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-trau-con.jpg";

export function InfoHero() {
  return (
    // -mt pulls the tint up under the sticky nav pill, which sits in normal
    // flow and would otherwise leave a band of plain background above the hero.
    // The inner container's top padding puts the content back clear of it.
    // mb-10/16 adds breathing room before the carousel now that the hero no
    // longer runs the full viewport height and needs to hand off deliberately.
    <section className="relative -mt-[4.5rem] mb-10 flex min-h-[85svh] w-full flex-col bg-background sm:mb-16">
      {/* Illustration fills the section; a very light dark scrim over the
        left half backs up the text's drop-shadow without reading as a fade. */}
      <div aria-hidden className="absolute inset-0">
        {/* object-position is pinned closer to the buffalo (~72% across the
          source art) rather than the image's true right edge, so a narrow
          crop doesn't push him out of frame chasing the flag/signpost.
          Widens toward object-right as there's more room to show them too. */}
        <img
          src={heroImage}
          alt=""
          className="h-full w-full object-cover object-[72%_center] sm:object-[85%_center] lg:object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/8 to-transparent" />
      </div>

      {/* Content is pushed to the left column; the right side is left clear
        for the illustration. Bottom padding carries the height the smaller
        headline gave up, so the section keeps its original proportions. Top
        padding is left alone — it is what clears the sticky nav pill. */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pb-12 pt-32 sm:px-6 sm:pb-16 sm:pt-36 lg:pt-40">
        <div className="max-w-xl">
          {/* Sized to keep "Trường Tiếng Việt Của Em" on two lines, breaking
            after "Việt" rather than orphaning "Em" onto a third. LCP element —
            no entry animation so the browser paints it immediately. */}
          <h1 className="font-display text-[2rem] font-bold leading-[1.12] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.55)] sm:text-5xl lg:text-6xl">
            Trường Tiếng Việt Của Em
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)] sm:text-lg">
            Hành trình gìn giữ và lan tỏa tiếng Việt, văn hóa Việt đến với thế hệ trẻ kiều bào trên
            khắp thế giới.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/hoc-tap"
              className="inline-flex items-center gap-2 rounded-none bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-card transition-colors hover:bg-primary/90 sm:text-base"
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
              className="inline-flex cursor-pointer items-center gap-2 rounded-none border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/20 sm:text-base"
            >
              <Map className="h-5 w-5" />
              Khám phá lộ trình
            </button>
          </div>
        </div>
      </div>

      {/* Scroll-down indicator: a bamboo-green disc sitting right on the
        hero's bottom edge, fully over the sky rather than dropping into the
        plain-background gap below. */}
      <button
        type="button"
        aria-label="Cuộn xuống phần hình ảnh"
        onClick={() => {
          document
            .getElementById("hinh-anh")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className="group absolute bottom-0 left-1/2 z-10 flex h-14 w-14 shrink-0 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-lime-500 shadow-lg transition-transform hover:scale-105"
      >
        <ChevronDown className="h-10 w-10 text-white" strokeWidth={3} />
      </button>
    </section>
  );
}
