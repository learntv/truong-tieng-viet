import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** A titled block of long-form copy — the unit the policy and terms pages are
 *  built from. Its heading gets an id, so the contents rail can link to it. */
export function ProseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section id={slug(title)} className="scroll-mt-24">
      <h2 className="text-[1.375rem] leading-tight font-bold tracking-[-0.015em] text-ink-900">
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-4 [&_li]:pl-1 [&_li::marker]:text-brand-500 [&_strong]:font-semibold [&_strong]:text-ink-900 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

/**
 * Long-form reading: a ~70ch column of copy, and on desktop a sticky rail of
 * contents built from the page's own section headings, lighting the one in
 * view.
 */
export function ProseLayout({ intro, children }: { intro?: ReactNode; children: ReactNode }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<{ id: string; title: string }[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    // Every section up to and including a `data-toc-stop` marker (e.g. the start
    // of an English translation, which would otherwise list every title twice).
    const all = Array.from(body.querySelectorAll<HTMLElement>("section[id]"));
    const stop = all.findIndex((s) => s.hasAttribute("data-toc-stop"));
    const sections = stop === -1 ? all : all.slice(0, stop + 1);
    setToc(sections.map((s) => ({ id: s.id, title: s.querySelector("h2")?.textContent ?? "" })));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <Container className="grid gap-12 pb-20 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
      <nav aria-label="Mục lục" className="hidden lg:block">
        {toc.length > 0 && (
          <div className="sticky top-28">
            <p className="text-label text-ink-900">Mục lục</p>
            <ol className="mt-4 flex flex-col gap-1 border-l border-ink-100">
              {toc.map(({ id, title }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={cn(
                      "-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors",
                      active === id
                        ? "border-brand-600 font-semibold text-brand-700"
                        : "border-transparent text-ink-500 hover:text-ink-900",
                    )}
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </nav>

      <div
        ref={bodyRef}
        className="flex max-w-[68ch] flex-col gap-12 text-[1.0625rem] leading-[1.75] text-ink-700"
      >
        {intro && <div className="text-lede text-ink-700">{intro}</div>}
        {children}
      </div>
    </Container>
  );
}
