import { createFileRoute } from "@tanstack/react-router";
import { PageBanner } from "@/components/site/PageBanner";
import { messagesFor, useT } from "@/i18n";
import { pageTitle } from "@/i18n/head";
import { Rich } from "@/i18n/Rich";

export const Route = createFileRoute("/cau-hoi-thuong-gap")({
  head: ({ match }) => {
    const { locale } = match.context;
    const m = messagesFor(locale).meta.faq;
    const title = pageTitle(locale, m.title);
    return {
      meta: [
        { title },
        { name: "description", content: m.description },
        { property: "og:title", content: title },
        { property: "og:description", content: m.ogDescription },
        { property: "og:url", content: "/cau-hoi-thuong-gap" },
      ],
      links: [{ rel: "canonical", href: "/cau-hoi-thuong-gap" }],
    };
  },
  component: FAQ,
});

function FAQ() {
  const { faq } = useT().pages;
  return (
    <main>
      <PageBanner title={faq.title} />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-4">
          {faq.items.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl border border-border bg-card p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-foreground sm:text-lg">
                {q}
                <span className="shrink-0 text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                <Rich
                  text={a}
                  className="text-foreground"
                  linkClassName="font-semibold text-primary underline underline-offset-2"
                />
              </div>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
