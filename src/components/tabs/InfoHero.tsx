import { ArrowRight, ChevronDown, Map } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroImage from "@/assets/kids-aodai.jpg";
import { Polaroid, PostageStamp } from "@/components/decor";

export function InfoHero() {
  return (
    <section className="w-full bg-paper">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:pb-20 lg:pt-16">
        {/* Left — copy */}
        <div className="animate-in fade-in slide-in-from-bottom-4 text-left duration-700">
          <span className="inline-block rounded-full border border-primary/25 bg-card px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary shadow-sm">
            Thông tin dự án
          </span>
          <h1 className="mt-4 max-w-[7em] font-display text-4xl font-extrabold leading-[1.05] text-navy sm:text-5xl lg:text-6xl">
            Trường Tiếng Việt Của Em
          </h1>
          <p className="mt-4 max-w-md text-base text-foreground/70 sm:text-lg">
            Hành trình gìn giữ và lan tỏa tiếng Việt, văn hóa Việt đến với thế hệ trẻ kiều bào trên
            khắp thế giới.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/hoc-tap"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-bevel-primary transition-[transform,box-shadow,filter] ease-bounce hover:brightness-105 active:translate-y-[3px] active:shadow-bevel-primary-active sm:text-base"
            >
              Học ngay
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/hoc-tap"
              className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-6 py-3 text-sm font-bold text-navy transition-colors hover:border-primary/40 hover:text-primary sm:text-base"
            >
              <Map className="h-5 w-5" />
              Khám phá lộ trình
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-yellow", "bg-pink", "bg-green", "bg-sky"].map((c, i) => (
                <div
                  key={i}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-card ${c} text-xs`}
                >
                  😊
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-foreground/70">
              Hơn 10.000 trẻ em đang học mỗi ngày
            </span>
          </div>
        </div>

        {/* Right — taped postcard photo */}
        <div className="relative mx-auto w-full max-w-md">
          <PostageStamp
            round
            className="absolute -right-2 -top-6 z-10 h-20 w-20 rotate-6 bg-card text-primary shadow-card"
          >
            <span className="font-type text-[9px] font-bold uppercase leading-tight tracking-wide text-primary/80">
              Việt Nam
              <br />★<br />
              Canada
            </span>
          </PostageStamp>
          <Polaroid rotate={-3} caption={<>Cùng em giữ tiếng quê hương ♥</>}>
            <img
              src={heroImage}
              alt="Trẻ em Việt Nam đọc sách Tiếng Việt"
              width={800}
              height={600}
              className="aspect-[4/3] w-full object-cover"
            />
          </Polaroid>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <button
        type="button"
        aria-label="Cuộn xuống phần Giới thiệu"
        onClick={() => {
          document
            .getElementById("gioi-thieu")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className="group mx-auto flex w-fit flex-col items-center gap-1 pb-4 text-foreground/50 transition-colors hover:text-primary"
      >
        <span className="text-xs font-semibold uppercase tracking-widest">Khám phá</span>
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </button>
    </section>
  );
}
