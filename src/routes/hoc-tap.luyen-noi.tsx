import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useLearningContent } from "@/hooks/useLearningContent";
import { Loader2, Mic, Star } from "lucide-react";
import { extractSpeakingSentences } from "@/lib/speech";
import { loadSpeakingProgress, type SpeakingProgress } from "@/lib/speaking-progress";
import { SPEAKING_TOPICS, staticTopicSentences } from "@/data/speaking-topics";
import { STAGE_COLORS } from "@/components/learning/StageCard";
import trauCon from "@/assets/trau-con.png";

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
      className="group rounded-3xl bg-white p-5 text-center ring-[3px] ring-white shadow-card transition-all ease-bounce hover:-translate-y-1 hover:shadow-soft active:scale-[0.98]"
    >
      <div className="mb-2 text-4xl transition-transform group-hover:scale-110">{card.emoji}</div>
      <p className="font-display text-base font-extrabold leading-tight text-navy">{card.label}</p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">{card.total} câu luyện nói</p>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={["h-full rounded-full", color.gradient].join(" ")}
          style={{ width: card.total > 0 ? `${(card.perfect / card.total) * 100}%` : "0%" }}
        />
      </div>
      <div className="mt-2 flex items-center justify-center gap-3 text-xs font-bold">
        <span className="inline-flex items-center gap-1 text-yellow-600">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          {card.perfect} tròn
        </span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Mic className="h-3.5 w-3.5" />
          {card.practiced} đã luyện
        </span>
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
  // Loaded once per visit — stats update when the child practice route is left.
  const [progress] = useState(loadSpeakingProgress);

  const staticCards = useMemo<TopicCardData[]>(
    () =>
      SPEAKING_TOPICS.map((topic, i) => {
        const sentences = staticTopicSentences(topic);
        return {
          id: topic.id,
          emoji: topic.emoji,
          label: topic.title,
          total: sentences.length,
          colorIndex: i,
          ...countStats(sentences, progress),
        };
      }),
    [progress],
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
        <img src={trauCon} alt="Trâu con đội nón lá" className="h-24 w-auto animate-bob" />
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {staticCards.map((card) => (
            <TopicCard key={card.id} card={card} />
          ))}
        </div>
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
          <p className="py-8 text-center text-sm font-semibold text-muted-foreground">
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
