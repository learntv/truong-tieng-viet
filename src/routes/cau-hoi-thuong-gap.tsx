import { createFileRoute } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import roundAdd from "@iconify-icons/ic/round-add";
import { PageBanner } from "@/components/site/PageBanner";
import { faqContent } from "@/content/faq";
import { m } from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";

export const Route = createFileRoute("/cau-hoi-thuong-gap")({
  head: () => ({
    meta: [
      { title: `${m.info_faq_title()} | Trường Tiếng Việt Của Em` },
      { name: "description", content: m.info_faq_meta_description() },
      { property: "og:title", content: `${m.info_faq_title()} | Trường Tiếng Việt Của Em` },
      { property: "og:description", content: m.info_faq_og_description() },
      { property: "og:url", content: "/cau-hoi-thuong-gap" },
    ],
    links: [{ rel: "canonical", href: "/cau-hoi-thuong-gap" }],
  }),
  component: FAQ,
});

function FAQ() {
  return (
    <main>
      <PageBanner title={m.info_faq_title()} />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-4">
          {faqContent[getLocale()].map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl border border-border bg-card p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-foreground sm:text-lg">
                {q}
                <Icon
                  icon={roundAdd}
                  aria-hidden
                  className="h-6 w-6 shrink-0 text-primary transition-transform group-open:rotate-45"
                />
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
