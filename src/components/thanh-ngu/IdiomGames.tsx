import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon, type IconifyIcon } from "@iconify/react";
import roundArrowForward from "@iconify-icons/ic/round-arrow-forward";
import roundEditNote from "@iconify-icons/ic/round-edit-note";
import roundImage from "@iconify-icons/ic/round-image";
import roundLightbulb from "@iconify-icons/ic/round-lightbulb";
import roundReplay from "@iconify-icons/ic/round-replay";
import roundSort from "@iconify-icons/ic/round-sort";
import roundStyle from "@iconify-icons/ic/round-style";
import trongDong from "@/assets/symbols/trong-dong.svg";
import { ConfettiBurst } from "@/components/learning/ConfettiBurst";
import { BOX_TONES } from "@/components/learning/boxTones";
import { Mascot } from "@/components/Mascot";
import { IdiomArt } from "@/components/thanh-ngu/IdiomArt";
import { skyButton } from "@/components/ui/sky-button";
import { IDIOMS, idiomText, type Idiom } from "@/data/thanh-ngu";
import { glossOf } from "@/lib/localized";
import { sfx } from "@/lib/sfx";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

/**
 * The idiom games, one at a time behind a row of tabs. Four are rounds of
 * questions sharing one frame (RoundCard): fill the gap, name the picture,
 * match the meaning, put the words in order. The fifth is a memory game of
 * pictures and the idioms they draw.
 *
 * Every game deals from the same deck in its own random order. The order is
 * only picked after mount, so the server and the first client render agree.
 */

type GameId = "fill" | "picture" | "meaning" | "order" | "memory";

const GAMES: { id: GameId; label: () => string; icon: IconifyIcon; tone: string }[] = [
  { id: "fill", label: m.learn_idioms_game_fill, icon: roundEditNote, tone: "bg-box-mint" },
  { id: "picture", label: m.learn_idioms_game_picture, icon: roundImage, tone: "bg-box-ice" },
  {
    id: "meaning",
    label: m.learn_idioms_game_meaning,
    icon: roundLightbulb,
    tone: BOX_TONES.sun.light,
  },
  { id: "order", label: m.learn_idioms_game_order, icon: roundSort, tone: "bg-box-peach" },
  { id: "memory", label: m.learn_idioms_game_memory, icon: roundStyle, tone: "bg-box-lavender" },
];

/** How many idioms a round-based game asks before the score. */
const ROUNDS = 10;
/** How many idioms the memory game lays out, as pairs. */
const PAIRS = 6;

const LABEL = "text-xs font-extrabold uppercase tracking-[0.08em] text-sky-ink-soft";
const PANEL = "rounded-[1.25rem]";

/**
 * The games as binder tabs on one white page, the way Tập viết files its
 * sections: the closed tabs are pastel and tucked behind the page's top edge,
 * and the open one is the page's own white, standing in front of it so the
 * two read as one sheet.
 */
export function IdiomGames({ onSeeMeaning }: { onSeeMeaning: (idiom: Idiom) => void }) {
  const [game, setGame] = useState<GameId>("fill");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = GAMES.findIndex((g) => g.id === game);

  const select = (index: number) => {
    if (index === selectedIndex) return;
    sfx.click();
    setGame(GAMES[index].id);
  };

  // Arrow keys move between tabs and open them, per the ARIA tabs pattern; only
  // the open tab sits in the Tab order.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = GAMES.length - 1;
    const next =
      e.key === "ArrowRight"
        ? (selectedIndex + 1) % GAMES.length
        : e.key === "ArrowLeft"
          ? (selectedIndex - 1 + GAMES.length) % GAMES.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    select(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="mt-5">
      <div
        role="tablist"
        aria-label={m.learn_idioms_games()}
        onKeyDown={onKeyDown}
        // A fixed height, so the row doesn't grow or shrink with whichever tab
        // is open (on phones some labels wrap to two lines).
        className="flex h-[4.5rem] items-end gap-1 sm:h-14 sm:gap-2"
      >
        {GAMES.map((g, i) => {
          const isOpen = g.id === game;
          return (
            <button
              key={g.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`idiom-game-tab-${g.id}`}
              type="button"
              role="tab"
              aria-selected={isOpen}
              aria-controls="idiom-game-panel"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => select(i)}
              className={[
                "flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-t-[1rem] px-1 font-display text-xs font-extrabold leading-tight text-sky-ink transition-transform duration-200 sm:flex-none sm:flex-row sm:gap-2 sm:rounded-t-[1.25rem] sm:px-5 sm:text-base",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ribbon",
                isOpen
                  ? // In front of the page, running down over its top edge so the seam disappears.
                    "relative z-20 -mb-2 h-[calc(100%+0.5rem)] bg-white pb-2"
                  : // Behind the page, dropped so its foot tucks under the page edge.
                    [
                      "relative z-0 h-[calc(100%-0.25rem)] translate-y-1.5 pb-1.5 hover:translate-y-0.5",
                      g.tone,
                    ].join(" "),
              ].join(" ")}
            >
              <Icon icon={g.icon} className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
              <span className="text-center sm:whitespace-nowrap">{g.label()}</span>
            </button>
          );
        })}
      </div>

      <div
        id="idiom-game-panel"
        role="tabpanel"
        aria-labelledby={`idiom-game-tab-${game}`}
        className="relative z-10 rounded-[1.5rem] rounded-tl-none bg-white p-3 shadow-[0_6px_20px_rgba(12,58,110,0.14)] sm:p-4"
      >
        {game === "fill" && <FillGame onSeeMeaning={onSeeMeaning} />}
        {game === "picture" && <PictureGame onSeeMeaning={onSeeMeaning} />}
        {game === "meaning" && <MeaningGame onSeeMeaning={onSeeMeaning} />}
        {game === "order" && <OrderGame onSeeMeaning={onSeeMeaning} />}
        {game === "memory" && <MemoryGame />}
      </div>
    </div>
  );
}

