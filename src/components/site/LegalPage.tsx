import { PageBanner } from "@/components/site/PageBanner";
import { useLocale, useT, type Messages } from "@/i18n";
import { Rich } from "@/i18n/Rich";

type LegalDoc = Messages["pages"]["terms"];

const STRONG = "text-foreground";
const LINK = "font-semibold text-primary underline underline-offset-2";

/**
 * The terms and privacy pages: banner, last-updated line, intro, then numbered sections of
 * paragraphs and bullet lists, all in the visitor's language. `lastUpdated` is an ISO date.
 */
export function LegalPage({ doc, lastUpdated }: { doc: LegalDoc; lastUpdated: string }) {
  const t = useT();
  const { fmtDate } = useLocale();
  // UTC so the date-only string never shows as the previous day in the Americas.
  const date = fmtDate(lastUpdated, { dateStyle: "long", timeZone: "UTC" });

  return (
    <main className="">
      <PageBanner title={doc.title} />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="mb-4 text-sm text-muted-foreground">{t.pages.legal.lastUpdated(date)}</p>
        <p className="mb-10 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <Rich text={doc.intro} className={STRONG} linkClassName={LINK} />
        </p>

        {doc.sections.map((section) => (
          <section key={section.title} className="mb-10">
            <h2 className="mb-3 font-display text-xl font-bold text-foreground sm:text-2xl">
              {section.title}
            </h2>
            <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {section.blocks.map((block, i) =>
                "ul" in block ? (
                  <ul key={i} className="list-disc space-y-2 pl-5">
                    {block.ul.map((item) => (
                      <li key={item}>
                        <Rich text={item} className={STRONG} linkClassName={LINK} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p key={i}>
                    <Rich text={block.p} className={STRONG} linkClassName={LINK} />
                  </p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
