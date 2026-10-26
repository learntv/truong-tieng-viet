import { createFileRoute } from "@tanstack/react-router";
import { PageBanner } from "@/components/site/PageBanner";
import { guideContent } from "@/content/guide";
import { m } from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";

export const Route = createFileRoute("/huong-dan-su-dung")({
  head: () => ({
    meta: [
      { title: `${m.info_guide_title()} | Trường Tiếng Việt Của Em` },
      { name: "description", content: m.info_guide_meta_description() },
      { property: "og:title", content: `${m.info_guide_title()} | Trường Tiếng Việt Của Em` },
      { property: "og:description", content: m.info_guide_og_description() },
      { property: "og:url", content: "/huong-dan-su-dung" },
    ],
    links: [{ rel: "canonical", href: "/huong-dan-su-dung" }],
  }),
  component: UserGuide,
});

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
  const { steps, help } = guideContent[getLocale()];
  return (
    <main>
      <PageBanner title={m.info_guide_title()} />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {steps.map(({ title, body }, i) => (
          <Step key={title} n={i + 1} title={title}>
            <p>{body}</p>
          </Step>
        ))}

        <div className="mt-10 rounded-2xl border border-border bg-muted/40 p-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {help}
        </div>
      </div>
    </main>
  );
}
