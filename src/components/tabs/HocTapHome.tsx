import { Link } from "@tanstack/react-router";
import { BookOpen, CalendarDays, GraduationCap, Lock, Mic, Type } from "lucide-react";
import type { ReactNode } from "react";
import quyen1Cover from "@/assets/quyen_1_cover.jpg";
import quyen2Cover from "@/assets/quyen_2_cover.jpg";
import aImg from "@/assets/alphabet/a.png";
import bImg from "@/assets/alphabet/b.png";
import cImg from "@/assets/alphabet/c.png";
import { Mascot } from "@/components/Mascot";
import { Card } from "@/components/ui/card";

type LearnLink =
  | "/hoc-tap/quyen-1"
  | "/hoc-tap/quyen-2"
  | "/hoc-tap/bang-chu-cai"
  | "/hoc-tap/luyen-noi";

type Item = {
  to: LearnLink;
  category: string;
  title: string;
  meta: { icon: typeof BookOpen; text: string }[];
  cover?: string;
  tone: string;
  art?: ReactNode;
  locked?: boolean;
};

const items: Item[] = [
  {
    to: "/hoc-tap/quyen-1",
    category: "Lộ trình cơ bản",
    title: "Quyển 1 — Làm quen tiếng Việt",
    cover: quyen1Cover,
    tone: "bg-stage-1-soft",
    meta: [
      { icon: GraduationCap, text: "Trình độ: Bắt đầu" },
      { icon: BookOpen, text: "4 chủ đề · 20 bài học" },
      { icon: CalendarDays, text: "Thời lượng: 10 tuần" },
    ],
  },
  {
    to: "/hoc-tap/quyen-2",
    category: "Lộ trình cơ bản",
    title: "Quyển 2 — Nâng cao vốn từ",
    cover: quyen2Cover,
    tone: "bg-stage-4-soft",
    locked: true,
    meta: [
      { icon: GraduationCap, text: "Trình độ: Nâng cao" },
      { icon: BookOpen, text: "Đang được biên soạn" },
      { icon: CalendarDays, text: "Sắp ra mắt" },
    ],
  },
  {
    to: "/hoc-tap/bang-chu-cai",
    category: "Khám phá thêm",
    title: "Bảng chữ cái",
    tone: "bg-stage-2-soft",
    art: (
      <div className="flex items-end gap-2">
        {[aImg, bImg, cImg].map((src) => (
          <img key={src} src={src} alt="" className="h-20 w-auto object-contain" />
        ))}
      </div>
    ),
    meta: [
      { icon: Type, text: "29 chữ cái tiếng Việt" },
      { icon: BookOpen, text: "Từ mới kèm hình minh hoạ" },
      { icon: GraduationCap, text: "Nghe phát âm từng chữ" },
    ],
  },
  {
    to: "/hoc-tap/luyen-noi",
    category: "Khám phá thêm",
    title: "Luyện nói",
    tone: "bg-stage-3-soft",
    art: <Mascot pose="listening" decorative className="h-32 translate-y-2" />,
    meta: [
      { icon: Mic, text: "Luyện phát âm theo câu" },
      { icon: BookOpen, text: "Nghe cô đọc mẫu" },
      { icon: GraduationCap, text: "Nhận sao khích lệ" },
    ],
  },
];

export function HocTapHome() {
  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Em muốn học gì hôm nay?
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Chọn một hành trình bên dưới để cùng Trâu con khám phá tiếng Việt nhé.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">{items.length} chương trình</p>
        <hr className="mt-4 border-border" />

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ProgramCard key={item.to} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}

function ProgramCard({ item }: { item: Item }) {
  return (
    <Link to={item.to} className="group block">
      <Card interactive className="flex h-full flex-col overflow-hidden p-0">
        <div
          className={[
            "flex h-40 items-center justify-center overflow-hidden",
            item.tone,
          ].join(" ")}
        >
          {item.cover ? (
            <img
              src={item.cover}
              alt={`Bìa ${item.title}`}
              className={[
                "h-full w-auto object-contain",
                item.locked ? "grayscale-[0.35]" : "",
              ].join(" ")}
            />
          ) : (
            item.art
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 border-t border-border p-5">
          <span className="text-xs font-bold uppercase tracking-wide text-primary">
            {item.category}
          </span>
          <h2 className="font-display text-lg font-bold text-ink group-hover:underline">
            {item.title}
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {item.meta.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-sm text-foreground/80">
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
                <span className="min-w-0">{text}</span>
              </li>
            ))}
            {item.locked && (
              <li className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Lock className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span>Chưa mở khoá</span>
              </li>
            )}
          </ul>
        </div>
      </Card>
    </Link>
  );
}
