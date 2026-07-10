import { BookOpen, Flower2, Landmark, Headphones } from "lucide-react";

const STATS = [
  {
    icon: BookOpen,
    iconBg: "bg-amber-500 text-white",
    title: (<><span className="font-extrabold">40</span> bài học</>),
    desc: "Bám sát 2 quyển sách Vui học Tiếng Việt",
  },
  {
    icon: Flower2,
    iconBg: "bg-emerald-500 text-white",
    title: (<><span className="font-extrabold">8</span> chủ đề</>),
    desc: "Mỗi quyển có 4 chủ đề, mỗi chủ đề 5 bài học",
  },
  {
    icon: Landmark,
    iconBg: "bg-yellow-400 text-yellow-900",
    title: "Hình ảnh Việt Nam",
    desc: "Giới thiệu phong cảnh, văn hóa và con người Việt",
  },
  {
    icon: Headphones,
    iconBg: "bg-indigo-500 text-white",
    title: "Luyện đọc – viết – nghe – nói",
    desc: "Phát triển toàn diện 4 kỹ năng tiếng Việt",
  },
];

export function InfoStats() {
  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
      {STATS.map((s, i) => (
        <div
          key={i}
          className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-md"
        >
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${s.iconBg}`}>
            <s.icon className="h-8 w-8" />
          </div>
          <div className="mt-4 text-lg font-bold text-foreground">{s.title}</div>
          <div className="mt-1 text-sm text-foreground/60">{s.desc}</div>
        </div>
      ))}
    </div>
  );
}
