import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/page-loader";
import { Button } from "@/components/ui/button";
import { useSpeakingContent } from "@/hooks/useSpeakingContent";
import { SpeakingPractice } from "@/components/speaking/SpeakingPractice";

export const Route = createFileRoute("/hoc-tap/luyen-noi/$chuDeId")({
  head: ({ params }) => {
    const title = `Luyện nói: ${params.chuDeId} — Trường Tiếng Việt Của Em`;
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
    return <PageLoader label="Đang mở chủ đề" />;
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
    <Container width="narrow" className="py-16">
      <EmptyState
        icon={SearchX}
        title="Không tìm thấy chủ đề"
        description="Chủ đề này không tồn tại hoặc đã bị đổi."
        action={
          <Button asChild>
            <Link to="/hoc-tap/luyen-noi">Chọn chủ đề khác</Link>
          </Button>
        }
      />
    </Container>
  );
}
