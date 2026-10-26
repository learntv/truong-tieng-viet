import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { parseQuyenNumber } from "@/lib/learning";
import { m } from "@/paraglide/messages";

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
    const title = m.learn_meta_quyen_title({ n });
    const description = m.learn_meta_quyen_description({ n });
    const url = `/hoc-tap/quyen-${n}`;
    return {
      meta: [
        { title: m.learn_meta_quyen_title_plain() },
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
