import { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Star, ThumbsUp, Undo2, Volume2 } from "lucide-react";
import {
  canRecordAudio,
  compareSentence,
  getSpeechRecognitionCtor,
  startRecognition,
  starsFromRatio,
  type RecognitionSession,
  type SpeakingSentence,
  type SpokenWord,
  type Stars,
  type WordMatch,
} from "@/lib/speech";
import { useSpeakingProgress } from "@/hooks/useSpeakingProgress";
import { STAGE_COLORS } from "@/components/learning/stageColors";
import { ConfettiBurst } from "@/components/learning/ConfettiBurst";
import { useSingletonAudio } from "@/hooks/useSingletonAudio";
import { ttsSrc } from "@/lib/tts/text";
import { RecordButton } from "./RecordButton";

type Stage = "ready" | "recording" | "review";

type GradeResult = {
  stars: Stars;
  words: WordMatch[];
  graded: boolean; // false → no STT available, show self-assessment instead
  transcript?: string; // raw STT text, shown under the sentence for context
  spokenWords?: SpokenWord[]; // transcript split into words, flagging extras not in the target
  ratio?: number; // fraction of words matched — used to decide if the attempt was too far off to diff
};

// Below this, the attempt is too far off for a word-by-word diff to be
// helpful (or kind) — just encourage another try instead of a wall of red.
// Higher = stricter (more attempts get the "try again" message instead of a diff).
const TOO_WRONG_RATIO = 0.15;

