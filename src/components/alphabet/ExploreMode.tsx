import { useMemo, useState } from "react";
import { ALPHABET, type AlphabetLetter } from "@/data/alphabet";
import { masteryLevel, type AlphabetProgress } from "@/lib/alphabet-progress";
import { LetterDetail } from "./LetterDetail";
import { Star } from "lucide-react";

type Filter = "tat-ca" | "nguyen-am" | "phu-am";

// Rotating soft pastel backgrounds so the grid feels playful, not uniform.
const TILE_TINTS = [
  "bg-[oklch(0.94_0.08_75)]",
  "bg-[oklch(0.92_0.08_150)]",
  "bg-[oklch(0.92_0.08_220)]",
  "bg-[oklch(0.94_0.09_5)]",
  "bg-[oklch(0.93_0.08_295)]",
  "bg-[oklch(0.94_0.08_50)]",
];

export function ExploreMode({
  progress,
  onOpen,
  speak,
  soundOn,
}: {
  progress: AlphabetProgress;
  onOpen: (l: AlphabetLetter) => void;
  speak: (text: string) => void;
  soundOn: boolean;
}) {
  const [filter, setFilter] = useState<Filter>("tat-ca");
  const [active, setActive] = useState<AlphabetLetter | null>(null);

  const list = useMemo(
    () => (filter === "tat-ca" ? ALPHABET : ALPHABET.filter((l) => l.kind === filter)),
    [filter],
  );

  const open = (l: AlphabetLetter) => {
    onOpen(l);
    setActive(l);
    // Speak the letter's phonic first, then the example word.
    speak(`${l.phonic}. ${l.word}`);
  };

  return (
    <>
      {/* Filter chips */}
      <div className="mb-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <FilterChip label="Tất cả" active={filter === "tat-ca"} onClick={() => setFilter("tat-ca")} />
        <FilterChip
          label="Nguyên âm"
          active={filter === "nguyen-am"}
          onClick={() => setFilter("nguyen-am")}
        />
        <FilterChip
          label="Phụ âm"
          active={filter === "phu-am"}
          onClick={() => setFilter("phu-am")}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4 md:grid-cols-6 lg:grid-cols-7">
        {list.map((l, i) => {
          const level = masteryLevel(progress[l.upper] ?? { seen: 0, correct: 0, wrong: 0 });
          const tint = TILE_TINTS[i % TILE_TINTS.length];
          return (
            <button
              key={l.upper}
              onClick={() => open(l)}
              className={[
                "group relative flex aspect-square flex-col items-center justify-center gap-1 rounded-3xl p-2 ring-2 ring-white shadow-card transition-all duration-200 ease-bounce hover:-translate-y-1 hover:shadow-soft active:scale-95",
                tint,
              ].join(" ")}
              aria-label={`Chữ ${l.upper}`}
            >
              <span className="font-display text-3xl font-extrabold text-navy sm:text-4xl md:text-5xl">
                {l.upper}
                <span className="text-navy/70">{l.lower}</span>
              </span>
              <span className="text-lg sm:text-xl md:text-2xl">{l.emoji}</span>

              {/* Mastery stars in the corner */}
              {level > 0 && (
                <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-yellow-600 shadow-sm">
                  <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                  {level}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {active && (
        <LetterDetail letter={active} onClose={() => setActive(null)} speak={speak} soundOn={soundOn} />
      )}
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full px-4 py-1.5 font-display text-sm font-extrabold transition-all sm:text-base",
        active
          ? "bg-navy text-white shadow-soft"
          : "bg-white text-navy/70 ring-2 ring-white shadow-card hover:text-navy",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
