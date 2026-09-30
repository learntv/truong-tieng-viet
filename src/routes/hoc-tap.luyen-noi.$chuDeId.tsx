import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSpeakingContent } from "@/hooks/useSpeakingContent";
import { SpeakingPractice } from "@/components/speaking/SpeakingPractice";
import { PageBanner } from "@/components/site/PageBanner";
import { skyButton } from "@/components/ui/sky-button";
import { messagesFor, useT } from "@/i18n";
import { pageTitle } from "@/i18n/head";

export const Route = createFileRoute("/hoc-tap/luyen-noi/$chuDeId")({
  head: ({ params, match }) => {
    const { locale } = match.context;
    const m = messagesFor(locale).meta.speakingTopic;
    const title = pageTitle(locale, m.title(params.chuDeId));
    const description = m.description(params.chuDeId);
    const url = `/hoc-tap/luyen-noi/${params.chuDeId}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: SpeakingRoute,
});

function SpeakingRoute() {
  const t = useT();
  const { chuDeId } = Route.useParams();
  const { data: speakingTopics, isLoading: speakingContentLoading } = useSpeakingContent();

  if (speakingContentLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const staticIndex = speakingTopics?.findIndex((topic) => topic.id === chuDeId) ?? -1;
  if (staticIndex !== -1 && speakingTopics) {
    const staticTopic = speakingTopics[staticIndex];
    return (
      <SpeakingPractice
        title={staticTopic.title}
        emoji={staticTopic.emoji}
        sentences={staticTopic.sentences}
        colorIndex={staticIndex}
      />
    );
  }

  return (
    <div>
      <PageBanner
        title={t.speaking.topicNotFound}
        parents={[
          { label: t.hocTap.crumb, to: "/hoc-tap" },
          { label: t.speaking.title, to: "/hoc-tap/luyen-noi" },
        ]}
      />
      <div className="px-4 py-16 text-center">
        <p className="mb-6 text-sky-ink-soft">{t.speaking.topicNotFoundBody}</p>
        <Link to="/hoc-tap/luyen-noi" className={skyButton("primary")}>
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          {t.speaking.pickAnother}
        </Link>
      </div>
    </div>
  );
}
