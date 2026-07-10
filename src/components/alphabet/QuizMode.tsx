import { useCallback, useEffect, useMemo, useState } from "react";
import { Volume2, RefreshCw, Trophy, Star } from "lucide-react";
import { ALPHABET, type AlphabetLetter } from "@/data/alphabet";
import trauCon from "@/assets/trau-con.png";

type Round = {
  target: AlphabetLetter;
  options: AlphabetLetter[];
  kind: "sound-to-letter" | "image-to-letter";
};

const ROUNDS_PER_GAME = 8;

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeRound(exclude?: string): Round {
  const pool = shuffle(exclude ? ALPHABET.filter((l) => l.upper !== exclude) : ALPHABET);
  const target = pool[0];
  const distractors = pool.slice(1, 4);
  const options = shuffle([target, ...distractors]);
  const kind: Round["kind"] = Math.random() < 0.5 ? "sound-to-letter" : "image-to-letter";
  return { target, options, kind };
}

function buildGame(): Round[] {
  const rounds: Round[] = [];
  let last: string | undefined;
  for (let i = 0; i < ROUNDS_PER_GAME; i++) {
    const r = makeRound(last);
    rounds.push(r);
    last = r.target.upper;
  }
  return rounds;
}

const CHEERS = [
  "Giỏi quá!",
  "Chính xác!",
  "Tuyệt vời!",
  "Xuất sắc!",
  "Đúng rồi nè!",
];

const ENCOURAGE = [
  "Gần rồi, thử lại nhé!",
  "Không sao, mình thử lại!",
  "Cố lên nào!",
];

export function QuizMode({
  onAnswer,
  speak,
  soundOn,
}: {
  onAnswer: (l: AlphabetLetter, correct: boolean) => void;
  speak: (text: string) => void;
  soundOn: boolean;
}) {
  const [game, setGame] = useState<Round[]>(() => buildGame());
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const round = game[index];

  // Auto-speak the target's phonic on new sound-round.
  useEffect(() => {
    if (!round) return;
    if (round.kind === "sound-to-letter") {
      const t = setTimeout(() => speak(round.target.phonic), 250);
      return () => clearTimeout(t);
    }
    return;
  }, [round, speak]);

  const replay = useCallback(() => {
    if (round?.kind === "sound-to-letter") speak(round.target.phonic);
  }, [round, speak]);

  const pick = (l: AlphabetLetter) => {
    if (picked) return;
    setPicked(l.upper);
    const correct = l.upper === round.target.upper;
    onAnswer(round.target, correct);
    setFeedback({
      ok: correct,
      msg: correct
        ? CHEERS[Math.floor(Math.random() * CHEERS.length)]
        : ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)],
    });
    if (correct) setScore((s) => s + 1);
    // Speak the correct answer as reinforcement.
    setTimeout(() => speak(round.target.phonic), 300);

    setTimeout(() => {
      setPicked(null);
      setFeedback(null);
      if (index + 1 >= game.length) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, 1400);
  };

  const restart = () => {
    setGame(buildGame());
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
    setFeedback(null);
  };

  if (finished) {
    const stars: 1 | 2 | 3 = score >= 7 ? 3 : score >= 5 ? 2 : 1;
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-[36px] bg-white p-8 text-center shadow-card ring-2 ring-white">
        <img src={trauCon} alt="Trâu con" className="h-28 w-28 animate-bob object-contain" />
        <Trophy className="mt-3 h-10 w-10 text-yellow-500" />
        <h3 className="mt-2 font-display text-2xl font-extrabold text-navy sm:text-3xl">
          Hoàn thành!
        </h3>
        <p className="mt-1 text-muted-foreground">
          Em trả lời đúng {score}/{game.length} câu.
        </p>
        <div className="mt-4 flex gap-2">
          {[1, 2, 3].map((n) => (
            <Star
              key={n}
              className={[
                "h-10 w-10 transition-all duration-300",
                n <= stars ? "fill-yellow-400 text-yellow-400 animate-float-badge" : "text-muted",
              ].join(" ")}
              style={{ animationDelay: `${n * 120}ms` }}
            />
          ))}
        </div>
        <button
          onClick={restart}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-display font-extrabold text-white shadow-soft transition hover:scale-105 active:scale-95"
        >
          <RefreshCw className="h-5 w-5" />
          Chơi lại
        </button>
      </div>
    );
  }

  const progressPct = ((index + (picked ? 1 : 0)) / game.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Round progress */}
      <div className="mb-5 flex items-center gap-3">
        <span className="font-display text-sm font-extrabold text-navy sm:text-base">
          Câu {index + 1}/{game.length}
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-meadow transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="inline-flex items-center gap-1 font-display text-sm font-extrabold text-yellow-600 sm:text-base">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          {score}
        </span>
      </div>

      {/* Prompt */}
      <div className="mb-6 flex flex-col items-center rounded-[32px] bg-white p-6 text-center shadow-card ring-2 ring-white sm:p-8">
        {round.kind === "sound-to-letter" ? (
          <>
            <p className="mb-3 text-sm font-semibold text-muted-foreground sm:text-base">
              Nghe âm và chọn chữ đúng
            </p>
            <button
              onClick={replay}
              disabled={!soundOn}
              className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-primary text-white shadow-glow-primary transition hover:scale-110 active:scale-95 disabled:opacity-50 sm:h-28 sm:w-28"
              aria-label="Nghe lại"
            >
              <Volume2 className="h-10 w-10 sm:h-12 sm:w-12" />
            </button>
            <p className="mt-3 text-xs text-muted-foreground">Bấm để nghe lại</p>
          </>
        ) : (
          <>
            <p className="mb-3 text-sm font-semibold text-muted-foreground sm:text-base">
              Chọn chữ đầu của từ này
            </p>
            <div className="text-7xl sm:text-8xl">{round.target.emoji}</div>
            <p className="mt-2 font-display text-xl font-extrabold text-navy sm:text-2xl">
              {round.target.word}
            </p>
          </>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {round.options.map((opt) => {
          const isPicked = picked === opt.upper;
          const isCorrectPick = picked && opt.upper === round.target.upper;
          const wrong = isPicked && opt.upper !== round.target.upper;
          const ok = isCorrectPick;
          return (
            <button
              key={opt.upper}
              onClick={() => pick(opt)}
              disabled={picked !== null}
              className={[
                "flex aspect-square items-center justify-center rounded-3xl bg-white font-display text-4xl font-extrabold text-navy ring-2 ring-white shadow-card transition-all duration-200 ease-bounce sm:text-5xl md:text-6xl",
                !picked && "hover:-translate-y-1 hover:shadow-soft active:scale-95",
                ok && "!bg-green text-white ring-green shadow-glow-green scale-105",
                wrong && "!bg-primary/90 text-white ring-primary/30 opacity-60",
                picked && !isPicked && !isCorrectPick && "opacity-50",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {opt.upper}
              <span className="text-navy/70">{opt.lower}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback bubble */}
      {feedback && (
        <div className="mt-6 flex justify-center">
          <div
            className={[
              "rounded-full px-6 py-3 font-display text-lg font-extrabold shadow-soft animate-modal-pop-in",
              feedback.ok ? "bg-green text-white" : "bg-yellow text-navy",
            ].join(" ")}
          >
            {feedback.ok ? "🎉 " : "💪 "}
            {feedback.msg}
          </div>
        </div>
      )}
    </div>
  );
}

// Kept for future variants — unused in this bundle.
export const _internal = { buildGame, makeRound, shuffle, useMemo };
