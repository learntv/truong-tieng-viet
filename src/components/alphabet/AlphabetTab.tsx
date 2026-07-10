import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Grid3x3, Gamepad2, Volume2, VolumeX, Star } from "lucide-react";
import { ALPHABET, type AlphabetLetter } from "@/data/alphabet";
import {
  loadAlphabetProgress,
  saveAlphabetProgress,
  masteryLevel,
  type AlphabetProgress,
} from "@/lib/alphabet-progress";
import { sfx } from "@/lib/sfx";
import { ExploreMode } from "./ExploreMode";
import { QuizMode } from "./QuizMode";
import trauCon from "@/assets/trau-con.png";

type Mode = "explore" | "quiz";

const SOUND_KEY = "vui-hoc-alphabet-sound";

export function AlphabetTab() {
  const [mode, setMode] = useState<Mode>("explore");
  const [progress, setProgress] = useState<AlphabetProgress>({});
  const [soundOn, setSoundOn] = useState(true);
  const speakLockRef = useRef(false);

  // Client-only hydration to keep SSR happy.
  useEffect(() => {
    setProgress(loadAlphabetProgress());
    try {
      const s = window.localStorage.getItem(SOUND_KEY);
      if (s === "off") setSoundOn(false);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn((v) => {
      const next = !v;
      try {
        window.localStorage.setItem(SOUND_KEY, next ? "on" : "off");
      } catch {
        /* ignore */
      }
      if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  }, []);

  const updateProgress = useCallback((updater: (p: AlphabetProgress) => AlphabetProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      saveAlphabetProgress(next);
      return next;
    });
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!soundOn) return;
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      // Debounce rapid taps so a child mashing the card doesn't stack speech.
      if (speakLockRef.current) return;
      speakLockRef.current = true;
      setTimeout(() => {
        speakLockRef.current = false;
      }, 200);
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "vi-VN";
        u.rate = 0.75;
        u.pitch = 1.15;
        const voices = window.speechSynthesis.getVoices();
        const vi = voices.find((v) => v.lang.toLowerCase().startsWith("vi"));
        if (vi) u.voice = vi;
        window.speechSynthesis.speak(u);
      } catch {
        /* ignore */
      }
    },
    [soundOn],
  );

  // Total mastery for the small header progress bar.
  const stats = useMemo(() => {
    let learned = 0;
    let stars = 0;
    for (const l of ALPHABET) {
      const level = masteryLevel(progress[l.upper] ?? { seen: 0, correct: 0, wrong: 0 });
      if (level >= 1) learned++;
      stars += level;
    }
    return { learned, stars, total: ALPHABET.length };
  }, [progress]);

  const handleLetterOpen = useCallback(
    (letter: AlphabetLetter) => {
      if (soundOn) sfx.pop();
      updateProgress((p) => {
        const cur = p[letter.upper] ?? { seen: 0, correct: 0, wrong: 0 };
        return { ...p, [letter.upper]: { ...cur, seen: cur.seen + 1 } };
      });
    },
    [soundOn, updateProgress],
  );

  const handleQuizAnswer = useCallback(
    (letter: AlphabetLetter, correct: boolean) => {
      if (soundOn) {
        if (correct) sfx.sparkle();
        else sfx.locked();
      }
      updateProgress((p) => {
        const cur = p[letter.upper] ?? { seen: 0, correct: 0, wrong: 0 };
        return {
          ...p,
          [letter.upper]: {
            seen: Math.max(cur.seen, 1),
            correct: cur.correct + (correct ? 1 : 0),
            wrong: cur.wrong + (correct ? 0 : 1),
          },
        };
      });
    },
    [soundOn, updateProgress],
  );

  return (
    <main className="flex-1 bg-gradient-to-b from-sky/60 via-cream to-white pb-16">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Hero */}
        <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:mb-8">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={trauCon}
              alt="Trâu con"
              className="hidden h-20 w-20 shrink-0 animate-bob object-contain sm:block"
            />
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
                Bảng chữ cái vui nhộn <Sparkles className="inline h-6 w-6 text-yellow-500" />
              </h1>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Nghe, nhìn và chơi cùng Trâu con — mỗi chữ một câu chuyện nhỏ!
              </p>
            </div>
          </div>
          <button
            onClick={toggleSound}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-card ring-2 ring-white transition hover:scale-105 active:scale-95"
            aria-label={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
            title={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {soundOn ? (
              <Volume2 className="h-5 w-5 text-primary" />
            ) : (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Progress strip */}
        <div className="mb-6 flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card ring-2 ring-white sm:p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-sunset text-2xl shadow-glow-yellow">
            🏆
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-display text-sm font-extrabold text-navy sm:text-base">
                Em đã làm quen {stats.learned}/{stats.total} chữ
              </p>
              <p className="inline-flex items-center gap-1 text-xs font-bold text-yellow-600 sm:text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {stats.stars}
              </p>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${(stats.learned / stats.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mode switcher */}
        <div className="mb-6 flex gap-2 rounded-full bg-white p-1.5 shadow-card ring-2 ring-white sm:mb-8 sm:gap-3 sm:p-2">
          <ModeButton
            active={mode === "explore"}
            onClick={() => {
              setMode("explore");
              if (soundOn) sfx.click();
            }}
            icon={<Grid3x3 className="h-4 w-4 sm:h-5 sm:w-5" />}
            label="Khám phá"
          />
          <ModeButton
            active={mode === "quiz"}
            onClick={() => {
              setMode("quiz");
              if (soundOn) sfx.click();
            }}
            icon={<Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            label="Trò chơi"
          />
        </div>

        {mode === "explore" ? (
          <ExploreMode
            progress={progress}
            onOpen={handleLetterOpen}
            speak={speak}
            soundOn={soundOn}
          />
        ) : (
          <QuizMode onAnswer={handleQuizAnswer} speak={speak} soundOn={soundOn} />
        )}
      </div>
    </main>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 font-display text-sm font-extrabold transition-all sm:px-6 sm:py-3 sm:text-base",
        active
          ? "bg-gradient-primary text-white shadow-soft"
          : "text-navy/70 hover:bg-muted hover:text-navy",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}
