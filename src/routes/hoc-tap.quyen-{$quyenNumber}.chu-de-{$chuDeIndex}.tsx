import { createFileRoute, redirect } from "@tanstack/react-router";
import { chuDesOfQuyen, learningStructureQueryOptions, parseQuyenNumber } from "@/lib/learning";
import { QuyenRoadmap } from "@/components/tabs/LoTrinhTab";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/hoc-tap/quyen-{$quyenNumber}/chu-de-{$chuDeIndex}")({
  head: ({ params }) => {
    const vars = { topic: params.chuDeIndex, book: params.quyenNumber };
    const title = m.learn_meta_topic_title(vars);
    const description = m.learn_meta_topic_description(vars);
    const url = `/hoc-tap/quyen-${params.quyenNumber}/chu-de-${params.chuDeIndex}`;
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
  // How many chủ đề a quyển has is the CMS's answer, not a constant — an editor adding one in
  // the admin panel makes /chu-de-5 valid without a deploy. So the range check waits for the
  // lesson tree rather than running in `beforeLoad`. Out of range falls back to the first chủ
  // đề; when the quyển is still empty there is nothing to fall back to, so the roadmap renders
  // its own "sắp có" state instead of redirecting to itself forever.
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(learningStructureQueryOptions);
    const quyen = parseQuyenNumber(params.quyenNumber);
    if (!quyen) return data;
    const count = chuDesOfQuyen(data, quyen).length;
    const n = Number(params.chuDeIndex);
    if (count > 0 && (!Number.isInteger(n) || n < 1 || n > count)) {
      throw redirect({
        to: "/hoc-tap/quyen-{$quyenNumber}/chu-de-{$chuDeIndex}",
        params: { quyenNumber: params.quyenNumber, chuDeIndex: "1" },
        replace: true,
      });
    }
    return data;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { quyenNumber, chuDeIndex } = Route.useParams();
  const quyen = parseQuyenNumber(quyenNumber);
  if (!quyen) return null;
  return <QuyenRoadmap quyenNumber={quyen} chuDeIndex={Number(chuDeIndex) - 1} />;
}
