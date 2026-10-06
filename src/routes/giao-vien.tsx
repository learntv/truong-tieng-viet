import { createFileRoute } from "@tanstack/react-router";
import { TeachersTab } from "@/components/tabs/TeachersTab";
import { PageBanner } from "@/components/site/PageBanner";

export const Route = createFileRoute("/giao-vien")({
  head: () => ({
    meta: [
      { title: "Giáo viên | Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content: "Đội ngũ giáo viên và cố vấn học thuật của Trường Tiếng Việt Của Em.",
      },
      { property: "og:title", content: "Giáo viên | Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content: "Gặp gỡ các thầy cô đồng hành cùng Trường Tiếng Việt Của Em.",
      },
      { property: "og:url", content: "/giao-vien" },
    ],
    links: [{ rel: "canonical", href: "/giao-vien" }],
  }),
  component: GiaoVien,
});

function GiaoVien() {
  return (
    <main className="">
      <PageBanner title="Đội ngũ giáo viên" />
      <TeachersTab />
    </main>
  );
}
