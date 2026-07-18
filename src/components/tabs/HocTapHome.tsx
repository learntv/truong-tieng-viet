import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Layers, Lock, Mic, Sparkles } from "lucide-react";
import quyen1Cover from "@/assets/quyen_1_cover.jpg";
import quyen2Cover from "@/assets/quyen_2_cover.jpg";
import aImg from "@/assets/alphabet/a.png";
import bImg from "@/assets/alphabet/b.png";
import cImg from "@/assets/alphabet/c.png";
import trau from "@/assets/symbols/trau.png";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function HocTapHome() {
  return (
    <main className="pb-24 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {/* ── Header ─────────────────────────────── */}
        <Card className="mb-10 p-6 sm:p-8">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
            Hành trình học tập
          </span>

          <div className="mt-4 flex items-center gap-4">
            <img
              src={trau}
              alt="Trâu con đội nón lá"
              className="h-20 w-auto shrink-0 animate-bob object-contain sm:h-28"
            />
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-extrabold leading-tight text-navy sm:text-4xl">
                Em muốn học gì hôm nay? 🌟
              </h1>
              <p className="mt-1 max-w-md text-sm text-muted-foreground sm:text-base">
                Chọn một hành trình bên dưới để cùng Trâu con khám phá tiếng Việt nhé!
              </p>
            </div>
          </div>
        </Card>

        {/* ── Lộ trình cơ bản ──────────────────────── */}
        <SectionLabel emoji="🗺️" title="Lộ trình cơ bản" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <BookCard
            cover={quyen1Cover}
            title="Quyển 1"
            subtitle="Làm quen tiếng Việt"
            description="4 chủ đề · 20 bài học cùng Trâu con khám phá quê hương."
            meta={["4 chủ đề", "20 bài học"]}
            status="Đang học"
            to="/hoc-tap/quyen-1"
          />
          <BookCard
            cover={quyen2Cover}
            title="Quyển 2"
            subtitle="Nâng cao vốn từ"
            description="Hành trình tiếp theo đang được biên soạn, sẽ sớm ra mắt các em."
            meta={["Đang biên soạn"]}
            status="Sắp ra mắt"
            locked
            to="/hoc-tap/quyen-2"
          />
        </div>

        {/* ── Khám phá thêm ────────────────────────── */}
        <div className="mt-10">
          <SectionLabel emoji="✨" title="Khám phá thêm" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ActivityCard
              to="/hoc-tap/bang-chu-cai"
              eyebrow="29 chữ cái"
              title="Bảng chữ cái"
              description="Gặp gỡ các bạn thú, nghe phát âm và học từ mới qua từng chữ cái."
              tone="stage-2"
              icon={<Sparkles className="h-8 w-8 text-white" strokeWidth={2.5} />}
              letterImages={[aImg, bImg, cImg]}
            />
            <ActivityCard
              to="/hoc-tap/luyen-noi"
              eyebrow="Luyện phát âm"
              title="Luyện nói"
              description="Nghe cô đọc mẫu, nói theo và nhận sao khích lệ cho từng câu."
              tone="stage-3"
              icon={<Mic className="h-8 w-8 text-white" strokeWidth={2.5} />}
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
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border/60 bg-card text-lg shadow-sm">
        {emoji}
      </span>
      <h2 className="font-display text-xl font-extrabold text-navy sm:text-2xl">{title}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function BookCard({
  cover,
  title,
  subtitle,
  description,
  meta,
  status,
  locked,
  to,
}: {
  cover: string;
  title: string;
  subtitle: string;
  description: string;
  meta: string[];
  status: string;
  locked?: boolean;
  to: "/hoc-tap/quyen-1" | "/hoc-tap/quyen-2";
}) {
  return (
    <Link to={to}>
      <Card interactive className="group flex gap-4 p-5 sm:gap-5 sm:p-6">
        {/* Book cover as a framed photo */}
        <div className="shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-border/60">
          <img
            src={cover}
            alt={`Bìa sách ${title}`}
            className={[
              "aspect-[900/1270] w-20 object-cover transition-transform duration-300 group-hover:scale-105 sm:w-24",
              locked ? "opacity-90 grayscale-[0.35]" : "",
            ].join(" ")}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="whitespace-nowrap font-display text-lg font-extrabold text-navy">
              {title}
            </h3>
            <Badge variant={locked ? "locked" : "success"}>
              {locked && <Lock className="mr-1 h-2.5 w-2.5" />}
              {status}
            </Badge>
          </div>
          <p className="font-display text-sm font-bold text-primary">{subtitle}</p>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">{description}</p>

          <div className="mt-auto flex items-end justify-between gap-2 pt-3">
            <div className="flex flex-wrap gap-1.5">
              {meta.map((m, i) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-2 py-0.5 text-[10px] font-bold text-navy/70"
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
      </Card>
    </Link>
  );
}

const ACTIVITY_TONE_BG: Record<string, string> = {
  "stage-2": "bg-stage-2",
  "stage-3": "bg-stage-3",
};

function ActivityCard({
  to,
  eyebrow,
  title,
  description,
  tone,
  icon,
  letterImages,
}: {
  to: "/hoc-tap/bang-chu-cai" | "/hoc-tap/luyen-noi";
  eyebrow: string;
  title: string;
  description: string;
  tone: "stage-2" | "stage-3";
  icon: React.ReactNode;
  letterImages?: string[];
}) {
  return (
    <Link to={to}>
      <Card interactive className="group flex gap-4 p-5 sm:gap-5 sm:p-6">
        <div
          className={[
            "relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-24",
            ACTIVITY_TONE_BG[tone],
          ].join(" ")}
        >
          {letterImages ? (
            <div className="flex items-end gap-1">
              {letterImages.map((src, i) => (
                <img key={i} src={src} alt="" className="h-10 w-auto object-contain sm:h-12" />
              ))}
            </div>
          ) : (
            icon
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            {eyebrow}
          </span>
          <h3 className="font-display text-lg font-extrabold text-navy">{title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">{description}</p>
          <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-extrabold text-primary">
            Bắt đầu
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
