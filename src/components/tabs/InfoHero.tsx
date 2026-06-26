import { BookOpen, Flower2, Landmark, Headphones, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";

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
    <section className="w-full px-4 pt-6 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-red-500 to-orange-400 shadow-xl">
          {/* decorative blobs */}
          <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-yellow-400/20 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-orange-300/20 blur-2xl" />

          <div className="grid grid-cols-1 items-center gap-4 p-4 sm:p-6 lg:grid-cols-2 lg:gap-4 lg:p-8">
            <div className="relative z-10">
              <span className="inline-block rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-yellow-200">
                Thông tin dự án
              </span>
              <h1 className="mt-2 font-display text-xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                Trường Tiếng Việt Của Em
              </h1>
              <p className="mt-2 max-w-md text-sm text-red-100 sm:text-base">
                Hành trình gìn giữ và lan tỏa tiếng Việt, văn hóa Việt đến với thế hệ trẻ kiều bào trên khắp thế giới.
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2 text-sm font-bold text-red-800 shadow-md transition hover:bg-yellow-300 hover:shadow-lg"
                onClick={() => {
                  document.getElementById("info-cards-start")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Khám phá ngay
                <ArrowRight className="h-5 w-5" />
              </button>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["bg-yellow-300", "bg-rose-300", "bg-emerald-300", "bg-sky-300"].map((c, i) => (
                    <div key={i} className={`h-8 w-8 rounded-full border-2 border-rose-300 ${c} flex items-center justify-center text-xs`}>
                      😊
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium text-red-100">Hơn 10.000 trẻ em đang học mỗi ngày</span>
              </div>
            </div>
            <div className="relative">
              <img src={heroImage} alt="Trẻ em Việt Nam mặc áo dài đọc sách bên hồ sen" className="h-full w-full rounded-2xl object-cover ring-4 ring-white/20" width={1600} height={800} />
            </div>
          </div>
        </div>

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
