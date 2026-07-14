import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLearningContent } from "@/hooks/useLearningContent";
import { extractSpeakingSentences } from "@/lib/speech";
import { SPEAKING_TOPICS, staticTopicSentences } from "@/data/speaking-topics";
import { SpeakingPractice } from "@/components/speaking/SpeakingPractice";

export const Route = createFileRoute("/hoc-tap/luyen-noi/$chuDeId")({
  component: SpeakingRoute,
});

function SpeakingRoute() {
  const { chuDeId } = Route.useParams();
  const { data, isLoading, error } = useLearningContent();

  // Curated topics resolve without waiting for the curriculum query.
  const staticIndex = SPEAKING_TOPICS.findIndex((t) => t.id === chuDeId);
  if (staticIndex !== -1) {
    const staticTopic = SPEAKING_TOPICS[staticIndex];
    return (
      <SpeakingPractice
        title={staticTopic.title}
        emoji={staticTopic.emoji}
        sentences={staticTopicSentences(staticTopic)}
        colorIndex={staticIndex}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const topicIndex = data?.findIndex((t) => t.chuDe.id === chuDeId) ?? -1;
  if (error || !data || topicIndex === -1) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mb-4 text-6xl">🔍</div>
        <h1 className="mb-2 font-display text-2xl font-extrabold text-navy">
          Không tìm thấy chủ đề
        </h1>
        <p className="mb-6 text-muted-foreground">Chủ đề này không tồn tại hoặc đã bị đổi.</p>
        <Link
          to="/hoc-tap/luyen-noi"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-display font-extrabold text-white shadow-bevel-primary transition-[transform,box-shadow,filter] ease-bounce hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-105 active:translate-y-[3px] active:scale-100 active:shadow-bevel-primary-active"
        >
          <ArrowLeft className="h-4 w-4" />
          Chọn chủ đề khác
        </Link>
      </div>
    );
  }

  const topic = data[topicIndex];
  return (
    <SpeakingPractice
      title={topic.chuDe.title}
      emoji={topic.chuDe.emoji}
      sentences={extractSpeakingSentences(topic)}
      colorIndex={topicIndex}
    />
  );
}
