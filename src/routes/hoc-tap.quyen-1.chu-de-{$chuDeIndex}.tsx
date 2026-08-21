import { createFileRoute, redirect } from "@tanstack/react-router";
import { learningStructureQueryOptions, quyen1ChuDes } from "@/lib/learning";
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
  // How many chủ đề Quyển 1 has is the CMS's answer, not a constant — an editor adding one in
  // the admin panel makes /chu-de-5 valid without a deploy. So the range check waits for the
  // lesson tree rather than running in `beforeLoad`. Out of range falls back to the first chủ
  // đề; when the tree is empty there is nothing to fall back to, so the roadmap renders its own
  // "no content" state instead of redirecting to itself forever.
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(learningStructureQueryOptions);
    const count = quyen1ChuDes(data).length;
    const n = Number(params.chuDeIndex);
    if (count > 0 && (!Number.isInteger(n) || n < 1 || n > count)) {
      throw redirect({
        to: "/hoc-tap/quyen-1/chu-de-{$chuDeIndex}",
        params: { chuDeIndex: "1" },
        replace: true,
      });
    }
    return data;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { chuDeIndex } = Route.useParams();
  return <Quyen1Roadmap chuDeIndex={Number(chuDeIndex) - 1} />;
}
