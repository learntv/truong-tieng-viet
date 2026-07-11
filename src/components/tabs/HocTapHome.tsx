import { Link } from "@tanstack/react-router";
import { Lock, Mic, Sparkles } from "lucide-react";
import quyen1Cover from "@/assets/quyen_1_cover.jpg";
import quyen2Cover from "@/assets/quyen_2_cover.jpg";
import aImg from "@/assets/alphabet/a.png";
import bImg from "@/assets/alphabet/b.png";
import cImg from "@/assets/alphabet/c.png";
import aoDai from "@/assets/symbols/ao-dai.png";
import hoaSen from "@/assets/symbols/hoa-sen.png";
import chimLac from "@/assets/symbols/chim-lac.png";
import nonLa from "@/assets/symbols/non-la.png";
import trau from "@/assets/symbols/trau.png";

export function HocTapHome() {
  return (
    <main className="relative flex-1 overflow-hidden pb-24 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <FloatingDecor />

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Hero */}
        <div className="mb-10 mt-8 flex max-w-xl items-center gap-4 text-left">
          <img src={aoDai} alt="" className="h-24 w-auto shrink-0 object-contain drop-shadow sm:h-32" />
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">
              Em muốn học gì hôm nay? 🌟
            </h1>
            <p className="max-w-md text-sm text-muted-foreground sm:text-base">
              Chọn một hành trình bên dưới để bắt đầu khám phá tiếng Việt cùng Trâu con nhé!
            </p>
          </div>
        </div>

        <Section emoji="🗺️" title="Lộ trình cơ bản" tint="text-primary">
          <BookCard
            cover={quyen1Cover}
            title="Quyển 1"
            subtitle="Làm quen tiếng Việt"
            description="4 chủ đề · 20 bài học cùng Trâu con khám phá quê hương."
            badge="Đang học"
            badgeClassName="bg-gradient-meadow text-navy"
            to="/hoc-tap/quyen-1"
          />
          <BookCard
            cover={quyen2Cover}
            title="Quyển 2"
            subtitle="Nâng cao vốn từ"
            description="Hành trình tiếp theo đang được biên soạn, sẽ sớm ra mắt các em."
            badge="Sắp ra mắt"
            badgeClassName="bg-gradient-sunset text-navy"
            locked
            to="/hoc-tap/quyen-2"
          />
        </Section>

        <Section emoji="🔤" title="Bảng chữ cái" tint="text-sky-600">
          <TileCard
            to="/hoc-tap/bang-chu-cai"
            title="Học bảng chữ cái"
            description="Gặp gỡ các bạn thú, nghe phát âm và học từ mới qua từng chữ cái."
            gradientClass="bg-gradient-to-br from-sky-300 to-sky-500"
            icon={<Sparkles className="h-9 w-9 text-white drop-shadow" strokeWidth={2.5} />}
            letterImages={[aImg, bImg, cImg]}
          />
        </Section>

        <Section emoji="🎤" title="Luyện nói" tint="text-purple-600">
          <TileCard
            to="/hoc-tap/luyen-noi"
            title="Luyện nói cùng Trâu con"
            description="Nghe cô đọc mẫu, nói theo và nhận sao khích lệ cho từng câu."
            gradientClass="bg-gradient-to-br from-purple-300 to-pink-400"
            icon={<Mic className="h-9 w-9 text-white drop-shadow" strokeWidth={2.5} />}
          />
        </Section>
      </div>
    </main>
  );
}

function Section({
  emoji,
  title,
  tint,
  children,
}: {
  emoji: string;
  title: string;
  tint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <h2 className={["font-display text-xl font-extrabold sm:text-2xl", tint].join(" ")}>{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function BookCard({
  cover,
  title,
  subtitle,
  description,
  badge,
  badgeClassName,
  locked,
  to,
}: {
  cover: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeClassName: string;
  locked?: boolean;
  to: "/hoc-tap/quyen-1" | "/hoc-tap/quyen-2";
}) {
  return (
    <Link
      to={to}
      className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-3xl bg-white p-4 text-left ring-[3px] ring-white shadow-card transition-all ease-bounce hover:-translate-y-1 hover:shadow-soft active:scale-[0.98] sm:rounded-4xl sm:p-5"
    >
      <div className="relative aspect-[900/1270] w-20 shrink-0 overflow-hidden rounded-xl shadow-[0_12px_20px_-10px_oklch(0.22_0.05_30/0.35)] sm:w-24 sm:rounded-2xl">
        <img
          src={cover}
          alt={`Bìa sách ${title}`}
          className={["h-full w-full object-cover transition-transform duration-300 group-hover:scale-105", locked ? "grayscale-[0.15] opacity-90" : ""].join(" ")}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="whitespace-nowrap font-display text-base font-extrabold text-navy sm:text-lg">{title}</h3>
          <span
            className={[
              "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-display font-extrabold shadow-card",
              badgeClassName,
            ].join(" ")}
          >
            {locked && <Lock className="h-3 w-3" />}
            {badge}
          </span>
        </div>
        <p className="font-display text-xs font-bold text-primary sm:text-sm">{subtitle}</p>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

function TileCard({
  to,
  title,
  description,
  gradientClass,
  icon,
  letterImages,
}: {
  to: "/hoc-tap/bang-chu-cai" | "/hoc-tap/luyen-noi";
  title: string;
  description: string;
  gradientClass: string;
  icon: React.ReactNode;
  letterImages?: string[];
}) {
  return (
    <Link
      to={to}
      className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-3xl bg-white p-4 text-left ring-[3px] ring-white shadow-card transition-all ease-bounce hover:-translate-y-1 hover:shadow-soft active:scale-[0.98] sm:rounded-4xl sm:p-5"
    >
      <div
        className={[
          "relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-[0_12px_20px_-10px_oklch(0.22_0.05_30/0.35)] transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-24",
          gradientClass,
        ].join(" ")}
      >
        {letterImages ? (
          <div className="flex items-end gap-1">
            {letterImages.map((src, i) => (
              <img key={i} src={src} alt="" className="h-10 w-auto object-contain drop-shadow sm:h-12" />
            ))}
          </div>
        ) : (
          icon
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-base font-extrabold text-navy sm:text-lg">{title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">{description}</p>
      </div>
    </Link>
  );
}

function FloatingDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <img
        src={hoaSen}
        alt=""
        className="absolute left-[4%] top-6 h-10 w-auto opacity-70 drop-shadow animate-float-slow sm:h-12"
      />
      <img
        src={chimLac}
        alt=""
        className="absolute right-[6%] top-16 h-10 w-auto opacity-70 drop-shadow animate-bob sm:h-12"
        style={{ animationDelay: "0.6s" }}
      />
      <img
        src={nonLa}
        alt=""
        className="absolute left-[8%] bottom-10 h-10 w-auto opacity-60 drop-shadow animate-float-slow sm:h-12"
        style={{ animationDelay: "1.2s" }}
      />
      <img
        src={trau}
        alt=""
        className="absolute right-[10%] bottom-16 h-10 w-auto opacity-60 drop-shadow animate-bob sm:h-12"
        style={{ animationDelay: "0.3s" }}
      />
    </div>
  );
}
