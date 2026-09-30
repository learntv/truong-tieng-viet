import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { LOCALES, localizePathname } from "@/i18n/config";
import { SITE_URL, TRANSLATED_PATHS, alternateLinks } from "@/i18n/seo";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const STATIC_ROUTES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/hoc-tap", changefreq: "weekly", priority: "0.9" },
  { path: "/hoc-tap/bang-chu-cai", changefreq: "monthly", priority: "0.8" },
  { path: "/hoc-tap/quyen-1", changefreq: "weekly", priority: "0.9" },
  { path: "/hoc-tap/quyen-2", changefreq: "weekly", priority: "0.9" },
  { path: "/hoc-tap/luyen-noi", changefreq: "weekly", priority: "0.9" },
  { path: "/hoc-tap/tap-viet", changefreq: "monthly", priority: "0.8" },
  { path: "/bang-xep-hang", changefreq: "daily", priority: "0.7" },
  { path: "/san-pham-cua-em", changefreq: "monthly", priority: "0.6" },
  { path: "/huong-dan-su-dung", changefreq: "monthly", priority: "0.6" },
  { path: "/cau-hoi-thuong-gap", changefreq: "monthly", priority: "0.6" },
  { path: "/lien-he", changefreq: "monthly", priority: "0.6" },
  { path: "/chinh-sach-bao-mat", changefreq: "yearly", priority: "0.4" },
  { path: "/dieu-khoan-su-dung", changefreq: "yearly", priority: "0.4" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // A translated page is listed once per language, each entry naming
        // all of its language versions.
        const urls = STATIC_ROUTES.flatMap((e) => {
          const translated = TRANSLATED_PATHS.includes(e.path);
          const alternates = translated
            ? alternateLinks(e.path).map(
                (l) =>
                  `    <xhtml:link rel="alternate" hreflang="${l.hrefLang}" href="${l.href}"/>`,
              )
            : [];
          const paths = translated
            ? LOCALES.map((locale) => localizePathname(e.path, locale))
            : [e.path];

          return paths.map((path) =>
            [
              `  <url>`,
              `    <loc>${SITE_URL}${path}</loc>`,
              ...alternates,
              e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          );
        });

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