function StarRow({
  stars,
  size = "h-9 w-9",
  animated = true,
  loading = false,
}: {
  stars: Stars;
  size?: string;
  animated?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="flex justify-center gap-1.5">
      {([1, 2, 3] as const).map((i) => (
        <Star
          key={i}
          className={[
            size,
            "transition-transform",
            loading
              ? "animate-pulse text-stone-300"
              : i <= stars
                ? ["fill-yellow-400 text-yellow-500", animated && "animate-hop"]
                    .filter(Boolean)
                    .join(" ")
                : "text-stone-300",
          ].join(" ")}
          style={
            !loading && animated && i <= stars
              ? { animationDelay: `${(i - 1) * 120}ms` }
              : undefined
          }
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
  const [result, setResult] = useState<GradeResult | null>(null);
  const [grading, setGrading] = useState(false);
  const [micDenied, setMicDenied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { progress, recordAttempt } = useSpeakingProgress();

  const recognitionRef = useRef<RecognitionSession | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  // Optimistic default (server has no navigator/MediaRecorder to check against)
  // so SSR and the client's first render agree — corrected right after mount
  // instead of flashing the "can't record" fallback for the common case.
  const [canRecord, setCanRecord] = useState(true);
  useEffect(() => {
    setCanRecord(canRecordAudio());
  }, []);
  const sttAvailable = useMemo(() => getSpeechRecognitionCtor() != null, []);

  const sentence: SpeakingSentence | undefined = sentences[index];
  const bestStars: Stars = (sentence && progress[sentence.id]?.bestStars) || 0;
  const modelAudio = useSingletonAudio(ttsSrc(sentence?.text ?? ""));

  // Cleanup on unmount: stop TTS/recognition, release the recorded-audio blob.
  useEffect(
    () => () => {
      modelAudio.pause();
      recognitionRef.current?.abort();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // We don't play the child's own recording back — just used to grade it —
  // but still need to release the blob URL once we're done with it.
  function setRecordedAudio(url: string | null) {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = url;
  }

  function resetForSentence(nextIndex: number) {
    modelAudio.pause();
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
    recordAttempt(sentence.id, stars);
    if (stars === 3) setShowConfetti(true);
  }

  const handleRecordStart = () => {
    modelAudio.pause();
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
    const { ratio, words, spokenWords } = compareSentence(sentence.text, transcript);
    // starsFromRatio is deliberately forgiving (1 star for just speaking), but
    // that reads as a mixed signal alongside "Cô nghe không rõ" — so a
    // too-wrong attempt earns 0 stars instead, matching the message.
    const stars = ratio < TOO_WRONG_RATIO ? 0 : starsFromRatio(ratio, transcript.length > 0);
    setGrading(false);
    setResult({ stars, words, graded: true, transcript, spokenWords, ratio });
    saveAttempt(stars);
  };

  const handleSelfAssessDone = () => {
    saveAttempt(3);
    setResult({ stars: 3, words: [], graded: true });
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
    <div className="relative mx-auto max-w-3xl px-4 pb-6 pt-10 sm:px-6 sm:pt-12">
      {/* Mobile: no room to float the button outside the card, so it sits inline above. */}
      <div className="mb-5 sm:hidden">
        <Link
          to="/hoc-tap/luyen-noi"
          aria-label="Chọn chủ đề khác"
          className={[
            "grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-[1.15rem] shadow-bevel-neutral transition-[transform,box-shadow] ease-bounce active:translate-y-[2px] active:shadow-bevel-neutral-active",
            color.bgSoft,
            color.text,
          ].join(" ")}
        >
          <Undo2 className="h-5 w-5" strokeWidth={2.5} />
        </Link>
      </div>

      {/* sm+: floats to the left of the card, aligned with its top edge. */}
      <Link
        to="/hoc-tap/luyen-noi"
        aria-label="Chọn chủ đề khác"
        className={[
          "absolute left-0 top-10 hidden -translate-x-[calc(100%+0.75rem)] shrink-0 cursor-pointer place-items-center rounded-[1.15rem] shadow-bevel-neutral transition-[transform,box-shadow] ease-bounce active:translate-y-[2px] active:shadow-bevel-neutral-active sm:top-12 sm:grid sm:h-11 sm:w-11",
          color.bgSoft,
          color.text,
        ].join(" ")}
      >
        <Undo2 className="h-5 w-5" strokeWidth={2.5} />
      </Link>

      {/* Everything below lives in a single Duolingo-style bevel card. */}
      <div
        className={["overflow-hidden rounded-2xl border border-border bg-card", color.bevel].join(
          " ",
        )}
      >
        {/* Colored header strip */}
        <div className={["flex items-center gap-3 px-5 py-4 sm:px-8", color.bg].join(" ")}>
          <span className="text-3xl leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            {emoji}
          </span>
          <h1 className="font-display text-xl font-extrabold text-white drop-shadow-sm sm:text-2xl">
            {title}
          </h1>
        </div>

        <div className="relative p-5 sm:p-8">
          {/* Progress */}
          <div className="mb-1 h-2.5 w-full overflow-hidden rounded-full bg-stone-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]">
            <div
              className={[
                "h-full rounded-full transition-[width] duration-500 ease-out",
                color.gradient,
              ].join(" ")}
              style={{ width: `${((index + 1) / sentences.length) * 100}%` }}
            />
          </div>
          <p className="mb-5 text-xs font-bold text-muted-foreground">
            Câu {index + 1}/{sentences.length}
          </p>

          {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}

          {sentence?.imageUrl && (
            <img
              src={sentence.imageUrl}
              alt="Hình minh họa"
              className="mx-auto mb-5 max-h-52 rounded-xl object-contain ring-1 ring-border/60"
            />
          )}

          {/* When the attempt is too far off, a word-by-word diff just reads as a
            wall of red — encourage another try instead. */}
          {(() => {
            const tooWrong = showGraded && (result.ratio ?? 1) < TOO_WRONG_RATIO;
            const showDiff = showGraded && !tooWrong;
            return (
              <>
                {/* The sentence — after grading, wrong letters/tones get a red
                  squiggle right where they are, so the child sees exactly what
                  to fix. Skipped when the attempt was too far off to diff. */}
                <div className="mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-center">
                  {showDiff && result.words.length > 0 ? (
                    result.words.map((w, i) => (
                      <span
                        key={i}
                        className="rounded-lg px-1 py-0.5 font-display text-2xl font-extrabold sm:text-3xl"
                      >
                        {w.matched ? (
                          <span className="text-navy">{w.word}</span>
                        ) : w.chars ? (
                          w.chars.map((c, ci) => (
                            <span
                              key={ci}
                              className={
                                c.ok
                                  ? "text-navy"
                                  : "text-red-500 underline decoration-wavy decoration-2 underline-offset-4"
                              }
                            >
                              {c.char}
                            </span>
                          ))
                        ) : (
                          <span className="text-red-400 underline decoration-wavy decoration-2 underline-offset-4">
                            {w.word}
                          </span>
                        )}
                      </span>
                    ))
                  ) : (
                    <p className="font-display text-2xl font-extrabold leading-snug text-navy sm:text-3xl">
                      {sentence?.text}
                    </p>
                  )}

                  {/* Listen to the model pronunciation */}
                  {sentence && (
                    <>
                      <audio
                        ref={modelAudio.audioRef}
                        src={modelAudio.src}
                        preload="none"
                        onEnded={modelAudio.onEnded}
                        onPause={modelAudio.onPause}
                        onError={modelAudio.onError}
                      />
                      <button
                        onClick={modelAudio.play}
                        aria-label="Nghe cô đọc"
                        className={[
                          "inline-grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border-2 transition active:scale-90 hover:-translate-y-0.5",
                          color.bgSoft,
                          color.border,
                          color.text,
                        ].join(" ")}
                      >
                        <Volume2 className="h-5 w-5" strokeWidth={2.5} />
                      </button>
                    </>
                  )}
                </div>

                {/* Reserves the feedback row's height up front (even with nothing
                  in it yet) so the card doesn't grow/shrink once grading lands. */}
                <div className="mb-6 flex min-h-[2.25rem] items-center justify-center text-center sm:min-h-[2.5rem]">
                  {tooWrong ? (
                    <p className="font-display text-base font-extrabold text-amber-500 sm:text-lg">
                      Cô nghe không rõ, em thử lại nhé! 🌼
                    </p>
                  ) : (
                    showGraded &&
                    result.transcript && (
                      <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-muted px-4 py-2 text-base font-semibold text-muted-foreground sm:text-lg">
                        <span aria-hidden>🎧</span>
                        <span>
                          Con đã nói: “
                          {result.spokenWords && result.spokenWords.length > 0 ? (
                            result.spokenWords.map((w, i) => (
                              <span key={i}>
                                {i > 0 && " "}
                                <span
                                  className={[
                                    "font-display font-extrabold",
                                    w.extra
                                      ? "rounded bg-amber-100 text-amber-700"
                                      : "italic text-navy",
                                  ].join(" ")}
                                >
                                  {w.word}
                                </span>
                              </span>
                            ))
                          ) : (
                            <span className="font-display font-extrabold italic text-navy">
                              {result.transcript}
                            </span>
                          )}
                          ”
                        </span>
                      </div>
                    )
                  )}
                </div>
              </>
            );
          })()}

          {showGraded && !grading && (
            <div className="mb-6 flex justify-center">
              <StarRow stars={result.stars} />
            </div>
          )}

          {stage !== "review" && (
            <div className="mb-6 flex justify-center">
              <StarRow stars={bestStars} animated={false} loading={stage === "recording"} />
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
              {isReviewing && showSelfAssess && !grading && (
                <div className="flex w-full max-w-md flex-col items-center gap-4">
                  <button
                    onClick={handleSelfAssessDone}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-600 px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-sm transition hover:scale-105 active:scale-95"
                  >
                    😊 Giống rồi!
                  </button>
                </div>
              )}

              {/* Record button stays mounted (just disabled) while grading —
                unmounting it here left a blank gap that popped back in once
                grading finished. It also stays put after review, so the child
                can tap it again right away with no separate "try again" tap. */}
              <RecordButton
                onStart={handleRecordStart}
                onFinish={handleRecordFinish}
                onMicDenied={() => setMicDenied(true)}
                disabled={grading}
              />
            </div>
          )}

          {/* Bottom nav — lives inside the same card, separated by a divider */}
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
            <button
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className={[
                "inline-flex items-center gap-1.5 rounded-full border-2 border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-navy shadow-bevel-neutral transition-[transform,box-shadow] ease-bounce active:translate-y-[2px] active:shadow-bevel-neutral-active",
                index > 0 ? "hover:brightness-95" : "cursor-not-allowed opacity-40",
              ].join(" ")}
            >
              <ChevronLeft className="h-4 w-4" />
              Câu trước
            </button>

            <button
              onClick={() => goTo(index + 1)}
              disabled={index >= sentences.length - 1}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-white transition-[transform,box-shadow,filter] ease-bounce active:translate-y-[2px]",
                index < sentences.length - 1
                  ? [color.gradient, color.bevel, color.bevelActive, "hover:brightness-110"].join(
                      " ",
                    )
                  : "cursor-not-allowed bg-muted text-muted-foreground opacity-60",
              ].join(" ")}
            >
              Câu tiếp theo
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
