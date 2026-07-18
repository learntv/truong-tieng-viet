import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { useMemo } from "react";
import { useLearningContent } from "@/hooks/useLearningContent";
import { Loader2, Mic, Star } from "lucide-react";
import { extractSpeakingSentences } from "@/lib/speech";
import { type SpeakingProgress } from "@/lib/speaking-progress";
import { useSpeakingContent } from "@/hooks/useSpeakingContent";
import { useSpeakingProgress } from "@/hooks/useSpeakingProgress";
import { STAGE_COLORS } from "@/components/learning/stageColors";
import { Mascot } from "@/components/Mascot";

export const Route = createFileRoute("/hoc-tap/luyen-noi")({
  head: () => ({
    meta: [
      { title: "Luyện nói — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content: "Luyện nói tiếng Việt cùng Trâu con: nghe mẫu, ghi âm và nhận sao khích lệ.",
      },
    ],
  }),
  component: LuyenNoiTab,
});

function LuyenNoiTab() {
  // This file is both the /hoc-tap/luyen-noi screen and the layout for
  // /hoc-tap/luyen-noi/$chuDeId; when a child route matched, render only the child.
  const hasChild = useChildMatches().length > 0;

  return (
    <main className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {hasChild ? <Outlet /> : <TopicPicker />}
    </main>
  );
}

type TopicCardData = {
  id: string;
  emoji: string;
  label: string;
  total: number;
  practiced: number;
  perfect: number;
  colorIndex: number;
};

function countStats(
  sentences: { id: string }[],
  progress: SpeakingProgress,
): { practiced: number; perfect: number } {
  return {
    practiced: sentences.filter((s) => (progress[s.id]?.attempts ?? 0) > 0).length,
    perfect: sentences.filter((s) => progress[s.id]?.bestStars === 3).length,
  };
}

function TopicCard({ card }: { card: TopicCardData }) {
  const color = STAGE_COLORS[card.colorIndex % STAGE_COLORS.length];
  return (
    <Link
      to="/hoc-tap/luyen-noi/$chuDeId"
      params={{ chuDeId: card.id }}
      className={[
        "group overflow-hidden rounded-2xl border-2 border-black/10 text-center",
        "transition-[transform,box-shadow,filter] duration-150 ease-bounce hover:brightness-110",
        "active:translate-y-[3px]",
        color.bg,
        color.bevel,
        color.bevelActive,
      ].join(" ")}
    >
      <div className="px-3 pb-2 pt-5">
        <div className="text-4xl leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-110 group-active:scale-95">
          {card.emoji}
        </div>
      </div>

      <div className="px-4 pb-4 pt-1">
        <p className="font-display text-base font-extrabold leading-tight text-white drop-shadow-sm">
          {card.label}
        </p>
        <p className="mt-1 text-xs font-semibold text-white/80">{card.total} câu luyện nói</p>

        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-black/15 shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: card.total > 0 ? `${(card.perfect / card.total) * 100}%` : "0%" }}
          />
        </div>
        <div className="mt-2 flex items-center justify-center gap-3 text-xs font-bold">
          <span className="inline-flex items-center gap-1 text-yellow-100">
            <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
            {card.perfect} tròn
          </span>
          <span className="inline-flex items-center gap-1 text-white/80">
            <Mic className="h-3.5 w-3.5" />
            {card.practiced} đã luyện
          </span>
        </div>
      </div>
    </Link>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-display text-lg font-extrabold text-navy sm:text-xl">{children}</h2>
  );
}

function TopicPicker() {
  const { data, isLoading, error } = useLearningContent();
  const {
    data: speakingTopics,
    isLoading: speakingContentLoading,
    error: speakingContentError,
  } = useSpeakingContent();
  const { progress } = useSpeakingProgress();

  const staticCards = useMemo<TopicCardData[]>(
    () =>
      (speakingTopics ?? []).map((topic, i) => ({
        id: topic.id,
        emoji: topic.emoji,
        label: topic.title,
        total: topic.sentences.length,
        colorIndex: i,
        ...countStats(topic.sentences, progress),
      })),
    [speakingTopics, progress],
  );

  const lessonCards = useMemo<TopicCardData[]>(
    () =>
      (data ?? [])
        .map((topic, i) => {
          const sentences = extractSpeakingSentences(topic);
          return {
            id: topic.chuDe.id,
            emoji: topic.chuDe.emoji,
            label: topic.chuDe.title.split(":")[1]?.trim() || topic.chuDe.title,
            total: sentences.length,
            colorIndex: i,
            ...countStats(sentences, progress),
          };
        })
        .filter((c) => c.total > 0),
    [data, progress],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Mascot pose="listening" size="md" bob decorative />
        <h1 className="font-display text-3xl font-extrabold text-navy">
          Luyện nói cùng Trâu con 🎤
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Em chọn một chủ đề, nghe cô đọc mẫu rồi nói theo nhé. Nói hay sẽ được sao đấy!
        </p>
      </div>

      {/* Curated topics */}
      <section className="mb-10">
        <SectionHeading>🎈 Chủ đề luyện nói</SectionHeading>
        {speakingContentLoading && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {speakingContentError != null && !speakingContentLoading && (
          <p className="py-8 text-center text-sm font-semibold text-slate-200">
            Chưa tải được chủ đề luyện nói — em thử lại sau nhé!
          </p>
        )}
        {!speakingContentLoading && !speakingContentError && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {staticCards.map((card) => (
              <TopicCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </section>

      {/* Topics derived from lesson content */}
      <section>
        <SectionHeading>📚 Luyện theo bài học của em</SectionHeading>
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {error != null && !isLoading && (
          <p className="py-8 text-center text-sm font-semibold text-slate-200">
            Chưa tải được bài học — em vẫn luyện được các chủ đề phía trên nhé!
          </p>
        )}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lessonCards.map((card) => (
              <TopicCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
