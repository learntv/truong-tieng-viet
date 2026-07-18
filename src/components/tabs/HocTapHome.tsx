import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Layers, Lock, Mic, Sparkles } from "lucide-react";
import quyen1Cover from "@/assets/quyen_1_cover.jpg";
import quyen2Cover from "@/assets/quyen_2_cover.jpg";
import aImg from "@/assets/alphabet/a.png";
import bImg from "@/assets/alphabet/b.png";
import cImg from "@/assets/alphabet/c.png";
import trau from "@/assets/symbols/trau.png";
import { HandNote, PostageStamp, WashiTape } from "@/components/decor";

export function HocTapHome() {
  return (
    <main className="relative flex-1 overflow-hidden pb-24 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {/* ── Header: a taped journal title card ─────────────────── */}
        <header className="relative mb-10 overflow-hidden rounded-[1.75rem] border border-border bg-card p-6 shadow-card sm:p-8">
          <WashiTape
            className="absolute -left-6 top-5 h-7 w-32 -rotate-45"
            color="oklch(0.53 0.185 27)"
          />
          <PostageStamp
            round
            className="absolute right-4 top-4 hidden h-16 w-16 rotate-6 bg-card text-primary shadow-sm sm:grid"
          >
            <span className="font-type text-[8px] font-bold uppercase leading-tight tracking-wide text-primary/80">
              Học
              <br />★<br />
              Tập
            </span>
          </PostageStamp>

          <span className="inline-block rounded-full border border-primary/25 bg-cream px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
            Hành trình học tập
          </span>

          <div className="mt-4 flex items-center gap-4">
            <img
              src={trau}
              alt="Trâu con đội nón lá"
              className="h-20 w-auto shrink-0 animate-bob object-contain drop-shadow sm:h-28"
            />
            <div className="min-w-0">
              <HandNote className="text-xl text-primary/80 sm:text-2xl">
                Trâu con chờ em đây!
              </HandNote>
              <h1 className="font-display text-2xl font-extrabold leading-tight text-navy sm:text-4xl">
                Em muốn học gì hôm nay? 🌟
              </h1>
              <p className="mt-1 max-w-md text-sm text-muted-foreground sm:text-base">
                Chọn một hành trình bên dưới để cùng Trâu con khám phá tiếng Việt nhé!
              </p>
            </div>
          </div>
        </header>

        {/* ── Lộ trình cơ bản: the two books as postcards ─────────── */}
        <SectionLabel emoji="🗺️" title="Lộ trình cơ bản" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <BookCard
            cover={quyen1Cover}
            title="Quyển 1"
            subtitle="Làm quen tiếng Việt"
            description="4 chủ đề · 20 bài học cùng Trâu con khám phá quê hương."
            meta={["4 chủ đề", "20 bài học"]}
            status="Đang học"
            tapeColor="oklch(0.56 0.1 155)"
            to="/hoc-tap/quyen-1"
          />
          <BookCard
            cover={quyen2Cover}
            title="Quyển 2"
            subtitle="Nâng cao vốn từ"
            description="Hành trình tiếp theo đang được biên soạn, sẽ sớm ra mắt các em."
            meta={["Đang biên soạn"]}
            status="Sắp ra mắt"
            tapeColor="oklch(0.8 0.125 80)"
            locked
            to="/hoc-tap/quyen-2"
          />
        </div>

        {/* ── Khám phá thêm: alphabet + speaking ──────────────────── */}
        <div className="mt-10">
          <SectionLabel emoji="✨" title="Khám phá thêm" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ActivityCard
              to="/hoc-tap/bang-chu-cai"
              eyebrow="29 chữ cái"
              title="Bảng chữ cái"
              description="Gặp gỡ các bạn thú, nghe phát âm và học từ mới qua từng chữ cái."
              gradientClass="bg-gradient-to-br from-[#3480ba] to-[#1f4f75]"
              tapeColor="oklch(0.53 0.09 245)"
              icon={<Sparkles className="h-8 w-8 text-white drop-shadow" strokeWidth={2.5} />}
              letterImages={[aImg, bImg, cImg]}
            />
            <ActivityCard
              to="/hoc-tap/luyen-noi"
              eyebrow="Luyện phát âm"
              title="Luyện nói"
              description="Nghe cô đọc mẫu, nói theo và nhận sao khích lệ cho từng câu."
              gradientClass="bg-gradient-to-br from-[#8968b7] to-[#bf5f66]"
              tapeColor="oklch(0.56 0.11 300)"
              icon={<Mic className="h-8 w-8 text-white drop-shadow" strokeWidth={2.5} />}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function SectionLabel({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-card text-lg shadow-sm">
        {emoji}
      </span>
      <h2 className="font-display text-xl font-extrabold text-navy sm:text-2xl">{title}</h2>
      <div className="h-0 flex-1 border-t-2 border-dashed border-border" />
    </div>
  );
}

function StatusPill({ children, locked }: { children: React.ReactNode; locked?: boolean }) {
  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed px-2 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-wide",
        locked
          ? "border-muted-foreground/40 bg-muted text-muted-foreground"
          : "border-green/40 bg-green/10 text-green",
      ].join(" ")}
    >
      {locked && <Lock className="h-2.5 w-2.5" />}
      {children}
    </span>
  );
}

