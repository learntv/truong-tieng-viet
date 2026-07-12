import { createFileRoute } from "@tanstack/react-router";
import { Quyen1Roadmap } from "@/components/tabs/LoTrinhTab";

export const Route = createFileRoute("/hoc-tap/quyen-1")({
  head: () => ({
    meta: [
      { title: "Học Tiếng Việt — Trường Tiếng Việt Của Em" },
      { name: "description", content: "Lộ trình học tiếng Việt với 40 bài học qua 8 chủ đề dành cho trẻ em kiều bào." },
    ],
  }),
  component: Quyen1Roadmap,
});
