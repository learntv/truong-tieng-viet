import { createFileRoute } from "@tanstack/react-router";
import { PageBanner } from "@/components/site/PageBanner";
import { termsContent } from "@/content/terms";
import { m } from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";

export const Route = createFileRoute("/dieu-khoan-su-dung")({
  head: () => ({
    meta: [
      { title: `${m.info_terms_title()} | Trường Tiếng Việt Của Em` },
      { name: "description", content: m.info_terms_meta_description() },
      { property: "og:title", content: `${m.info_terms_title()} | Trường Tiếng Việt Của Em` },
      { property: "og:description", content: m.info_terms_meta_description() },
      { property: "og:url", content: "/dieu-khoan-su-dung" },
    ],
    links: [{ rel: "canonical", href: "/dieu-khoan-su-dung" }],
  }),
  component: TermsOfService,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 font-display text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {children}
      </div>
    </section>
  );
}

function TermsOfService() {
  const { lastUpdated, intro, sections } = termsContent[getLocale()];
  return (
    <main className="">
      <PageBanner title={m.info_terms_title()} />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="mb-2 text-sm text-muted-foreground">
          {m.info_last_updated({ date: lastUpdated })}
        </p>
        <p className="mb-10 text-sm leading-relaxed text-muted-foreground sm:text-base">{intro}</p>

        {sections.map(({ title, body }) => (
          <Section key={title} title={title}>
            {body}
          </Section>
        ))}
      </div>
    </main>
  );
}
