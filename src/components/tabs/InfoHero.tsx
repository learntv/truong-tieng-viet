import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-students-fullwidth.jpg";

export function InfoHero() {
  return (
    <section className="w-full">
      {/* Full-width hero with background image — extends up behind the floating navbar */}
      <div className="relative -mt-24 w-full overflow-hidden">
        <img
          src={heroImage}
          alt="Trẻ em Việt Nam đọc sách Tiếng Việt"
          width={1920}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover object-right"
        />
        {/* Blur layer: blurs the left side and fades out toward the right */}
        <div className="absolute inset-0 backdrop-blur-none sm:backdrop-blur-sm sm:[mask-image:linear-gradient(to_right,black_40%,transparent_70%)]" />
        {/* Readability overlay: stronger on left, fades to transparent on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/95 via-stone-900/35 to-transparent sm:from-stone-900/95 sm:via-stone-900/25 sm:to-transparent" />
        {/* Subtle bottom fade for safe mobile contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent sm:hidden" />

        <div className="relative mx-auto flex min-h-[576px] max-w-7xl items-center px-4 pb-16 pt-40 sm:min-h-[636px] sm:px-6 sm:pb-20 sm:pt-44 lg:min-h-[696px] lg:px-10 lg:pb-24 lg:pt-48">
          <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 text-left duration-700">
            <span className="inline-block rounded-full bg-[oklch(0.58_0.21_22)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-bevel-primary">
              Thông tin dự án
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white drop-shadow-md sm:text-4xl lg:text-5xl">
              Trường Tiếng Việt Của Em
            </h1>
            <p className="mt-4 max-w-md text-base text-red-50/95 drop-shadow sm:text-lg">
              Hành trình gìn giữ và lan tỏa tiếng Việt, văn hóa Việt đến với thế hệ trẻ kiều bào trên khắp thế giới.
            </p>
            <Link
              to="/hoc-tap"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[oklch(0.58_0.21_22)] px-6 py-3 text-sm font-bold text-white shadow-bevel-primary transition-[transform,box-shadow,filter] ease-bounce hover:brightness-105 active:translate-y-[3px] active:shadow-bevel-primary-active sm:text-base"
            >
              Học ngay
              <ArrowRight className="h-5 w-5" />
            </Link>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["bg-yellow-300", "bg-rose-300", "bg-emerald-300", "bg-sky-300"].map((c, i) => (
                  <div key={i} className={`h-8 w-8 rounded-full border-2 border-white/80 ${c} flex items-center justify-center text-xs`}>
                    😊
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-white/95 drop-shadow">Hơn 10.000 trẻ em đang học mỗi ngày</span>
            </div>
          </div>
        </div>

        {/* Scroll-down indicator: bounces to invite the user to explore, jumps to "Giới thiệu" */}
        <button
          type="button"
          aria-label="Cuộn xuống phần Giới thiệu"
          onClick={() => {
            document.getElementById("gioi-thieu")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="group absolute inset-x-0 bottom-10 z-10 mx-auto flex w-fit flex-col items-center gap-1 text-white/90 transition-colors hover:text-white sm:bottom-14"
        >
          <span className="text-xs font-semibold uppercase tracking-widest drop-shadow">Khám phá</span>
          <ChevronDown className="h-6 w-6 animate-bounce drop-shadow" />
        </button>

        {/* Oval divider: the page curves up over the bottom of the hero */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-1 flex justify-center">
          <div className="h-24 w-[260%] translate-y-1/2 rounded-[100%] bg-white sm:h-32 sm:w-[220%]" />
        </div>
      </div>
    </section>
  );
}
