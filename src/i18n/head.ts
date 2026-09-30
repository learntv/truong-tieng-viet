import { messagesFor, type Locale } from "./index";

/** "<page> | <site name>" in the given locale. */
export function pageTitle(locale: Locale, page: string): string {
  return `${page} | ${messagesFor(locale).site.name}`;
}

/** Site-wide title, description and social tags for the root route. */
export function siteMeta(locale: Locale) {
  const t = messagesFor(locale);
  return [
    { title: t.site.name },
    { name: "description", content: t.meta.rootDescription },
    { property: "og:title", content: t.site.name },
    { property: "og:description", content: t.meta.rootDescription },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: locale === "vi" ? "vi_VN" : "en_US" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: t.site.name },
    { name: "twitter:description", content: t.meta.rootDescription },
  ];
}
