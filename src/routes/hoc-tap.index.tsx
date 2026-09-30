import { createFileRoute } from "@tanstack/react-router";
import { HocTapHome } from "@/components/tabs/HocTapHome";
import { messagesFor } from "@/i18n";
import { pageTitle } from "@/i18n/head";

export const Route = createFileRoute("/hoc-tap/")({
  head: ({ match }) => {
    const { locale } = match.context;
    const m = messagesFor(locale).meta.hocTap;
    const title = pageTitle(locale, m.title);
    return {
      meta: [
        { title },
        { name: "description", content: m.description },
        { property: "og:title", content: title },
        { property: "og:description", content: m.description },
        { property: "og:url", content: "/hoc-tap" },
      ],
      links: [{ rel: "canonical", href: "/hoc-tap" }],
    };
  },
  component: HocTapHome,
});
