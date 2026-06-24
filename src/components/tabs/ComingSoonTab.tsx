import { Star } from "lucide-react";

export function ComingSoonTab() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-6 flex items-center justify-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-pink text-white shadow-card">
          <Star className="h-5 w-5" fill="currentColor" />
        </span>
        <h2 className="font-display text-3xl font-extrabold text-navy sm:text-5xl">
          Góc của em
        </h2>
      </header>

      <div className="relative overflow-hidden rounded-4xl border-2 border-dashed border-pink/40 bg-gradient-thanks p-6 shadow-soft sm:p-12">
        <div className="pointer-events-none absolute top-0 left-[12%] flex flex-col items-center">
          <div className="h-10 w-0.5 bg-pink/30" />
          <span className="text-3xl">⭐</span>
        </div>
        <div className="pointer-events-none absolute top-0 left-[35%] flex flex-col items-center">
          <div className="h-16 w-0.5 bg-pink/30" />
          <span className="text-2xl">☁️</span>
        </div>
        <div className="pointer-events-none absolute top-0 right-[35%] flex flex-col items-center">
          <div className="h-8 w-0.5 bg-pink/30" />
          <span className="text-4xl">⭐</span>
        </div>
        <div className="pointer-events-none absolute top-0 right-[12%] flex flex-col items-center">
          <div className="h-12 w-0.5 bg-pink/30" />
          <span className="text-2xl">☁️</span>
        </div>

        <div className="pointer-events-none absolute top-[40%] left-4 text-2xl animate-float-slow">💗</div>
        <div className="pointer-events-none absolute bottom-12 right-6 text-3xl animate-bob">✨</div>
        <div className="pointer-events-none absolute top-[55%] right-4 text-2xl animate-float-slow">🌈</div>

        <div className="relative mx-auto mt-12 max-w-xl">
          <div
            className="relative rounded-[3rem] border-[3px] border-dashed border-pink bg-white px-6 py-10 text-center shadow-soft sm:px-10 sm:py-12"
            style={{ borderRadius: "55% 45% 50% 50% / 55% 50% 55% 45%" }}
          >
            <p className="font-display text-2xl font-extrabold leading-relaxed text-pink sm:text-3xl">
              Góc của em
              <span className="mx-2 text-navy/50">-</span>
              <br className="sm:hidden" />
              <span className="block sm:inline">
                Mục này đang được xây dựng và sẽ sớm ra mắt các bạn nhỏ nhé!
              </span>
              <br />
              <span className="text-xl text-purple sm:text-2xl">(TODO Later)</span>
            </p>
          </div>
          <div className="mx-auto -mt-1 flex justify-center gap-1.5">
            <span className="block h-4 w-4 rounded-full border-2 border-dashed border-pink bg-white" />
            <span className="block h-2.5 w-2.5 rounded-full border-2 border-dashed border-pink bg-white" />
            <span className="block h-1.5 w-1.5 rounded-full border-2 border-dashed border-pink bg-white" />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-center gap-3 sm:gap-6">
          <span className="text-5xl sm:text-6xl" title="Bé gái vẽ">👧</span>
          <span className="text-4xl sm:text-5xl" title="Bút chì">✏️</span>
          <span className="text-4xl sm:text-5xl" title="Giấy">📝</span>
          <span className="text-5xl sm:text-6xl" title="Gấu bông">🧸</span>
          <span className="text-4xl sm:text-5xl animate-float-slow" title="Máy bay giấy">✈️</span>
        </div>
      </div>
    </section>
  );
}
