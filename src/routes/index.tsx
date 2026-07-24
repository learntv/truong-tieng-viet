import { createFileRoute } from "@tanstack/react-router";
import { InfoTab } from "@/components/tabs/InfoTab";
import { CurtainOpening } from "@/components/CurtainOpening";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trường Tiếng Việt Của Em — Học tiếng Việt vui nhộn" },
      {
        name: "description",
        content:
          "Hành trình học tiếng Việt vui nhộn dành cho trẻ em kiều bào 5–12 tuổi, dưới sự bảo trợ của UBNVONN – Bộ Ngoại giao.",
      },
      { property: "og:title", content: "Trường Tiếng Việt Của Em — Học tiếng Việt vui nhộn" },
      {
        property: "og:description",
        content:
          "Vui học Tiếng Việt cùng Trâu con đội nón lá — 8 chủ đề, 40 chặng học dành cho trẻ em kiều bào.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="">
      <CurtainOpening />
      <InfoTab />
    </main>
  );
}
