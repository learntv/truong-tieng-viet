import { createFileRoute } from "@tanstack/react-router";
import { AlphabetTab } from "@/components/alphabet/AlphabetTab";

export const Route = createFileRoute("/hoc-tap/bang-chu-cai")({
  head: () => ({
    meta: [
      { title: "Bảng chữ cái — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Bé làm quen bảng chữ cái tiếng Việt qua khám phá, âm thanh và trò chơi vui nhộn — dành cho trẻ 3–6 tuổi.",
      },
    ],
  }),
  component: AlphabetTab,
});
