import { BookOpen, Flower2, Landmark, Headphones, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";

export function InfoHero() {
  const stats = [
    { icon: BookOpen, iconBg: "bg-amber-100 text-amber-700", title: (<><span className="text-red-700">40</span> bài học</>), desc: "Bám sát 2 quyển sách Vui học Tiếng Việt" },
    { icon: Flower2, iconBg: "bg-green-100 text-green-700", title: (<><span className="text-red-700">8</span> chủ đề</>), desc: "Mỗi quyển có 4 chủ đề, mỗi chủ đề 5 bài học" },
    { icon: Landmark, iconBg: "bg-yellow-100 text-yellow-700", title: "Hình ảnh Việt Nam", desc: "Giới thiệu phong cảnh, văn hóa và con người Việt" },
    { icon: Headphones, iconBg: "bg-indigo-100 text-indigo-700", title: "Luyện đọc – viết – nghe – nói", desc: "Phát triển toàn diện 4 kỹ năng tiếng Việt" },
  ];

  return (
    <section className="w-full px-4 pt-6 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 shadow-sm ring-1 ring-amber-100/60">
          <div className="grid grid-cols-1 items-center gap-4 p-4 sm:p-6 lg:grid-cols-2 lg:gap-4 lg:p-8">
            <div className="relative z-10">
              <h1 className="font-serif text-xl font-bold leading-tight text-red-800 sm:text-3xl lg:text-4xl">
                THÔNG TIN DỰ ÁN
              </h1>
              <p className="mt-2 text-base font-medium text-stone-700 sm:text-lg">Trường Tiếng Việt Của Em</p>
              <p className="mt-2 max-w-md text-sm text-stone-600 sm:text-base">
                Hành trình gìn giữ và lan tỏa tiếng Việt, văn hóa Việt đến với thế hệ trẻ kiều bào trên khắp thế giới.
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-700 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-red-800 hover:shadow-lg"
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
                    <div key={i} className={`h-8 w-8 rounded-full border-2 border-white ${c} flex items-center justify-center text-xs`}>
                      😊
                    </div>
                  ))}
                </div>
                <span className="text-sm text-stone-600">Hơn 10.000 trẻ em đang học mỗi ngày</span>
              </div>
            </div>
            <div className="relative">
              <img src={heroImage} alt="Trẻ em Việt Nam mặc áo dài đọc sách bên hồ sen" className="h-full w-full rounded-2xl object-cover" width={1600} height={800} />
            </div>
          </div>
        </div>

        <div id="info-cards-start" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${s.iconBg}`}>
                <s.icon className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-stone-800">{s.title}</div>
                <div className="text-sm text-stone-600">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
