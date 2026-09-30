import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { messagesFor, useT } from "@/i18n";
import { pageTitle } from "@/i18n/head";

export const Route = createFileRoute("/chinh-sach-bao-mat")({
  head: ({ match }) => {
    const { locale } = match.context;
    const m = messagesFor(locale).meta.privacy;
    const title = pageTitle(locale, m.title);
    return {
      meta: [
        { title },
        { name: "description", content: m.description },
        { property: "og:title", content: title },
        { property: "og:description", content: m.ogDescription },
        { property: "og:url", content: "/chinh-sach-bao-mat" },
      ],
      links: [{ rel: "canonical", href: "/chinh-sach-bao-mat" }],
    };
  },
  component: PrivacyPolicy,
});

const LAST_UPDATED = "2026-07-21";

function PrivacyPolicy() {
  return <LegalPage doc={useT().pages.privacy} lastUpdated={LAST_UPDATED} />;
}
