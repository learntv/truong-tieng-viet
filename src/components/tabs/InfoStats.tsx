import { BookOpen, Flower2, Landmark, Headphones } from "lucide-react";

const STATS = [
  {
    icon: BookOpen,
    iconBg: "bg-white/30 text-white",
    cardBg: "bg-amber-500",
    titleColor: "text-white",
    descColor: "text-amber-100",
    title: (<><span className="text-white font-extrabold">40</span> bài học</>),
    desc: "Bám sát 2 quyển sách Vui học Tiếng Việt",
  },
  {
    icon: Flower2,
    iconBg: "bg-white/30 text-white",
    cardBg: "bg-emerald-500",
    titleColor: "text-white",
    descColor: "text-emerald-100",
    title: (<><span className="text-white font-extrabold">8</span> chủ đề</>),
    desc: "Mỗi quyển có 4 chủ đề, mỗi chủ đề 5 bài học",
  },
  {
    icon: Landmark,
    iconBg: "bg-yellow-900/20 text-yellow-900",
    cardBg: "bg-yellow-400",
    titleColor: "text-yellow-900",
    descColor: "text-yellow-800",
    title: "Hình ảnh Việt Nam",
    desc: "Giới thiệu phong cảnh, văn hóa và con người Việt",
  },
  {
    icon: Headphones,
    iconBg: "bg-white/30 text-white",
    cardBg: "bg-indigo-500",
    titleColor: "text-white",
    descColor: "text-indigo-100",
    title: "Luyện đọc – viết – nghe – nói",
    desc: "Phát triển toàn diện 4 kỹ năng tiếng Việt",
  },
];

export function InfoStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((s, i) => (
        <div key={i} className={`flex items-center gap-4 rounded-2xl p-5 shadow-md ${s.cardBg}`}>
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${s.iconBg}`}>
            <s.icon className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <div className={`text-lg font-bold ${s.titleColor}`}>{s.title}</div>
            <div className={`text-sm ${s.descColor}`}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