/* ── Shared machinery ──────────────────────────────────────────────────── */

/** A shuffle that gives the same order for the same seed. */
function shuffled<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const randomSeed = () => Math.floor(Math.random() * 1_000_000) + 1;

/** A seed that is 0 on the server and random once mounted, with a way to reshuffle. */
function useSeed() {
  const [seed, setSeed] = useState(0);
  useEffect(() => setSeed(randomSeed()), []);
  return [seed, () => setSeed(randomSeed())] as const;
}

/**
 * A run of questions: which idiom is up, whether it's solved, how many went
 * wrong first, and the score of idioms got right without a slip.
 */
function useRun() {
  const [seed, reseed] = useSeed();
  const order = useMemo(() => shuffled(IDIOMS, seed).slice(0, ROUNDS), [seed]);
  const [round, setRound] = useState(0);
  const [slips, setSlips] = useState(0);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const solve = () => {
    setSolved(true);
    if (slips === 0) setScore((s) => s + 1);
    setCelebrating(true);
    sfx.success();
  };
  const slip = () => {
    setSlips((n) => n + 1);
    sfx.locked();
  };
  const next = () => {
    sfx.pop();
    setRound((r) => r + 1);
    setSlips(0);
    setSolved(false);
  };
  const restart = () => {
    sfx.sparkle();
    reseed();
    setRound(0);
    setScore(0);
    setSlips(0);
    setSolved(false);
  };
  const stopCelebrating = useCallback(() => setCelebrating(false), []);

  return {
    seed,
    idiom: order[round] as Idiom | undefined,
    round,
    total: order.length,
    solved,
    score,
    celebrating,
    solve,
    slip,
    next,
    restart,
    stopCelebrating,
  };
}

type Run = ReturnType<typeof useRun>;

/** Trâu con cheering the final score, with a button to go again. */
function DoneCard({ message, onRestart }: { message: string; onRestart: () => void }) {
  return (
    <div
      className={[
        PANEL,
        "flex flex-col items-center gap-4 px-6 py-8 text-center sm:py-10",
        BOX_TONES.sun.light,
      ].join(" ")}
    >
      <Mascot pose="cheer" decorative className="h-28 animate-hop sm:h-36" />
      <p className="font-display text-xl font-bold text-sky-ink sm:text-2xl">{message}</p>
      <button onClick={onRestart} className={skyButton("primary")}>
        <Icon icon={roundReplay} className="h-4 w-4" aria-hidden />
        {m.learn_idioms_quiz_again()}
      </button>
    </div>
  );
}

/**
 * One question's frame, on the idiom's tone: the progress along the top, an
 * optional picture on the left, the question on the right, and once it's
 * solved, confetti and the way on.
 */
