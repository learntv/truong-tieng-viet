import { createFileRoute, redirect } from "@tanstack/react-router";
import { TOPICS } from "@/data/topics";
import { Quyen1Roadmap } from "@/components/tabs/LoTrinhTab";

export const Route = createFileRoute("/hoc-tap/quyen-1/chu-de-{$chuDeIndex}")({
  beforeLoad: ({ params }) => {
    const n = Number(params.chuDeIndex);
    if (!Number.isInteger(n) || n < 1 || n > TOPICS.length) {
      throw redirect({
        to: "/hoc-tap/quyen-1/chu-de-{$chuDeIndex}",
        params: { chuDeIndex: "1" },
        replace: true,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { chuDeIndex } = Route.useParams();
  return <Quyen1Roadmap chuDeIndex={Number(chuDeIndex) - 1} />;
}
