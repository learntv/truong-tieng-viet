import { createFileRoute } from "@tanstack/react-router";
import { InfoTab } from "@/components/tabs/InfoTab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trường Tiếng Việt Của Em — Học tiếng Việt cùng Trâu con đội nón lá" },
      {
        name: "description",
        content:
          "Hành trình học tiếng Việt vui nhộn dành cho trẻ em kiều bào 5–12 tuổi, dưới sự bảo trợ của UBNVONN – Bộ Ngoại giao.",
      },
      { property: "og:title", content: "Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content:
          "Vui học Tiếng Việt cùng Trâu con đội nón lá — 8 chủ đề, 40 chặng học dành cho trẻ em kiều bào.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <InfoTab />
    </main>
  );
}
