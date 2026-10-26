import { createFileRoute } from "@tanstack/react-router";
import { TeachersTab } from "@/components/tabs/TeachersTab";
import { PageBanner } from "@/components/site/PageBanner";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/giao-vien")({
  head: () => ({
    meta: [
      { title: m.home_teachers_meta_title() },
      { name: "description", content: m.home_teachers_meta_description() },
      { property: "og:title", content: m.home_teachers_meta_title() },
      { property: "og:description", content: m.home_teachers_og_description() },
      { property: "og:url", content: "/giao-vien" },
    ],
    links: [{ rel: "canonical", href: "/giao-vien" }],
  }),
  component: GiaoVien,
});

function GiaoVien() {
  return (
    <main className="">
      <PageBanner title={m.home_teachers_banner()} />
      <TeachersTab />
    </main>
  );
}
