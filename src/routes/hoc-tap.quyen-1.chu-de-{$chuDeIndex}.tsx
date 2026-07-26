import { createFileRoute, redirect } from "@tanstack/react-router";
import { QUYEN_1_CHU_DE_COUNT, learningStructureQueryOptions } from "@/lib/learning";
import { Quyen1Roadmap } from "@/components/tabs/LoTrinhTab";

export const Route = createFileRoute("/hoc-tap/quyen-1/chu-de-{$chuDeIndex}")({
  head: ({ params }) => {
    const title = `Chủ đề ${params.chuDeIndex} — Quyển 1 — Trường Tiếng Việt Của Em`;
    const description = `Lộ trình các chặng học của chủ đề ${params.chuDeIndex} trong Quyển 1: bài học, hình ảnh và bài tập cho trẻ em kiều bào.`;
    const url = `/hoc-tap/quyen-1/chu-de-${params.chuDeIndex}`;
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
  beforeLoad: ({ params }) => {
    const n = Number(params.chuDeIndex);
    if (!Number.isInteger(n) || n < 1 || n > QUYEN_1_CHU_DE_COUNT) {
      throw redirect({
        to: "/hoc-tap/quyen-1/chu-de-{$chuDeIndex}",
        params: { chuDeIndex: "1" },
        replace: true,
      });
    }
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(learningStructureQueryOptions),
  component: RouteComponent,
});

function RouteComponent() {
  const { chuDeIndex } = Route.useParams();
  return <Quyen1Roadmap chuDeIndex={Number(chuDeIndex) - 1} />;
}
