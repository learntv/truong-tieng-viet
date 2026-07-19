import { ArrowRight, ChevronDown, Map } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroImage from "@/assets/kids-aodai.jpg";

export function InfoHero() {
  return (
    <section className="w-full bg-gradient-hero">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-16 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:pb-20 lg:pt-20">
        {/* Left — copy */}
        <div className="animate-in fade-in slide-in-from-bottom-4 text-left duration-700">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            Thông tin dự án
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.08] text-navy sm:text-5xl lg:text-6xl">
            Trường Tiếng Việt Của Em
          </h1>
          <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
            Hành trình gìn giữ và lan tỏa tiếng Việt, văn hóa Việt đến với thế hệ trẻ kiều bào trên
            khắp thế giới.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/hoc-tap"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 sm:text-base"
            >
              Học ngay
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/hoc-tap"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-navy transition-colors hover:border-primary/40 hover:text-primary sm:text-base"
            >
              <Map className="h-5 w-5" />
              Khám phá lộ trình
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-3">
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

        {/* Right — framed photo */}
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card">
          <img
            src={heroImage}
            alt="Trẻ em Việt Nam đọc sách Tiếng Việt"
            width={800}
            height={600}
            className="aspect-[4/3] w-full object-cover"
          />
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
        className="group mx-auto flex w-fit flex-col items-center gap-1 pb-4 text-muted-foreground transition-colors hover:text-primary"
      >
        <span className="text-xs font-semibold uppercase tracking-widest">Khám phá</span>
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </button>
    </section>
  );
}
