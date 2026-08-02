import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
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
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mb-4 text-6xl">🔍</div>
      <h1 className="mb-2 font-display text-2xl font-bold text-white">
        Không tìm thấy chủ đề
      </h1>
      <p className="mb-6 text-slate-200">Chủ đề này không tồn tại hoặc đã bị đổi.</p>
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
