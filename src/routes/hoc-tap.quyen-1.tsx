import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/hoc-tap/quyen-1")({
  head: () => ({
    meta: [
      { title: "Học Tiếng Việt — Trường Tiếng Việt Của Em" },
      { name: "description", content: "Lộ trình học tiếng Việt với 40 bài học qua 8 chủ đề dành cho trẻ em kiều bào." },
      { property: "og:title", content: "Học Tiếng Việt Quyển 1 — Trường Tiếng Việt Của Em" },
      { property: "og:description", content: "Lộ trình học tiếng Việt với 40 bài học qua 8 chủ đề dành cho trẻ em kiều bào." },
      { property: "og:url", content: "/hoc-tap/quyen-1" },
    ],
    links: [{ rel: "canonical", href: "/hoc-tap/quyen-1" }],
  }),
  component: Outlet,
});
