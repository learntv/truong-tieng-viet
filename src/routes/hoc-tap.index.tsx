import { createFileRoute } from "@tanstack/react-router";
import { HocTapHome } from "@/components/tabs/HocTapHome";

export const Route = createFileRoute("/hoc-tap/")({
  head: () => ({
    meta: [
      { title: "Học tập — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content: "Chọn lộ trình học, bảng chữ cái hoặc luyện nói để bắt đầu học tiếng Việt cùng Trâu con.",
      },
      { property: "og:title", content: "Học tập — Trường Tiếng Việt Của Em" },
      { property: "og:description", content: "Chọn lộ trình học, bảng chữ cái hoặc luyện nói để bắt đầu học tiếng Việt cùng Trâu con." },
      { property: "og:url", content: "/hoc-tap" },
    ],
    links: [{ rel: "canonical", href: "/hoc-tap" }],
  }),
  component: HocTapHome,
});
