import { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, ThumbsUp, Volume2 } from "lucide-react";
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
import { toneAt } from "@/components/learning/boxTones";
import { ConfettiBurst } from "@/components/learning/ConfettiBurst";
import { StarRow } from "@/components/learning/StarRow";
import { Mascot } from "@/components/Mascot";
import { PageBanner } from "@/components/site/PageBanner";
import { skyButton } from "@/components/ui/sky-button";
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

const NAV_DISABLED =
  "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:active:translate-y-0";

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
  // Same tone as this topic's tile on the Luyện nói list.
  const tone = toneAt(colorIndex);

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

  const banner = (
    <PageBanner
      title={title}
      parents={[
        { label: "Học tập", to: "/hoc-tap" },
        { label: "Luyện nói", to: "/hoc-tap/luyen-noi" },
      ]}
      art={
        <span aria-hidden="true" className="relative text-6xl leading-none sm:text-8xl">
          {emoji}
        </span>
      }
    />
  );

  if (sentences.length === 0) {
    return (
      <div>
        {banner}
        <div className="px-4 py-16 text-center">
          <p className="mb-6 font-display text-lg font-bold text-sky-ink">
            Chủ đề này chưa có câu luyện
          </p>
          <Link to="/hoc-tap/luyen-noi" className={skyButton("primary")}>
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Chọn chủ đề khác
          </Link>
        </div>
      </div>
    );
  }

  const isReviewing = stage === "review";
  const showSelfAssess = isReviewing && result != null && !result.graded;
  const showGraded = isReviewing && result != null && result.graded;

  return (
    <div>
      {banner}

      <div className="relative mx-auto max-w-2xl px-4 pb-10 pt-8 sm:px-6">
        {/* Progress */}
        <div className="mb-5 flex items-center gap-3">
          <span className="shrink-0 text-xs font-extrabold uppercase tracking-[0.08em] text-sky-ink-soft">
            Câu {index + 1}/{sentences.length}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={["h-full rounded-full transition-[width] duration-500 ease-out", tone.bar].join(" ")}
              style={{ width: `${((index + 1) / sentences.length) * 100}%` }}
            />
          </div>
        </div>

        {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}

        {/* When the attempt is too far off, a word-by-word diff just reads as a
          wall of red — encourage another try instead. */}
        {(() => {
          const tooWrong = showGraded && (result.ratio ?? 1) < TOO_WRONG_RATIO;
          const showDiff = showGraded && !tooWrong;
          return (
            <>
              {/* The sentence on the topic's tone. After grading, wrong
                letters/tones get a red squiggle right where they are, so the
                child sees exactly what to fix. Skipped when the attempt was
                too far off to diff. */}
              <div className={["rounded-[1.5rem] px-5 py-6 sm:px-8 sm:py-8", tone.light].join(" ")}>
                {sentence?.imageUrl && (
                  <img
                    src={sentence.imageUrl}
                    alt="Hình minh họa"
                    className="mx-auto mb-5 max-h-52 rounded-xl bg-white object-contain"
                  />
                )}

                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-center">
                  {showDiff && result.words.length > 0 ? (
                    result.words.map((w, i) => (
                      <span
                        key={i}
                        className="rounded-lg px-1 py-0.5 font-display text-2xl font-bold sm:text-3xl"
                      >
                        {w.matched ? (
                          <span className="text-sky-ink">{w.word}</span>
                        ) : w.chars ? (
                          w.chars.map((c, ci) => (
                            <span
                              key={ci}
                              className={
                                c.ok
                                  ? "text-sky-ink"
                                  : "text-destructive underline decoration-wavy decoration-2 underline-offset-4"
                              }
                            >
                              {c.char}
                            </span>
                          ))
                        ) : (
                          <span className="text-destructive/70 underline decoration-wavy decoration-2 underline-offset-4">
                            {w.word}
                          </span>
                        )}
                      </span>
                    ))
                  ) : (
                    <p className="font-display text-2xl font-bold leading-snug text-sky-ink sm:text-3xl">
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
                        className="ml-1 inline-grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full bg-white text-sky-ink shadow-btn transition-transform hover:scale-105 active:translate-y-[1px] active:shadow-btn-active"
                      >
                        <Volume2 className="h-5 w-5" strokeWidth={2.5} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Reserves the feedback row's height up front (even with nothing
                in it yet) so the page doesn't grow/shrink once grading lands. */}
              <div className="my-5 flex min-h-[2.25rem] items-center justify-center text-center sm:min-h-[2.5rem]">
                {tooWrong ? (
                  <p className="font-display text-base font-semibold text-amber-600 sm:text-lg">
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
                                  "font-display font-semibold",
                                  w.extra
                                    ? "rounded bg-amber-100 text-amber-700"
                                    : "italic text-sky-ink",
                                ].join(" ")}
                              >
                                {w.word}
                              </span>
                            </span>
                          ))
                        ) : (
                          <span className="font-display font-semibold italic text-sky-ink">
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
            {/* Stars stay centered — the same spot they occupy before grading —
              with Trâu con hung off their left edge so he does not push them
              off-centre. He reacts to the attempt: never disappointed, just
              thoughtful when it did not land, so a miss stays encouraging. */}
            <div className="relative">
              <Mascot
                className="absolute right-full top-1/2 mr-3 -translate-y-1/2"
                pose={result.stars === 3 ? "cheer" : result.stars > 0 ? "thumbs-up" : "thinking"}
                size="sm"
                decorative
              />
              <StarRow stars={result.stars} />
            </div>
          </div>
        )}

        {stage !== "review" && (
          <div className="mb-6 flex justify-center">
            <StarRow stars={bestStars} animated={false} loading={stage === "recording"} />
          </div>
        )}

        {/* Record / review area */}
        {!canRecord || micDenied ? (
          <div className="mx-auto max-w-sm rounded-2xl bg-box-white-deep p-4 text-center">
            <p className="text-sm font-semibold text-sky-ink">
              {micDenied
                ? "Micro chưa được bật. Không sao, em nghe cô đọc rồi đọc to theo nhé!"
                : "Thiết bị này chưa ghi âm được. Em nghe cô đọc rồi đọc to theo nhé!"}
            </p>
            <button onClick={handleRepeatedAloud} className={skyButton("primary", "mt-3")}>
              <ThumbsUp className="h-4 w-4" strokeWidth={2.5} />
              Em đã đọc to theo cô!
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            {isReviewing && showSelfAssess && !grading && (
              <button onClick={handleSelfAssessDone} className={skyButton("green")}>
                😊 Giống rồi!
              </button>
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

        {/* Bottom nav */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-sky-ink/15 pt-5">
          <button
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className={skyButton("white", ["ring-1 ring-sky-ink/10", NAV_DISABLED].join(" "))}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            Câu trước
          </button>

          <button
            onClick={() => goTo(index + 1)}
            disabled={index >= sentences.length - 1}
            className={skyButton("primary", NAV_DISABLED)}
          >
            Câu tiếp theo
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
