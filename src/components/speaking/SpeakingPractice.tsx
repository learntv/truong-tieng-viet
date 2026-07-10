import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Star, ThumbsUp, Volume2 } from "lucide-react";
import {
  cancelSpeech,
  canRecordAudio,
  compareSentence,
  getSpeechRecognitionCtor,
  getVietnameseVoice,
  speak,
  startRecognition,
  starsFromRatio,
  type RecognitionSession,
  type SpeakingSentence,
  type Stars,
  type WordMatch,
} from "@/lib/speech";
import {
  loadSpeakingProgress,
  recordSpeakingAttempt,
  type SpeakingProgress,
} from "@/lib/speaking-progress";
import { STAGE_COLORS } from "@/components/learning/StageCard";
import { ConfettiBurst } from "@/components/learning/ConfettiBurst";
import { RecordButton } from "./RecordButton";

type Stage = "ready" | "recording" | "review";

type GradeResult = {
  stars: Stars;
  words: WordMatch[];
  graded: boolean; // false → no STT available, show self-assessment instead
};

const PRAISE: Record<Stars, string> = {
  0: "Cô chưa nghe rõ — em thử nói to hơn nhé! 🌱",
  1: "Cố lên! Nghe cô đọc lại rồi thử lần nữa nhé 🌱",
  2: "Giỏi lắm! Thử lại để tròn vành rõ chữ hơn nhé 💪",
  3: "Tuyệt vời! Em nói tròn vành rõ chữ! 🎉",
};

