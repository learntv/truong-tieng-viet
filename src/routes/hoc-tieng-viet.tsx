import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LearningTab } from "@/components/tabs/LearningTab";

export const Route = createFileRoute("/hoc-tieng-viet")({
  head: () => ({
    meta: [
      { title: "Học Tiếng Việt — Trường Tiếng Việt Của Em" },
      { name: "description", content: "Lộ trình học tiếng Việt với 40 bài học qua 8 chủ đề dành cho trẻ em kiều bào." },
    ],
  }),
  component: HocTiengViet,
});

function HocTiengViet() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <LearningTab />
      </main>
      <Footer />
    </div>
  );
}
