import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LAYOUT_COLUMN_PADDED } from "./column";

/**
 * The boxed site frame, rendered once by the root route.
 *
 * A full-width navbar sits on the tinted page shell; everything else — the
 * routed page and the footer — lives inside one centred card. Pages therefore
 * never declare their own width, their own `<main>`, or their own footer: they
 * are a stack of <Section>s and nothing more.
 *
 * On phones the card drops its gutter and corners and runs edge-to-edge, since
 * a 24px frame there is only lost reading width.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-page-shell">
      <Navbar />

      <div
        className={`${LAYOUT_COLUMN_PADDED} flex flex-1 flex-col pb-0 sm:pb-[var(--layout-gutter)] sm:pt-[var(--layout-gutter)]`}
      >
        {/* overflow-hidden is load-bearing: it is what clips a <Section>'s
          background band and the PageHeader to the card's rounded corners. */}
        <div className="flex flex-1 flex-col overflow-hidden bg-background sm:rounded-[var(--layout-radius)] sm:shadow-page-box sm:ring-1 sm:ring-border/60">
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
