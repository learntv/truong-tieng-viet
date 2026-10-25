import { createFileRoute, Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import roundArrowBack from "@iconify-icons/ic/round-arrow-back";
import mdiLoading from "@iconify-icons/mdi/loading";
import { useSpeakingContent } from "@/hooks/useSpeakingContent";
import { SpeakingPractice } from "@/components/speaking/SpeakingPractice";
import { PageBanner } from "@/components/site/PageBanner";
import { skyButton } from "@/components/ui/sky-button";

export const Route = createFileRoute("/hoc-tap/luyen-noi/$chuDeId")({
  head: ({ params }) => {
    const title = `Luyện nói: ${params.chuDeId} | Trường Tiếng Việt Của Em`;
    const description = `Luyện nói tiếng Việt theo chủ đề "${params.chuDeId}": nghe câu mẫu, ghi âm và nhận sao khích lệ cùng Trâu con.`;
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
  const { chuDeId } = Route.useParams();
  const { data: speakingTopics, isLoading: speakingContentLoading } = useSpeakingContent();

  if (speakingContentLoading) {
    return (
      <div className="flex justify-center py-32">
        <Icon icon={mdiLoading} className="h-8 w-8 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  const staticIndex = speakingTopics?.findIndex((t) => t.id === chuDeId) ?? -1;
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
        title="Không tìm thấy chủ đề"
        parents={[
          { label: "Học tập", to: "/hoc-tap" },
          { label: "Luyện nói", to: "/hoc-tap/luyen-noi" },
        ]}
      />
      <div className="px-4 py-16 text-center">
        <p className="mb-6 text-sky-ink-soft">Chủ đề này không tồn tại hoặc đã bị đổi.</p>
        <Link to="/hoc-tap/luyen-noi" className={skyButton("primary")}>
          <Icon icon={roundArrowBack} className="h-4 w-4" aria-hidden />
          Chọn chủ đề khác
        </Link>
      </div>
    </div>
  );
}