function StarRow({ stars }: { stars: Stars }) {
  return (
    <div className="flex justify-center gap-1.5">
      {([1, 2, 3] as const).map((i) => (
        <Star
          key={i}
          className={[
            "h-9 w-9 transition-transform",
            i <= stars ? "fill-yellow-400 text-yellow-500 animate-hop" : "text-stone-300",
          ].join(" ")}
          style={i <= stars ? { animationDelay: `${(i - 1) * 120}ms` } : undefined}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export function SpeakingPractice({
  title,
  emoji,
  sentences,
  colorIndex,
}: {
  title: string;
  emoji: string;
  sentences: SpeakingSentence[];
  colorIndex: number;
}) {
  const color = STAGE_COLORS[colorIndex % STAGE_COLORS.length];

  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("ready");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [grading, setGrading] = useState(false);
  const [micDenied, setMicDenied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [, setProgress] = useState<SpeakingProgress>(loadSpeakingProgress);
  const [hasViVoice, setHasViVoice] = useState(false);

  const recognitionRef = useRef<RecognitionSession | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const canRecord = useMemo(() => canRecordAudio(), []);
  const sttAvailable = useMemo(() => getSpeechRecognitionCtor() != null, []);

  const sentence: SpeakingSentence | undefined = sentences[index];

  // Voice lists load asynchronously — re-check when the browser announces them.
  useEffect(() => {
    const check = () => setHasViVoice(getVietnameseVoice() != null);
    check();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.addEventListener("voiceschanged", check);
      return () => window.speechSynthesis.removeEventListener("voiceschanged", check);
    }
  }, []);

  // Cleanup on unmount: stop TTS/recognition, release the recorded-audio blob.
  useEffect(
    () => () => {
      cancelSpeech();
      recognitionRef.current?.abort();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    },
    [],
  );

  function setRecordedAudio(url: string | null) {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = url;
    setAudioUrl(url);
  }

  function resetForSentence(nextIndex: number) {
    cancelSpeech();
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setRecordedAudio(null);
    setResult(null);
    setGrading(false);
    setStage("ready");
    setIndex(nextIndex);
  }

  const goTo = (i: number) => {
    if (i < 0 || i >= sentences.length || i === index) return;
    resetForSentence(i);
  };

  function saveAttempt(stars: Stars) {
    if (!sentence) return;
    setProgress(recordSpeakingAttempt(sentence.id, stars));
    if (stars === 3) setShowConfetti(true);
  }

  const handleRecordStart = () => {
    cancelSpeech();
    setResult(null);
    setStage("recording");
    recognitionRef.current = sttAvailable ? startRecognition() : null;
  };

  const handleRecordFinish = async (url: string) => {
    setRecordedAudio(url);
    setStage("review");
    const session = recognitionRef.current;
    recognitionRef.current = null;

    if (!session || !sentence) {
      // No STT on this browser (e.g. Safari/iPad) — self-assessment mode.
      setResult({ stars: 0, words: [], graded: false });
      return;
    }

    setGrading(true);
    const transcript = await session.finish();
    const { ratio, words } = compareSentence(sentence.text, transcript);
    const stars = starsFromRatio(ratio, transcript.length > 0);
    setGrading(false);
    setResult({ stars, words, graded: true });
    saveAttempt(stars);
  };

  const handleSelfAssessDone = () => {
    saveAttempt(3);
    setResult({ stars: 3, words: [], graded: true });
  };

  const handleTryAgain = () => {
    setRecordedAudio(null);
    setResult(null);
    setStage("ready");
  };

  // Listen-and-repeat fallback when the mic is blocked entirely.
  const handleRepeatedAloud = () => {
    saveAttempt(1);
    goTo(Math.min(index + 1, sentences.length - 1));
  };

  if (sentences.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mb-4 text-6xl">🎤</div>
        <h1 className="mb-2 font-display text-2xl font-extrabold text-navy">
          Chủ đề này chưa có câu luyện
        </h1>
        <p className="mb-6 text-muted-foreground">Em chọn chủ đề khác để luyện nói nhé!</p>
        <Link
          to="/hoc-tap/luyen-noi"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Chọn chủ đề khác
        </Link>
      </div>
    );
  }

  const isReviewing = stage === "review";
  const showSelfAssess = isReviewing && result != null && !result.graded;
  const showGraded = isReviewing && result != null && result.graded;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <Link
          to="/hoc-tap/luyen-noi"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground transition-colors hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" />
          Chọn chủ đề khác
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl leading-none">{emoji}</span>
        <h1 className="font-display text-xl font-extrabold text-navy sm:text-2xl">{title}</h1>
      </div>

      {/* Progress */}
      <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={["h-full rounded-full transition-[width] duration-500 ease-out", color.gradient].join(" ")}
          style={{ width: `${((index + 1) / sentences.length) * 100}%` }}
        />
      </div>
      <p className="mb-5 text-xs font-bold text-muted-foreground">
        Câu {index + 1}/{sentences.length}
      </p>

      {/* Practice card */}
      <div className="relative rounded-2xl bg-card p-5 shadow-card sm:p-8">
        {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}

        {sentence?.imageUrl && (
          <img
            src={sentence.imageUrl}
            alt="Hình minh họa"
            className="mx-auto mb-5 max-h-52 rounded-xl object-contain ring-1 ring-border/60"
          />
        )}

        {/* The sentence — word chips turn green/amber after grading */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-center">
          {showGraded && result.words.length > 0
            ? result.words.map((w, i) => (
                <span
                  key={i}
                  className={[
                    "rounded-lg px-1.5 py-0.5 font-display text-2xl font-extrabold sm:text-3xl",
                    w.matched ? "text-navy" : "bg-amber-100 text-amber-700",
                  ].join(" ")}
                >
                  {w.word}
                </span>
              ))
            : (
                <p className="font-display text-2xl font-extrabold leading-snug text-navy sm:text-3xl">
                  {sentence?.text}
                </p>
              )}
        </div>

        {/* Listen to the model pronunciation */}
        {hasViVoice && sentence && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => speak(sentence.text)}
              className={[
                "inline-flex cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-2 font-display text-sm font-extrabold transition active:scale-95 hover:-translate-y-0.5 hover:shadow-card",
                color.bgSoft,
                color.border,
                color.text,
              ].join(" ")}
            >
              <Volume2 className="h-4 w-4" strokeWidth={2.5} />
              Nghe cô đọc
            </button>
          </div>
        )}

        {/* Record / review area */}
        {!canRecord || micDenied ? (
          <div className="mx-auto max-w-sm rounded-2xl bg-sky/30 p-4 text-center">
            <p className="text-sm font-semibold text-navy">
              {micDenied
                ? "Micro chưa được bật. Không sao — em nghe cô đọc rồi đọc to theo nhé!"
                : "Thiết bị này chưa ghi âm được. Em nghe cô đọc rồi đọc to theo nhé!"}
            </p>
            <button
              onClick={handleRepeatedAloud}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-sm transition hover:scale-105 active:scale-95"
            >
              <ThumbsUp className="h-4 w-4" strokeWidth={2.5} />
              Em đã đọc to theo cô!
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            {!isReviewing && (
              <RecordButton
                onStart={handleRecordStart}
                onFinish={handleRecordFinish}
                onMicDenied={() => setMicDenied(true)}
              />
            )}

            {isReviewing && (
              <div className="flex w-full max-w-md flex-col items-center gap-4">
                {audioUrl && (
                  <div className="w-full text-center">
                    <p className="mb-1.5 font-display text-sm font-bold text-navy">
                      🎧 Nghe lại giọng em
                    </p>
                    <audio controls src={audioUrl} className="w-full" />
                  </div>
                )}

                {grading && (
                  <p className="text-sm font-semibold text-muted-foreground">Cô đang nghe lại…</p>
                )}

                {showGraded && !grading && (
                  <div className="flex flex-col items-center gap-2">
                    <StarRow stars={result.stars} />
                    <p className="text-center text-sm font-bold text-navy">{PRAISE[result.stars]}</p>
                  </div>
                )}

                {showSelfAssess && !grading && (
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-center text-sm font-bold text-navy">
                      Em nghe lại rồi so với cô nhé — em thấy giống chưa?
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={handleSelfAssessDone}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-600 px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-sm transition hover:scale-105 active:scale-95"
                      >
                        😊 Giống rồi!
                      </button>
                      <button
                        onClick={handleTryAgain}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 font-display text-sm font-extrabold text-navy shadow-sm transition hover:bg-muted active:scale-95"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Thử lại
                      </button>
                    </div>
                  </div>
                )}

                {!grading && !showSelfAssess && (
                  <button
                    onClick={handleTryAgain}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 font-display text-sm font-extrabold text-navy shadow-sm transition hover:bg-muted active:scale-95"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Nói lại lần nữa
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom nav — mirrors the lesson page pattern */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className={[
            "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold text-navy shadow-sm transition",
            index > 0 ? "hover:bg-muted" : "cursor-not-allowed opacity-40",
          ].join(" ")}
        >
          <ChevronLeft className="h-4 w-4" />
          Câu trước
        </button>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {sentences.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Câu ${i + 1}`}
              className={[
                "h-2 rounded-full transition-all",
                i === index ? ["w-5", color.bg].join(" ") : "w-2 bg-muted hover:bg-muted-foreground/40",
              ].join(" ")}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(index + 1)}
          disabled={index >= sentences.length - 1}
          className={[
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-sm transition",
            index < sentences.length - 1
              ? [color.gradient, "hover:brightness-110"].join(" ")
              : "cursor-not-allowed bg-muted text-muted-foreground opacity-60",
          ].join(" ")}
        >
          Câu tiếp theo
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
