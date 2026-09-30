import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { messagesFor, useT } from "@/i18n";
import { pageTitle } from "@/i18n/head";

export const Route = createFileRoute("/dieu-khoan-su-dung")({
  head: ({ match }) => {
    const { locale } = match.context;
    const m = messagesFor(locale).meta.terms;
    const title = pageTitle(locale, m.title);
    return {
      meta: [
        { title },
        { name: "description", content: m.description },
        { property: "og:title", content: title },
        { property: "og:description", content: m.description },
        { property: "og:url", content: "/dieu-khoan-su-dung" },
      ],
      links: [{ rel: "canonical", href: "/dieu-khoan-su-dung" }],
    };
  },
  component: TermsOfService,
});

const LAST_UPDATED = "2026-07-21";

function TermsOfService() {
  return <LegalPage doc={useT().pages.terms} lastUpdated={LAST_UPDATED} />;
}
