import { createFileRoute } from "@tanstack/react-router";
import { Quyen2ComingSoon } from "@/components/tabs/LoTrinhTab";

export const Route = createFileRoute("/hoc-tap/quyen-2")({
  head: () => ({
    meta: [
      { title: "Quyển 2 (sắp ra mắt) — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Quyển 2 của Trường Tiếng Việt Của Em đang được xây dựng — nội dung nâng cao dành cho học sinh đã hoàn thành Quyển 1.",
      },
      { property: "og:title", content: "Quyển 2 (sắp ra mắt) — Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content: "Quyển 2 đang được xây dựng — nội dung tiếp nối sau khi hoàn thành Quyển 1.",
      },
      { property: "og:url", content: "/hoc-tap/quyen-2" },
    ],
    links: [{ rel: "canonical", href: "/hoc-tap/quyen-2" }],
  }),
  component: Quyen2ComingSoon,
});
