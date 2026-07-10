import { ArrowLeft, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { LearningTab } from "@/components/tabs/LearningTab";
import quyen1Cover from "@/assets/quyen_1_cover.jpg";
import quyen2Cover from "@/assets/quyen_2_cover.jpg";

export function BookShelf() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-8 sm:gap-6 sm:px-6 sm:py-12">
      <BookCard
        cover={quyen1Cover}
        title="Quyển 1"
        subtitle="Làm quen tiếng Việt"
        description="4 chủ đề · 20 bài học cùng Trâu con khám phá quê hương."
        badge="Đang học"
        badgeClassName="bg-gradient-meadow text-navy"
        to="/hoc-tap/lo-trinh/quyen-1"
      />
      <BookCard
        cover={quyen2Cover}
        title="Quyển 2"
        subtitle="Nâng cao vốn từ"
        description="Hành trình tiếp theo đang được biên soạn, sẽ sớm ra mắt các em."
        badge="Sắp ra mắt"
        badgeClassName="bg-gradient-sunset text-navy"
        locked
        to="/hoc-tap/lo-trinh/quyen-2"
      />
    </div>
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
  to: "/hoc-tap/lo-trinh/quyen-1" | "/hoc-tap/lo-trinh/quyen-2";
}) {
  return (
    <Link
      to={to}
      className="relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-3xl bg-white p-4 text-left ring-[3px] ring-white shadow-card transition-shadow active:scale-[0.99] sm:gap-6 sm:rounded-4xl sm:p-6"
    >
      <div className="relative aspect-[900/1270] w-20 shrink-0 overflow-hidden rounded-xl shadow-[0_12px_20px_-10px_oklch(0.22_0.05_30/0.35)] sm:w-28 sm:rounded-2xl">
        <img
          src={cover}
          alt={`Bìa sách ${title}`}
          className={["h-full w-full object-cover", locked ? "grayscale-[0.15] opacity-90" : ""].join(" ")}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h2 className="whitespace-nowrap font-display text-lg font-extrabold text-navy sm:text-2xl">{title}</h2>
          <span
            className={[
              "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-display font-extrabold shadow-card sm:px-3 sm:py-1 sm:text-xs",
              badgeClassName,
            ].join(" ")}
          >
            {locked && <Lock className="h-3 w-3" />}
            {badge}
          </span>
        </div>
        <p className="font-display text-xs font-bold text-primary sm:text-base">{subtitle}</p>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:mt-1.5 sm:text-sm">{description}</p>
      </div>

      <span
        className={[
          "inline-flex shrink-0 items-center justify-center gap-2 self-center rounded-full px-3 py-2 text-xs font-display font-extrabold transition-transform active:scale-95 sm:px-5 sm:py-2.5 sm:text-base",
          locked ? "bg-muted text-navy/50" : "bg-gradient-primary text-white shadow-bevel-primary",
        ].join(" ")}
      >
        {locked ? "Xem trước" : "Bắt đầu học"}
      </span>
    </Link>
  );
}

function BackToLoTrinhLink() {
  return (
    <Link
      to="/hoc-tap/lo-trinh"
      className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-navy/50 transition-colors hover:text-navy hover:underline sm:text-sm"
    >
      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
      Quay lại lộ trình
    </Link>
  );
}

export function Quyen1Roadmap({ isLessonView, changId }: { isLessonView: boolean; changId: string | null }) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <LearningTab isLessonView={isLessonView} changId={changId} />
    </div>
  );
}

export function Quyen2ComingSoon() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6">
        <BackToLoTrinhLink />
      </div>

      <div className="relative overflow-hidden rounded-4xl border-2 border-dashed border-purple/40 bg-gradient-thanks p-6 text-center shadow-soft sm:p-12">
        <div className="pointer-events-none absolute top-6 left-[10%] text-2xl animate-float-slow">✨</div>
        <div className="pointer-events-none absolute top-10 right-[12%] text-3xl animate-bob">☁️</div>
        <div className="pointer-events-none absolute bottom-8 left-[16%] text-2xl animate-float-slow">🌈</div>
        <div className="pointer-events-none absolute bottom-10 right-[16%] text-2xl animate-bob">⭐</div>

        <div className="relative mx-auto mb-6 w-40 overflow-hidden rounded-2xl shadow-[0_18px_30px_-12px_oklch(0.22_0.05_30/0.35)] sm:w-48">
          <img src={quyen2Cover} alt="Bìa sách Quyển 2" className="h-full w-full object-cover opacity-95" />
        </div>

        <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
          Quyển 2 đang được biên soạn ✏️
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          Các cô đang chuẩn bị thật nhiều bài học thú vị cho quyển tiếp theo. Em quay lại Quyển 1
          để luyện tập trong lúc chờ nhé!
        </p>

        <Link
          to="/hoc-tap/lo-trinh/quyen-1"
          className="mx-auto mt-6 flex w-fit cursor-pointer items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-display text-base font-extrabold text-white shadow-bevel-primary transition-all ease-bounce hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-105 active:translate-y-[3px] active:scale-100"
        >
          Học Quyển 1 ngay
        </Link>
      </div>
    </div>
  );
}
