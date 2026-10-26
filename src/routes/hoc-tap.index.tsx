import { createFileRoute } from "@tanstack/react-router";
import { HocTapHome } from "@/components/tabs/HocTapHome";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/hoc-tap/")({
  // `sach=vui-hoc` opens the Vui Học Tiếng Việt book menu over the page.
  validateSearch: (search: Record<string, unknown>): { sach?: "vui-hoc" } => ({
    sach: search.sach === "vui-hoc" ? "vui-hoc" : undefined,
  }),
  head: () => ({
    meta: [
      { title: m.learn_meta_index_title() },
      { name: "description", content: m.learn_meta_index_description() },
      { property: "og:title", content: m.learn_meta_index_title() },
      { property: "og:description", content: m.learn_meta_index_description() },
      { property: "og:url", content: "/hoc-tap" },
    ],
    links: [{ rel: "canonical", href: "/hoc-tap" }],
  }),
  component: HocTapHome,
});
