import { createFileRoute, redirect } from "@tanstack/react-router";
import { loadBuffaloPos } from "@/components/tabs/LearningTab";

// Bare "/hoc-tap/quyen-1" has no chủ đề of its own — bounce to the last-opened topic (if any
// was saved) so returning users land back where they were, or topic 1 for a fresh visit.
export const Route = createFileRoute("/hoc-tap/quyen-1/")({
  beforeLoad: () => {
    const saved = loadBuffaloPos();
    const chuDeIndex = saved && saved.chuDeIndex >= 0 ? saved.chuDeIndex + 1 : 1;
    throw redirect({
      to: "/hoc-tap/quyen-1/chu-de-{$chuDeIndex}",
      params: { chuDeIndex: String(chuDeIndex) },
      replace: true,
    });
  },
});
