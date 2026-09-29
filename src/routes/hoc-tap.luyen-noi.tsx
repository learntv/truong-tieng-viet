import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { useMemo } from "react";
import { CloudOff, Mic, Star } from "lucide-react";
import { type SpeakingProgress } from "@/lib/speaking-progress";
import { useSpeakingContent } from "@/hooks/useSpeakingContent";
import { useSpeakingProgress } from "@/hooks/useSpeakingProgress";
import { BackLink } from "@/components/BackLink";
import { Mascot } from "@/components/Mascot";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/empty-state";
import { HUES, hueAt } from "@/lib/hues";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hoc-tap/luyen-noi")({
  head: () => ({
    meta: [
      { title: "Luyện nói — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content: "Luyện nói tiếng Việt cùng Trâu con: nghe mẫu, ghi âm và nhận sao khích lệ.",
      },
      { property: "og:title", content: "Luyện nói — Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content: "Luyện nói tiếng Việt cùng Trâu con: nghe mẫu, ghi âm và nhận sao khích lệ.",
      },
      { property: "og:url", content: "/hoc-tap/luyen-noi" },
    ],
    links: [{ rel: "canonical", href: "/hoc-tap/luyen-noi" }],
  }),
  component: LuyenNoiTab,
});

function LuyenNoiTab() {
  // This file is both the /hoc-tap/luyen-noi screen and the layout for
  // /hoc-tap/luyen-noi/$chuDeId; when a child route matched, render only the child.
  const hasChild = useChildMatches().length > 0;

  return hasChild ? <Outlet /> : <TopicPicker />;
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

/**
 * One topic: its emoji on the hue's wash, the name, how many sentences it
 * holds, and a two-part progress read — sentences practised, and sentences
 * that earned all three stars.
 */
function TopicCard({ card }: { card: TopicCardData }) {
  const h = HUES[hueAt(card.colorIndex + 6)];
  const pct = card.total > 0 ? Math.round((card.perfect / card.total) * 100) : 0;
  return (
    <Link
      to="/hoc-tap/luyen-noi/$chuDeId"
      params={{ chuDeId: card.id }}
      className="group flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-2.5 shadow-xs transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
    >
      <span className={cn("grid h-28 place-items-center rounded-2xl", h.wash)}>
        <span className="text-5xl leading-none transition-transform duration-300 ease-spring group-hover:scale-115 group-active:scale-95">
          {card.emoji}
        </span>
      </span>

      <span className="flex flex-1 flex-col px-2.5 pt-4 pb-2">
        <span className="text-h3 text-ink-900">{card.label}</span>
        <span className="mt-1 text-sm text-ink-500">{card.total} câu luyện nói</span>

        <span className="mt-auto pt-4">
          <span
            className="block h-2 overflow-hidden rounded-full bg-ink-100"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label="Số câu đạt ba sao"
          >
            <span
              className={cn("block h-full rounded-full", h.bright)}
              style={{ width: `${pct}%` }}
            />
          </span>
          <span className="mt-2.5 flex items-center gap-4 text-caption font-semibold">
            <span className="inline-flex items-center gap-1 text-sun-700">
              <Star className="size-3.5 fill-sun-500 text-sun-500" aria-hidden />
              {card.perfect} tròn sao
            </span>
            <span className="inline-flex items-center gap-1 text-ink-500">
              <Mic className="size-3.5" aria-hidden />
              {card.practiced} đã luyện
            </span>
          </span>
        </span>
      </span>
    </Link>
  );
}

function TopicPicker() {
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

  return (
    <>
      <PageHeader
        icon={Mic}
        hue="rose"
        title="Luyện nói cùng Trâu con"
        lede="Em chọn một chủ đề, nghe cô đọc mẫu rồi nói theo nhé. Nói hay sẽ được sao đấy!"
        back={<BackLink to="/hoc-tap" label="Học tập" />}
        aside={
          <Mascot
            pose="listening"
            size="lg"
            decorative
            className="hidden h-40 animate-float md:block"
          />
        }
      />

      <Container className="pb-16 sm:pb-24">
        <h2 className="mb-6 text-h2 text-ink-900">Chủ đề luyện nói</h2>

        {speakingContentLoading && (
          <ul
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            aria-busy="true"
            aria-label="Đang tải chủ đề"
          >
            {Array.from({ length: 4 }, (_, i) => (
              <li key={i} className="h-64 animate-pulse rounded-3xl bg-ink-50" />
            ))}
          </ul>
        )}
        {speakingContentError != null && !speakingContentLoading && (
          <EmptyState
            icon={CloudOff}
            title="Chưa tải được chủ đề luyện nói"
            description="Có thể mạng đang chập chờn. Em thử lại sau nhé!"
          />
        )}
        {!speakingContentLoading && !speakingContentError && (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {staticCards.map((card, i) => (
              <li key={card.id} className="animate-rise" style={{ animationDelay: `${i * 50}ms` }}>
                <TopicCard card={card} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
