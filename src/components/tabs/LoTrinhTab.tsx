import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { LearningTab } from "@/components/tabs/LearningTab";
import { Button } from "@/components/ui/button";
import quyen2Cover from "@/assets/quyen_2_cover.jpg";

export function Quyen1Roadmap() {
  return (
    <div className="relative flex w-full flex-col">
      <LearningTab />
    </div>
  );
}

export function Quyen2ComingSoon() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6">
        <Link
          to="/hoc-tap"
          className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-navy/50 transition-colors hover:text-navy hover:underline sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          Quay lại học tập
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-4xl border-2 border-dashed border-purple/40 bg-cream p-6 text-center shadow-[0_4px_0_0_rgba(0,0,0,0.08)] sm:p-12">
        <div className="pointer-events-none absolute top-6 left-[10%] text-2xl animate-float-slow">✨</div>
        <div className="pointer-events-none absolute top-10 right-[12%] text-3xl animate-bob">☁️</div>
        <div className="pointer-events-none absolute bottom-8 left-[16%] text-2xl animate-float-slow">🌈</div>
        <div className="pointer-events-none absolute bottom-10 right-[16%] text-2xl animate-bob">⭐</div>

        <div className="relative mx-auto mb-6 w-40 overflow-hidden rounded-2xl border-2 border-black/10 shadow-[0_4px_0_0_rgba(0,0,0,0.15)] sm:w-48">
          <img src={quyen2Cover} alt="Bìa sách Quyển 2" className="h-full w-full object-cover opacity-95" />
        </div>

        <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
          Quyển 2 đang được biên soạn ✏️
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          Các cô đang chuẩn bị thật nhiều bài học thú vị cho quyển tiếp theo. Em quay lại Quyển 1
          để luyện tập trong lúc chờ nhé!
        </p>

        <Button variant="bevel-primary" asChild className="mx-auto mt-6 w-fit">
          <Link to="/hoc-tap/quyen-1">Học Quyển 1 ngay</Link>
        </Button>
      </div>
    </div>
  );
}
