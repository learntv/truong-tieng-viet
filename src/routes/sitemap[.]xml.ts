import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://truongtiengviet.cvcec.org";

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
        const urls = STATIC_ROUTES.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
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
