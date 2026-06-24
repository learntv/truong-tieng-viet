import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ComingSoonTab } from "@/components/tabs/ComingSoonTab";

export const Route = createFileRoute("/san-pham-cua-em")({
  head: () => ({
    meta: [
      { title: "Sản phẩm của em — Trường Tiếng Việt Của Em" },
      { name: "description", content: "Sản phẩm học tập của các em học sinh Trường Tiếng Việt Của Em." },
    ],
  }),
  component: SanPhamCuaEm,
});

function SanPhamCuaEm() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <ComingSoonTab />
      </main>
      <Footer />
    </div>
  );
}
