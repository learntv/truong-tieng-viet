import { createFileRoute } from "@tanstack/react-router";
import { PageBanner } from "@/components/site/PageBanner";
import { messagesFor, useT } from "@/i18n";
import { pageTitle } from "@/i18n/head";
import { Rich } from "@/i18n/Rich";

export const Route = createFileRoute("/huong-dan-su-dung")({
  head: ({ match }) => {
    const { locale } = match.context;
    const m = messagesFor(locale).meta.guide;
    const title = pageTitle(locale, m.title);
    return {
      meta: [
        { title },
        { name: "description", content: m.description },
        { property: "og:title", content: title },
        { property: "og:description", content: m.ogDescription },
        { property: "og:url", content: "/huong-dan-su-dung" },
      ],
      links: [{ rel: "canonical", href: "/huong-dan-su-dung" }],
    };
  },
  component: UserGuide,
});

const LINK = "font-semibold text-primary underline underline-offset-2";

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 flex gap-4">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-display font-semibold text-white">
        {n}
      </div>
      <div>
        <h2 className="mb-2 font-display text-lg font-bold text-foreground sm:text-xl">{title}</h2>
        <div className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {children}
        </div>
      </div>
    </section>
  );
}

function UserGuide() {
  const { guide } = useT().pages;
  return (
    <main>
      <PageBanner title={guide.title} />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {guide.steps.map((step, i) => (
          <Step key={i} n={i + 1} title={step.title}>
            <p>
              <Rich text={step.body} className="text-foreground" linkClassName={LINK} />
            </p>
          </Step>
        ))}

        <div className="mt-10 rounded-2xl border border-border bg-muted/40 p-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <Rich text={guide.help} linkClassName={LINK} />
        </div>
      </div>
    </main>
  );
}
