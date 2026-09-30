import { Link, type LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Crumb = { label: string; to: LinkProps["to"] };

/**
 * The title block every sub-page opens with, as the first thing inside the
 * white page card: a pale bamboo-green rounded band holding a breadcrumb
 * trail and the page title, lit by a bamboo-stalk and a young-leaf circle,
 * with the text in deep bamboo green. Colours are the --bamboo-* tokens.
 *
 * The trail always starts at Trang chủ, then `parents`, then the current
 * page, named by `crumb` (defaults to the title).
 */
export function PageBanner({
  title,
  crumb,
  parents = [],
  art,
}: {
  title: string;
  /** This page's name in the breadcrumb, when the title reads differently. */
  crumb?: string;
  /** Pages between Trang chủ and this one. */
  parents?: Crumb[];
  /** Optional picture on the right of the band. */
  art?: ReactNode;
}) {
  const trail: Crumb[] = [{ label: "Trang chủ", to: "/" }, ...parents];

  return (
    <div className="px-4 pt-6 sm:px-8 sm:pt-8">
      {/* A fixed minimum height, so every banner matches the Học tập one whether
        or not it has art: art h-24 + py-6 on phones, h-36 + py-8 from sm. */}
      <div className="relative flex min-h-36 items-center gap-4 overflow-hidden rounded-[1.75rem] bg-bamboo-tint px-5 py-6 sm:min-h-52 sm:gap-8 sm:px-10 sm:py-8">
        {/* Two soft circles on the right, bamboo stalk and young leaf, for depth. */}
        <div aria-hidden="true" className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-bamboo-stalk/60 sm:h-56 sm:w-56" />
        <div aria-hidden="true" className="absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-bamboo-leaf/55 sm:right-40" />

        <div className="relative min-w-0 flex-1">
          <Breadcrumb>
            <BreadcrumbList className="text-bamboo-ink-soft">
              {trail.map((c) => (
                <BreadcrumbCrumb key={c.label} crumb={c} />
              ))}
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-bamboo-ink">{crumb ?? title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-bamboo-ink sm:text-4xl">{title}</h1>
        </div>

        {art}
      </div>
    </div>
  );
}

function BreadcrumbCrumb({ crumb }: { crumb: Crumb }) {
  return (
    <>
      <BreadcrumbItem>
        <BreadcrumbLink asChild className="font-semibold hover:text-bamboo-ink">
          <Link to={crumb.to}>{crumb.label}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
    </>
  );
}
