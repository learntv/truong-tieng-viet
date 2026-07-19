import trau from "@/assets/symbols/trau.png";
import chuaMotCot from "@/assets/symbols/chua-mot-cot.png";
import rong from "@/assets/symbols/rong.png";
import caPheSuaDa from "@/assets/symbols/ca-phe-sua-da.png";

const STATS = [
  {
    image: trau,
    title: (
      <>
        <span className="font-extrabold">40</span> bài học
      </>
    ),
    desc: "Bám sát 2 quyển sách Vui học Tiếng Việt",
  },
  {
    image: caPheSuaDa,
    title: (
      <>
        <span className="font-extrabold">8</span> chủ đề
      </>
    ),
    desc: "Mỗi quyển có 4 chủ đề, mỗi chủ đề 5 bài học",
  },
  {
    image: chuaMotCot,
    title: "Hình ảnh Việt Nam",
    desc: "Giới thiệu phong cảnh, văn hóa và con người Việt",
  },
  {
    image: rong,
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
          className="flex flex-col items-center rounded-2xl border border-primary/10 bg-white p-6 text-center shadow-card"
        >
          <img src={s.image} alt="" className="h-16 w-16 shrink-0 object-contain" />
          <div className="mt-4 text-lg font-bold text-navy">{s.title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{s.desc}</div>
        </div>
      ))}
    </div>
  );
}
