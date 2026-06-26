import { BookOpen, Flower2, Landmark, Headphones, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-students-fullwidth.jpg";

export function InfoHero() {
  const stats = [
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

  return (
    <section className="w-full">
      {/* Full-width hero with background image */}
      <div className="relative w-full overflow-hidden">
        <img
          src={heroImage}
          alt="Trẻ em Việt Nam đọc sách Tiếng Việt"
          width={1920}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover object-right"
        />
        {/* Readability overlay: stronger on left, fades to transparent on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/55 to-transparent sm:from-stone-900/75 sm:via-stone-900/35 sm:to-transparent" />
        {/* Subtle bottom fade for safe mobile contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent sm:hidden" />

        <div className="relative mx-auto flex min-h-[480px] max-w-7xl items-center px-4 py-16 sm:min-h-[540px] sm:px-6 sm:py-20 lg:min-h-[600px] lg:px-10 lg:py-24">
          <div className="max-w-xl text-left">
            <span className="inline-block rounded-full bg-yellow-400/90 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-800 shadow-sm">
              Thông tin dự án
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white drop-shadow-md sm:text-4xl lg:text-5xl">
              Trường Tiếng Việt Của Em
            </h1>
            <p className="mt-4 max-w-md text-base text-red-50/95 drop-shadow sm:text-lg">
              Hành trình gìn giữ và lan tỏa tiếng Việt, văn hóa Việt đến với thế hệ trẻ kiều bào trên khắp thế giới.
            </p>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-bold text-red-800 shadow-lg transition hover:bg-yellow-300 hover:shadow-xl sm:text-base"
              onClick={() => {
                document.getElementById("info-cards-start")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Khám phá ngay
              <ArrowRight className="h-5 w-5" />
            </button>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["bg-yellow-300", "bg-rose-300", "bg-emerald-300", "bg-sky-300"].map((c, i) => (
                  <div key={i} className={`h-8 w-8 rounded-full border-2 border-white/80 ${c} flex items-center justify-center text-xs`}>
                    😊
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-white/95 drop-shadow">Hơn 10.000 trẻ em đang học mỗi ngày</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div id="info-cards-start" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
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
      </div>
    </section>
  );
}