function BookCard({
  cover,
  title,
  subtitle,
  description,
  meta,
  status,
  tapeColor,
  locked,
  to,
}: {
  cover: string;
  title: string;
  subtitle: string;
  description: string;
  meta: string[];
  status: string;
  tapeColor: string;
  locked?: boolean;
  to: "/hoc-tap/quyen-1" | "/hoc-tap/quyen-2";
}) {
  return (
    <Link
      to={to}
      className="group relative flex gap-4 overflow-hidden rounded-3xl border border-border bg-card p-5 text-left shadow-card ring-1 ring-black/[0.02] transition-all ease-bounce hover:-translate-y-1 hover:shadow-soft active:scale-[0.99] sm:gap-5 sm:p-6"
    >
      <WashiTape className="absolute -left-6 top-5 h-6 w-28 -rotate-45" color={tapeColor} />

      {/* Book cover as a framed photo */}
      <div className="relative shrink-0">
        <div className="overflow-hidden rounded-xl shadow-[0_12px_20px_-10px_oklch(0.3_0.035_265/0.4)] ring-2 ring-card">
          <img
            src={cover}
            alt={`Bìa sách ${title}`}
            className={[
              "aspect-[900/1270] w-20 object-cover transition-transform duration-300 group-hover:scale-105 sm:w-24",
              locked ? "opacity-90 grayscale-[0.35]" : "",
            ].join(" ")}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="whitespace-nowrap font-display text-lg font-extrabold text-navy">
            {title}
          </h3>
          <StatusPill locked={locked}>{status}</StatusPill>
        </div>
        <p className="font-display text-sm font-bold text-primary">{subtitle}</p>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">{description}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {meta.map((m, i) => (
              <span
                key={m}
                className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-[10px] font-bold text-navy/70 ring-1 ring-border"
              >
                {i === 0 ? <Layers className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                {m}
              </span>
            ))}
          </div>
          <span
            className={[
              "inline-flex shrink-0 items-center gap-1 text-sm font-extrabold",
              locked ? "text-muted-foreground" : "text-primary",
            ].join(" ")}
          >
            {locked ? "Sắp có" : "Vào học"}
            {locked ? (
              <Lock className="h-3.5 w-3.5" />
            ) : (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

function ActivityCard({
  to,
  eyebrow,
  title,
  description,
  gradientClass,
  tapeColor,
  icon,
  letterImages,
}: {
  to: "/hoc-tap/bang-chu-cai" | "/hoc-tap/luyen-noi";
  eyebrow: string;
  title: string;
  description: string;
  gradientClass: string;
  tapeColor: string;
  icon: React.ReactNode;
  letterImages?: string[];
}) {
  return (
    <Link
      to={to}
      className="group relative flex gap-4 overflow-hidden rounded-3xl border border-border bg-card p-5 text-left shadow-card ring-1 ring-black/[0.02] transition-all ease-bounce hover:-translate-y-1 hover:shadow-soft active:scale-[0.99] sm:gap-5 sm:p-6"
    >
      <WashiTape className="absolute -right-6 top-5 h-6 w-28 rotate-45" color={tapeColor} />

      <div
        className={[
          "relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-[0_12px_20px_-10px_oklch(0.3_0.035_265/0.4)] ring-2 ring-card transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-24",
          gradientClass,
        ].join(" ")}
      >
        {letterImages ? (
          <div className="flex items-end gap-1">
            {letterImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="h-10 w-auto object-contain drop-shadow sm:h-12"
              />
            ))}
          </div>
        ) : (
          icon
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-type text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </span>
        <h3 className="font-display text-lg font-extrabold text-navy">{title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">{description}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-extrabold text-primary">
          Bắt đầu
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