function RoundCard({
  run,
  idiom,
  art = true,
  onSeeMeaning,
  children,
}: {
  run: Run;
  idiom: Idiom;
  art?: boolean;
  onSeeMeaning: (idiom: Idiom) => void;
  children: ReactNode;
}) {
  const tone = BOX_TONES[idiom.tone];
  return (
    <div
      className={[
        PANEL,
        "relative flex flex-col gap-5 p-3 sm:flex-row sm:items-center sm:gap-7 sm:p-4",
        tone.deep,
      ].join(" ")}
    >
      {run.celebrating && <ConfettiBurst onDone={run.stopCelebrating} />}

      {art && (
        <div
          className={[
            "aspect-[3/2] shrink-0 overflow-hidden rounded-[1.1rem] sm:w-[44%]",
            tone.light,
          ].join(" ")}
        >
          <IdiomArt key={idiom.id} id={idiom.id} className="block h-full w-full" />
        </div>
      )}

      <div
        className={[
          "flex min-w-0 flex-1 flex-col gap-5 pb-3 sm:pb-0",
          art ? "px-2 sm:px-0 sm:pr-3" : "px-2 pt-2 sm:px-3 sm:pt-1",
        ].join(" ")}
      >
        <div className="flex items-center gap-3">
          <span className={LABEL}>
            {m.learn_idioms_quiz_progress({ n: run.round + 1, total: run.total })}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/60">
            <div
              className={["h-full rounded-full transition-[width] duration-500", tone.bar].join(
                " ",
              )}
              style={{ width: `${((run.round + (run.solved ? 1 : 0)) / run.total) * 100}%` }}
            />
          </div>
        </div>

        {children}

        {run.solved && (
          <div className="flex flex-wrap gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button onClick={() => onSeeMeaning(idiom)} className={skyButton("white")}>
              {m.learn_idioms_quiz_see_meaning()}
            </button>
            <button onClick={run.next} className={skyButton("primary")}>
              {m.learn_idioms_quiz_next()}
              <Icon icon={roundArrowForward} className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** A tappable answer: plain while open, green once right, struck out once wrong. */
function choiceClass(state: "open" | "right" | "wrong" | "closed") {
  return [
    "cursor-pointer rounded-full font-display font-bold shadow-btn transition-[transform,box-shadow,background-color,opacity] active:translate-y-[1px] active:shadow-btn-active disabled:cursor-default",
    state === "right"
      ? "bg-green text-white"
      : state === "wrong"
        ? "animate-wiggle bg-white/60 text-sky-ink/50 line-through opacity-70"
        : state === "closed"
          ? "bg-white text-sky-ink opacity-60"
          : "bg-white text-sky-ink hover:-translate-y-0.5",
  ].join(" ");
}

/**
 * The open/right/wrong bookkeeping for a question with a fixed set of
 * answers. Resets whenever the idiom changes.
 */
function useChoices(run: Run, answer: string) {
  const [wrong, setWrong] = useState<string[]>([]);
  const idiomId = run.idiom?.id;
  useEffect(() => setWrong([]), [idiomId]);

  const pick = (option: string) => {
    if (run.solved || wrong.includes(option)) return;
    if (option === answer) run.solve();
    else {
      setWrong((w) => [...w, option]);
      run.slip();
    }
  };
  const stateOf = (option: string) =>
    run.solved
      ? option === answer
        ? "right"
        : "closed"
      : wrong.includes(option)
        ? "wrong"
        : "open";
  return { pick, stateOf, isDisabled: (o: string) => run.solved || wrong.includes(o) };
}

/** Two other idioms to offer beside `idiom`, the same ones every time for a seed. */
function decoys(idiom: Idiom, seed: number) {
  return shuffled(
    IDIOMS.filter((i) => i.id !== idiom.id),
    seed + IDIOMS.indexOf(idiom),
  ).slice(0, 2);
}

/**
 * The English for an idiom, when the site isn't in Vietnamese: set under the
 * question so a child learning from English can follow along. Plain weight, so
 * the Vietnamese above it stays the thing being read.
 */
function Gloss({ text, className = "" }: { text: { en: string }; className?: string }) {
  const gloss = glossOf(text);
  if (!gloss) return null;
  return (
    <span className={cn("block font-sans font-normal text-sky-ink-soft", className)}>{gloss}</span>
  );
}

/* ── Điền từ: fill the gap ─────────────────────────────────────────────── */

function FillGame({ onSeeMeaning }: { onSeeMeaning: (idiom: Idiom) => void }) {
  const run = useRun();
  const idiom = run.idiom;
  const answer = idiom ? idiom.words[idiom.blank].vi : "";
  const choices = useChoices(run, answer);
  const options = useMemo(
    () =>
      idiom ? shuffled([idiom.words[idiom.blank], ...idiom.distractors], run.seed + run.round) : [],
    [idiom, run.seed, run.round],
  );

  if (!idiom) {
    return (
      <DoneCard
        message={m.learn_idioms_quiz_done({ score: run.score, total: run.total })}
        onRestart={run.restart}
      />
    );
  }

  return (
    <RoundCard run={run} idiom={idiom} onSeeMeaning={onSeeMeaning}>
      <p
        lang="vi"
        className="flex flex-wrap items-baseline gap-x-2.5 gap-y-2 font-display text-2xl font-bold leading-snug text-sky-ink sm:text-3xl"
      >
        {idiom.words.map((word, i) =>
          i === idiom.blank ? (
            <span
              key={i}
              aria-label={run.solved ? undefined : m.learn_idioms_quiz_blank()}
              className={[
                "inline-block min-w-[3.5ch] rounded-xl px-2 text-center",
                run.solved
                  ? "animate-hop bg-white text-green"
                  : "border-[3px] border-dashed border-sky-ink/30 bg-white/50 text-transparent",
              ].join(" ")}
            >
              {run.solved ? word.vi : "?"}
            </span>
          ) : (
            <span key={i}>{word.vi}</span>
          ),
        )}
      </p>
      <Gloss text={idiom.translation} className="-mt-3 text-sm sm:text-base" />

      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const state = choices.stateOf(option.vi);
          return (
            <button
              key={option.vi}
              onClick={() => choices.pick(option.vi)}
              disabled={choices.isDisabled(option.vi)}
              className={["min-w-20 px-5 py-2.5 text-lg", choiceClass(state)].join(" ")}
            >
              <span lang="vi" className="block">
                {option.vi}
              </span>
            </button>
          );
        })}
      </div>
    </RoundCard>
  );
}

/* ── Đoán tranh: name the picture ──────────────────────────────────────── */

function PictureGame({ onSeeMeaning }: { onSeeMeaning: (idiom: Idiom) => void }) {
  const run = useRun();
  const idiom = run.idiom;
  const choices = useChoices(run, idiom?.id ?? "");
  const options = useMemo(
    () => (idiom ? shuffled([idiom, ...decoys(idiom, run.seed)], run.seed + run.round) : []),
    [idiom, run.seed, run.round],
  );

  if (!idiom) {
    return (
      <DoneCard
        message={m.learn_idioms_quiz_done({ score: run.score, total: run.total })}
        onRestart={run.restart}
      />
    );
  }

  return (
    <RoundCard run={run} idiom={idiom} onSeeMeaning={onSeeMeaning}>
      <p className="font-display text-xl font-bold text-sky-ink sm:text-2xl">
        {m.learn_idioms_game_picture_prompt()}
      </p>
      <div className="flex flex-col gap-2.5">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => choices.pick(option.id)}
            disabled={choices.isDisabled(option.id)}
            className={[
              "px-5 py-3 text-left text-base sm:text-lg",
              choiceClass(choices.stateOf(option.id)),
            ].join(" ")}
          >
            <span lang="vi" className="block">
              {idiomText(option)}
            </span>
          </button>
        ))}
      </div>
    </RoundCard>
  );
}

