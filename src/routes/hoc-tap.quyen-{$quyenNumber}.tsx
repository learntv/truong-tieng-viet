import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { parseQuyenNumber } from "@/lib/learning";

// One route serves every quyển: the number in the URL picks which book's chủ đề are read out of
// the CMS. Quyển 2 is not a separate page — it is this page with `quyenNumber` = 2, so a book
// with no content yet still renders the same map with every landmark closed, and starts working
// the moment chủ đề are attached to it in the admin panel.
export const Route = createFileRoute("/hoc-tap/quyen-{$quyenNumber}")({
  // The roster is fixed (see QUYEN_NUMBERS); anything else is not a book, so send it back to
  // học tập rather than rendering an empty one.
  beforeLoad: ({ params }) => {
    if (parseQuyenNumber(params.quyenNumber) === null) {
      throw redirect({ to: "/hoc-tap", replace: true });
    }
  },
  head: ({ params }) => {
    const n = params.quyenNumber;
    const title = `Học Tiếng Việt Quyển ${n} — Trường Tiếng Việt Của Em`;
    const description = `Lộ trình học tiếng Việt Quyển ${n} qua các chủ đề dành cho trẻ em kiều bào.`;
    const url = `/hoc-tap/quyen-${n}`;
    return {
      meta: [
        { title: "Học Tiếng Việt — Trường Tiếng Việt Của Em" },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: Outlet,
});
