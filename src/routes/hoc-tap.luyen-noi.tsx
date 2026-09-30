import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowRight, Loader2, Star } from "lucide-react";
import { type SpeakingProgress } from "@/lib/speaking-progress";
import { useSpeakingContent } from "@/hooks/useSpeakingContent";
import { useSpeakingProgress } from "@/hooks/useSpeakingProgress";
import { toneAt } from "@/components/learning/boxTones";
import { Mascot } from "@/components/Mascot";
import { PageBanner } from "@/components/site/PageBanner";
import { messagesFor, useT } from "@/i18n";
import { pageTitle } from "@/i18n/head";

export const Route = createFileRoute("/hoc-tap/luyen-noi")({
  head: ({ match }) => {
    const { locale } = match.context;
    const m = messagesFor(locale).meta.speaking;
    const title = pageTitle(locale, m.title);
    return {
      meta: [
        { title },
        { name: "description", content: m.description },
        { property: "og:title", content: title },
        { property: "og:description", content: m.description },
        { property: "og:url", content: "/hoc-tap/luyen-noi" },
      ],
      links: [{ rel: "canonical", href: "/hoc-tap/luyen-noi" }],
    };
  },
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
  perfect: number;
  index: number;
};

function countPerfect(sentences: { id: string }[], progress: SpeakingProgress): number {
  return sentences.filter((s) => progress[s.id]?.bestStars === 3).length;
}

function TopicPicker() {
  const t = useT();
  const {
    data: speakingTopics,
    isLoading: speakingContentLoading,
    error: speakingContentError,
  } = useSpeakingContent();
  const { progress } = useSpeakingProgress();

  const cards = useMemo<TopicCardData[]>(
    () =>
      (speakingTopics ?? []).map((topic, i) => ({
        id: topic.id,
        emoji: topic.emoji,
        label: topic.title,
        total: topic.sentences.length,
        perfect: countPerfect(topic.sentences, progress),
        index: i,
      })),
    [speakingTopics, progress],
  );

  return (
    <div>
      <PageBanner
        title={t.speaking.title}
        parents={[{ label: t.hocTap.crumb, to: "/hoc-tap" }]}
        art={<Mascot pose="listening" decorative className="relative h-24 sm:h-36" />}
      />

      <div className="relative mx-auto max-w-4xl px-4 pb-10 pt-8 sm:px-6">
        {speakingContentLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {speakingContentError != null && !speakingContentLoading && (
          <p className="py-16 text-center text-sm font-semibold text-muted-foreground">
            {t.speaking.loadFailed}
          </p>
        )}

        {!speakingContentLoading && !speakingContentError && (
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {cards.map((card) => (
              <li key={card.id}>
                <TopicCard card={card} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/**
 * One topic in the grid, built like a Khai Minh Đức lesson row: a white card
 * with the topic's emoji on a tone tile, the title and how many of its
 * sentences have three stars, and a round arrow button.
 */
function TopicCard({ card }: { card: TopicCardData }) {
  const tone = toneAt(card.index);
  const done = card.total > 0 ? card.perfect / card.total : 0;
  return (
    <Link
      to="/hoc-tap/luyen-noi/$chuDeId"
      params={{ chuDeId: card.id }}
      className="group flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-2.5 shadow-[0_2px_10px_rgba(15,23,42,0.05)] transition-shadow duration-150 hover:shadow-[0_6px_20px_rgba(15,23,42,0.09)] sm:gap-4"
    >
      <div
        className={[
          "grid aspect-square w-20 shrink-0 place-items-center rounded-xl sm:w-24",
          tone.light,
        ].join(" ")}
      >
        <span className="text-4xl leading-none transition-transform duration-200 group-hover:scale-110 sm:text-5xl">
          {card.emoji}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="font-display text-base font-bold leading-snug text-foreground">{card.label}</h2>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div className={["h-full rounded-full", tone.bar].join(" ")} style={{ width: `${done * 100}%` }} />
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-500" strokeWidth={1.5} />
            {card.perfect}/{card.total}
          </span>
        </div>
      </div>

      <span className="mr-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-green group-hover:text-white">
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </span>
    </Link>
  );
}