/* ── Hiểu nghĩa: match the meaning ─────────────────────────────────────── */

function MeaningGame({ onSeeMeaning }: { onSeeMeaning: (idiom: Idiom) => void }) {
  const run = useRun();
  const idiom = run.idiom;
  const choices = useChoices(run, idiom?.id ?? "");
  const options = useMemo(
    () => (idiom ? shuffled([idiom, ...decoys(idiom, run.seed)], run.seed + run.round) : []),
    [idiom, run.seed, run.round],
  );

  if (!idiom) {
    return (
      <DoneCard
        message={m.learn_idioms_quiz_done({ score: run.score, total: run.total })}
        onRestart={run.restart}
      />
    );
  }

  const gloss = glossOf(idiom.meaning);

  return (
    <RoundCard run={run} idiom={idiom} art={false} onSeeMeaning={onSeeMeaning}>
      <div>
        <p className={LABEL}>{m.learn_idioms_game_meaning_prompt()}</p>
        <p
          lang="vi"
          className="mt-2 font-display text-xl font-bold leading-snug text-sky-ink sm:text-2xl"
        >
          {idiom.meaning.vi}
        </p>
        {gloss && <p className="mt-1 text-sm leading-relaxed text-sky-ink-soft">{gloss}</p>}
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {options.map((option) => {
          const state = choices.stateOf(option.id);
          return (
            <button
              key={option.id}
              onClick={() => choices.pick(option.id)}
              disabled={choices.isDisabled(option.id)}
              className={[
                "flex cursor-pointer flex-col rounded-[1.1rem] bg-white p-1.5 text-left shadow-btn transition-[transform,box-shadow,opacity] active:translate-y-[1px] active:shadow-btn-active disabled:cursor-default sm:p-2",
                state === "open" ? "hover:-translate-y-0.5" : "",
                state === "right" ? "ring-4 ring-green" : "",
                state === "wrong" ? "animate-wiggle opacity-50 grayscale" : "",
                state === "closed" ? "opacity-60" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "block aspect-[3/2] overflow-hidden rounded-[0.8rem]",
                  BOX_TONES[option.tone].light,
                ].join(" ")}
              >
                <IdiomArt id={option.id} className="block h-full w-full" />
              </span>
              <span className="px-1 pb-1 pt-2">
                <span
                  lang="vi"
                  className="block font-display text-xs font-bold leading-tight text-sky-ink sm:text-base"
                >
                  {idiomText(option)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </RoundCard>
  );
}

/* ── Xếp chữ: put the words in order ───────────────────────────────────── */

function OrderGame({ onSeeMeaning }: { onSeeMeaning: (idiom: Idiom) => void }) {
  const run = useRun();
  const idiom = run.idiom;
  // The chips, by their index in the idiom, shuffled; and those placed so far, in order.
  const chips = useMemo(
    () =>
      idiom
        ? shuffled(
            idiom.words.map((_, i) => i),
            run.seed + run.round + 7,
          )
        : [],
    [idiom, run.seed, run.round],
  );
  const [placed, setPlaced] = useState<number[]>([]);
  // The chip that was tapped out of turn; `tick` re-keys it so the shake replays.
  const [shake, setShake] = useState<{ chip: number; tick: number } | null>(null);
  const idiomId = idiom?.id;
  useEffect(() => {
    setPlaced([]);
    setShake(null);
  }, [idiomId]);

  if (!idiom) {
    return (
      <DoneCard
        message={m.learn_idioms_quiz_done({ score: run.score, total: run.total })}
        onRestart={run.restart}
      />
    );
  }

  const tap = (chip: number) => {
    if (run.solved || placed.includes(chip)) return;
    // Matched by the word, not its position, so either "lá" fits either slot.
    if (idiom.words[chip].vi === idiom.words[placed.length].vi) {
      const now = [...placed, chip];
      setPlaced(now);
      setShake(null);
      if (now.length === idiom.words.length) run.solve();
      else sfx.pop();
    } else {
      setShake((s) => ({ chip, tick: (s?.tick ?? 0) + 1 }));
      run.slip();
    }
  };

  return (
    <RoundCard run={run} idiom={idiom} onSeeMeaning={onSeeMeaning}>
      <div>
        <p className={LABEL}>{m.learn_idioms_game_order_prompt()}</p>
        <Gloss text={idiom.translation} className="mt-1.5 text-base sm:text-lg" />
      </div>

      <div lang="vi" className="flex flex-wrap gap-2">
        {idiom.words.map((_, slot) => {
          const chip = placed[slot];
          return (
            <span
              key={slot}
              className={[
                "inline-flex min-h-11 min-w-14 items-center justify-center rounded-xl px-3 font-display text-lg font-bold sm:text-xl",
                chip === undefined
                  ? "border-[3px] border-dashed border-sky-ink/30 bg-white/40"
                  : run.solved
                    ? "animate-hop bg-white text-green"
                    : "bg-white text-sky-ink",
              ].join(" ")}
            >
              {chip === undefined ? "" : idiom.words[chip].vi}
            </span>
          );
        })}
      </div>

      {!run.solved && (
        <div className="flex flex-wrap gap-2.5">
          {chips.map((chip) =>
            placed.includes(chip) ? null : (
              <button
                key={shake?.chip === chip ? `${chip}-${shake.tick}` : `${chip}`}
                onClick={() => tap(chip)}
                className={[
                  "px-4 py-2 text-lg",
                  choiceClass("open"),
                  shake?.chip === chip ? "animate-wiggle" : "",
                ].join(" ")}
              >
                <span lang="vi" className="block">
                  {idiom.words[chip].vi}
                </span>
              </button>
            ),
          )}
        </div>
      )}
    </RoundCard>
  );
}

/* ── Lật thẻ: memory ───────────────────────────────────────────────────── */

type MemoryCard = { key: string; idiom: Idiom; face: "art" | "text" };

function MemoryGame() {
  const [seed, reseed] = useSeed();
  const cards = useMemo<MemoryCard[]>(() => {
    const picked = shuffled(IDIOMS, seed).slice(0, PAIRS);
    const all = picked.flatMap((idiom) => [
      { key: `${idiom.id}-art`, idiom, face: "art" as const },
      { key: `${idiom.id}-text`, idiom, face: "text" as const },
    ]);
    return shuffled(all, seed + 1);
  }, [seed]);

  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const stopCelebrating = useCallback(() => setCelebrating(false), []);
  const flipBack = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(flipBack.current), []);

  const done = matched.length === PAIRS;

  const flip = (index: number) => {
    const card = cards[index];
    if (open.length === 2 || open.includes(index) || matched.includes(card.idiom.id)) return;
    sfx.pop();
    const now = [...open, index];
    setOpen(now);
    if (now.length < 2) return;

    setMoves((n) => n + 1);
    const [a, b] = now.map((i) => cards[i]);
    if (a.idiom.id === b.idiom.id) {
      const nowMatched = [...matched, a.idiom.id];
      setMatched(nowMatched);
      setOpen([]);
      if (nowMatched.length === PAIRS) {
        setCelebrating(true);
        sfx.success();
      } else sfx.chirp();
    } else {
      flipBack.current = setTimeout(() => setOpen([]), 900);
    }
  };

  const restart = () => {
    sfx.sparkle();
    clearTimeout(flipBack.current);
    reseed();
    setOpen([]);
    setMatched([]);
    setMoves(0);
  };

  if (done && !celebrating) {
    return <DoneCard message={m.learn_idioms_game_memory_done({ n: moves })} onRestart={restart} />;
  }

  return (
    <div className={[PANEL, "relative p-3 sm:p-4", BOX_TONES.lavender.deep].join(" ")}>
      {celebrating && <ConfettiBurst onDone={stopCelebrating} />}
      <div className="mb-3 flex items-center justify-between gap-3 px-1 sm:mb-4">
        <p className="text-sm font-semibold text-sky-ink-soft">
          {m.learn_idioms_game_memory_prompt()}
        </p>
        <span className={[LABEL, "shrink-0"].join(" ")}>
          {m.learn_idioms_game_memory_moves({ n: moves })}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {cards.map((card, i) => {
          const isMatched = matched.includes(card.idiom.id);
          const faceUp = isMatched || open.includes(i);
          const tone = BOX_TONES[card.idiom.tone];
          return (
            <button
              key={card.key}
              onClick={() => flip(i)}
              disabled={faceUp}
              aria-label={faceUp ? idiomText(card.idiom) : `${i + 1}`}
              className="aspect-[4/3] cursor-pointer [perspective:800px] disabled:cursor-default"
            >
              <span
                className={[
                  "relative block h-full w-full transition-transform duration-500 [transform-style:preserve-3d]",
                  faceUp ? "[transform:rotateY(180deg)]" : "",
                ].join(" ")}
              >
                {/* Face down: a Đông Sơn drum face on the card's back. */}
                <span className="absolute inset-0 overflow-hidden rounded-[0.9rem] bg-box-cream shadow-btn [backface-visibility:hidden]">
                  <img
                    src={trongDong}
                    alt=""
                    className="absolute inset-0 m-auto h-[85%] w-[85%] object-contain opacity-30"
                  />
                </span>
                {/* Face up: the picture, or the idiom it draws. */}
                <span
                  className={[
                    "absolute inset-0 overflow-hidden rounded-[0.9rem] shadow-btn [backface-visibility:hidden] [transform:rotateY(180deg)]",
                    tone.light,
                    isMatched ? "ring-4 ring-green" : "",
                  ].join(" ")}
                >
                  {card.face === "art" ? (
                    <IdiomArt id={card.idiom.id} className="block h-full w-full" />
                  ) : (
                    <span className="flex h-full flex-col items-center justify-center p-2 text-center">
                      <span
                        lang="vi"
                        className="font-display text-sm font-bold leading-tight text-sky-ink sm:text-lg"
                      >
                        {idiomText(card.idiom)}
                      </span>
                    </span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
