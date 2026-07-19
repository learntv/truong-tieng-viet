import { Link } from "@tanstack/react-router";
import { BackLink } from "@/components/BackLink";
import { LearningTab } from "@/components/tabs/LearningTab";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import quyen2Cover from "@/assets/quyen_2_cover.jpg";

export function Quyen1Roadmap({ chuDeIndex }: { chuDeIndex: number }) {
  return (
    <div className="relative flex w-full flex-col">
      <LearningTab chuDeIndex={chuDeIndex} />
    </div>
  );
}

export function Quyen2ComingSoon() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6">
        <BackLink to="/hoc-tap" label="Quay lại học tập" />
      </div>

      <Card className="p-6 text-center sm:p-12">
        <div className="relative mx-auto mb-6 w-40 overflow-hidden rounded-2xl shadow-sm ring-1 ring-border/60 sm:w-48">
          <img
            src={quyen2Cover}
            alt="Bìa sách Quyển 2"
            className="h-full w-full object-cover opacity-95"
          />
        </div>

        <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
          Quyển 2 đang được biên soạn ✏️
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          Các cô đang chuẩn bị thật nhiều bài học thú vị cho quyển tiếp theo. Em quay lại Quyển 1 để
          luyện tập trong lúc chờ nhé!
        </p>

        <Button variant="bevel" tone="primary" asChild className="mx-auto mt-6 w-fit">
          <Link to="/hoc-tap/quyen-1">Học Quyển 1 ngay</Link>
        </Button>
      </Card>
    </div>
  );
}
