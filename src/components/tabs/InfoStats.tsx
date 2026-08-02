/**
 * Two of these facts are counts and two are qualities — giving them the same
 * card flattened both. The counts carry numeral scale; the qualities sit below
 * on the same open grid, typographic only, so the whole band reads as one
 * system rather than a row of decorated boxes.
 */
const METRICS = [
  {
    value: "40",
    unit: "bài học",
    desc: "Bám sát 2 quyển sách Vui học Tiếng Việt",
  },
  {
    value: "8",
    unit: "chủ đề",
    desc: "Mỗi quyển có 4 chủ đề, mỗi chủ đề 5 bài học",
  },
];

const FEATURES = [
  {
    title: "Hình ảnh Việt Nam",
    desc: "Giới thiệu phong cảnh, văn hóa và con người Việt",
  },
  {
    title: "Luyện đọc – viết – nghe – nói",
    desc: "Phát triển toàn diện 4 kỹ năng tiếng Việt",
  },
];

export function InfoStats() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-0">
        {METRICS.map((m, i) => (
          <div
            key={m.unit}
            className={`px-4 text-center ${i === 1 ? "sm:border-l sm:border-primary/15" : ""}`}
          >
            <div className="flex items-baseline justify-center gap-2">
              <span className="font-display text-6xl leading-none font-bold text-primary sm:text-7xl">
                {m.value}
              </span>
              <span className="text-sm font-semibold tracking-[0.1em] text-primary/70 uppercase">
                {m.unit}
              </span>
            </div>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {m.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-10 border-t border-primary/15 pt-12 sm:grid-cols-2 sm:gap-0">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className={`px-4 text-center ${i === 1 ? "sm:border-l sm:border-primary/15" : ""}`}
          >
            <div className="font-display text-xl leading-tight font-bold text-primary sm:text-2xl">
              {f.title}
            </div>
            <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
