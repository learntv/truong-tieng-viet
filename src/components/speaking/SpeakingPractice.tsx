import { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Flower2,
  Headphones,
  MicOff,
  Smile,
  ThumbsUp,
  Volume2,
  X,
} from "lucide-react";
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
import { StarRow } from "@/components/learning/StarRow";
import { Mascot } from "@/components/Mascot";
import { useSingletonAudio } from "@/hooks/useSingletonAudio";
import { ttsSrc } from "@/lib/tts/text";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
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

const STAGE_TONES = ["stage-1", "stage-2", "stage-3", "stage-4", "stage-5"] as const;

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
      <Container width="narrow" className="py-16">
        <EmptyState
          icon={MicOff}
          title="Chủ đề này chưa có câu luyện"
          description="Em chọn chủ đề khác để luyện nói nhé!"
          action={
            <Button asChild>
              <Link to="/hoc-tap/luyen-noi">Chọn chủ đề khác</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  const isReviewing = stage === "review";
  const showSelfAssess = isReviewing && result != null && !result.graded;
  const showGraded = isReviewing && result != null && result.graded;
  const tooWrong = showGraded && (result.ratio ?? 1) < TOO_WRONG_RATIO;
  const showDiff = showGraded && !tooWrong;

  return (
    <div className={["relative flex-1 pb-12", color.bgSoft].join(" ")}>
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]"
      />

      <Container width="narrow" className="relative pt-6 sm:pt-8">
        {/* Top bar: the way out, the topic, and how far through it we are. */}
        <div className="flex items-center gap-3">
          <Link
            to="/hoc-tap/luyen-noi"
            aria-label="Chọn chủ đề khác"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-ink-100 bg-white text-ink-600 shadow-xs transition-colors hover:text-ink-900"
          >
            <X className="size-5" strokeWidth={2.5} />
          </Link>
          <div
            className="h-3 flex-1 overflow-hidden rounded-full bg-white shadow-[inset_0_1px_2px_rgb(20_28_49/0.08)]"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={sentences.length}
            aria-valuenow={index + 1}
            aria-label={`Câu ${index + 1} trên ${sentences.length}`}
          >
            <div
              className={[
                "h-full rounded-full transition-[width] duration-500 ease-out",
                color.gradient,
              ].join(" ")}
              style={{ width: `${((index + 1) / sentences.length) * 100}%` }}
            />
          </div>
          <span className="shrink-0 text-sm font-bold tabular-nums text-ink-700">
            {index + 1}/{sentences.length}
          </span>
        </div>

        <h1 className="mt-6 flex items-center gap-3 text-h2 text-ink-900">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-xs">
            {emoji}
          </span>
          {title}
        </h1>

        <div className="relative mt-6 rounded-[2rem] bg-white p-6 shadow-lg sm:p-10">
          {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}

          {sentence?.imageUrl && (
            <img
              src={sentence.imageUrl}
              alt="Hình minh họa"
              className="mx-auto mb-6 max-h-52 rounded-2xl object-contain"
            />
          )}

          {/* The sentence — after grading, wrong letters/tones get a red squiggle
            right where they are, so the child sees exactly what to fix. Skipped
            when the attempt was too far off to diff. */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-center">
            {showDiff && result.words.length > 0 ? (
              result.words.map((w, i) => (
                <span
                  key={i}
                  className="rounded-lg px-1 py-0.5 text-[1.75rem] font-bold sm:text-[2.125rem]"
                >
                  {w.matched ? (
                    <span className="text-ink-900">{w.word}</span>
                  ) : w.chars ? (
                    w.chars.map((c, ci) => (
                      <span
                        key={ci}
                        className={
                          c.ok
                            ? "text-ink-900"
                            : "text-danger-600 underline decoration-wavy decoration-2 underline-offset-4"
                        }
                      >
                        {c.char}
                      </span>
                    ))
                  ) : (
                    <span className="text-danger-600/80 underline decoration-wavy decoration-2 underline-offset-4">
                      {w.word}
                    </span>
                  )}
                </span>
              ))
            ) : (
              <p className="text-[1.75rem] leading-snug font-bold text-ink-900 sm:text-[2.125rem]">
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
                    "ml-1 inline-grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-90",
                    color.bg,
                    color.bevel,
                  ].join(" ")}
                >
                  <Volume2 className="size-5" strokeWidth={2.5} />
                </button>
              </>
            )}
          </div>

          {/* Reserves the feedback row's height up front so the card doesn't
            grow or shrink once grading lands. */}
          <div className="mt-5 flex min-h-11 items-center justify-center text-center">
            {tooWrong ? (
              <p className="inline-flex items-center gap-2 rounded-full bg-sun-50 px-4 py-2 font-semibold text-sun-700">
                <Flower2 className="size-5" aria-hidden />
                Cô nghe không rõ, em thử lại nhé!
              </p>
            ) : (
              showGraded &&
              result.transcript && (
                <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-ink-50 px-4 py-2 text-base font-medium text-ink-600">
                  <Headphones className="size-4 shrink-0" aria-hidden />
                  <span>
                    Con đã nói: “
                    {result.spokenWords && result.spokenWords.length > 0 ? (
                      result.spokenWords.map((w, i) => (
                        <span key={i}>
                          {i > 0 && " "}
                          <span
                            className={
                              w.extra
                                ? "rounded bg-sun-100 px-0.5 font-semibold text-sun-700"
                                : "font-semibold text-ink-900 italic"
                            }
                          >
                            {w.word}
                          </span>
                        </span>
                      ))
                    ) : (
                      <span className="font-semibold text-ink-900 italic">{result.transcript}</span>
                    )}
                    ”
                  </span>
                </div>
              )
            )}
          </div>

          {showGraded && !grading && (
            <div className="mt-4 flex justify-center">
              {/* Stars stay centred, with Trâu con hung off their left edge.
                He reacts to the attempt: never disappointed, just thoughtful
                when it did not land, so a miss stays encouraging. */}
              <div className="relative">
                <Mascot
                  className="absolute top-1/2 right-full mr-3 -translate-y-1/2"
                  pose={result.stars === 3 ? "cheer" : result.stars > 0 ? "thumbs-up" : "thinking"}
                  size="sm"
                  decorative
                />
                <StarRow stars={result.stars} />
              </div>
            </div>
          )}

          {stage !== "review" && (
            <div className="mt-4 flex justify-center">
              <StarRow stars={bestStars} animated={false} loading={stage === "recording"} />
            </div>
          )}

          {/* Record / review area */}
          <div className="mt-8">
            {!canRecord || micDenied ? (
              <div className="mx-auto max-w-sm rounded-3xl bg-sky-50 p-5 text-center">
                <p className="text-sm font-medium text-sky-700">
                  {micDenied
                    ? "Micro chưa được bật. Không sao — em nghe cô đọc rồi đọc to theo nhé!"
                    : "Thiết bị này chưa ghi âm được. Em nghe cô đọc rồi đọc to theo nhé!"}
                </p>
                <Button onClick={handleRepeatedAloud} className="mt-4">
                  <ThumbsUp aria-hidden />
                  Em đã đọc to theo cô!
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5">
                {isReviewing && showSelfAssess && !grading && (
                  <Button onClick={handleSelfAssessDone} tone="stage-1">
                    <Smile aria-hidden />
                    Giống rồi!
                  </Button>
                )}

                {/* Stays mounted (just disabled) while grading, and stays put after
                  review, so the child can tap it again right away. */}
                <RecordButton
                  onStart={handleRecordStart}
                  onFinish={handleRecordFinish}
                  onMicDenied={() => setMicDenied(true)}
                  disabled={grading}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
          >
            <ChevronLeft aria-hidden />
            Câu trước
          </Button>
          <Button
            size="lg"
            tone={STAGE_TONES[colorIndex % STAGE_TONES.length]}
            onClick={() => goTo(index + 1)}
            disabled={index >= sentences.length - 1}
          >
            Câu tiếp theo
            <ChevronRight aria-hidden />
          </Button>
        </div>
      </Container>
    </div>
  );
}
