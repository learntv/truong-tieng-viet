import type { ReactNode } from "react";

/** Shared inline pieces for the long-form info pages (privacy, terms, FAQ,
    user guide), whose prose lives per locale under src/content/. */

export type ContentLocale = "vi" | "en";

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="text-foreground">{children}</strong>;
}

export function TextLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="font-semibold text-primary underline underline-offset-2"
    >
      {children}
    </a>
  );
}

export function Bullets({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5">{children}</ul>;
}

export type ProseSection = { title: string; body: ReactNode };

/** A legal page: an intro paragraph, then numbered sections. */
export type LegalDoc = {
  lastUpdated: string;
  intro: ReactNode;
  sections: ProseSection[];
};
