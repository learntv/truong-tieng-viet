import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonTab } from "@/components/tabs/ComingSoonTab";
import { PageBanner } from "@/components/site/PageBanner";
import { messagesFor, useT } from "@/i18n";
import { pageTitle } from "@/i18n/head";

export const Route = createFileRoute("/san-pham-cua-em")({
  head: ({ match }) => {
    const { locale } = match.context;
    const m = messagesFor(locale).meta.myCorner;
    const title = pageTitle(locale, m.title);
    return {
      meta: [
        { title },
        { name: "description", content: m.description },
        { property: "og:title", content: title },
        { property: "og:description", content: m.ogDescription },
        { property: "og:url", content: "/san-pham-cua-em" },
      ],
      links: [{ rel: "canonical", href: "/san-pham-cua-em" }],
    };
  },
  component: SanPhamCuaEm,
});

function SanPhamCuaEm() {
  const t = useT();
  return (
    <main className="">
      <PageBanner title={t.nav.myCorner} />
      <ComingSoonTab />
    </main>
  );
}
