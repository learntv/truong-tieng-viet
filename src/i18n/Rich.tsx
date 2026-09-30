import { Fragment, type ReactNode } from "react";

// `**bold**` or `[label](href)`, whichever comes first.
const TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/**
 * Renders a catalog string with two bits of inline markup, so translated prose can keep its
 * emphasis and links without the catalogs holding JSX:
 *
 * - `**…**` becomes a <strong> (or a <span> with `as="span"`, where the original was a
 *   coloured span rather than bold text), styled with `className`.
 * - `[label](href)` becomes an <a>, styled with `linkClassName`. External (http) links open in a
 *   new tab.
 */
export function Rich({
  text,
  className,
  as: Tag = "strong",
  linkClassName,
}: {
  text: string;
  className?: string;
  as?: "strong" | "span";
  linkClassName?: string;
}) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const i = match.index;
    if (i > last) parts.push(<Fragment key={last}>{text.slice(last, i)}</Fragment>);
    const [whole, bold, label, href] = match;
    if (bold !== undefined) {
      parts.push(
        <Tag key={i} className={className}>
          {bold}
        </Tag>,
      );
    } else {
      const external = href.startsWith("http");
      parts.push(
        <a
          key={i}
          href={href}
          className={linkClassName}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          {label}
        </a>,
      );
    }
    last = i + whole.length;
  }
  if (last < text.length) parts.push(<Fragment key={last}>{text.slice(last)}</Fragment>);
  return <>{parts}</>;
}
