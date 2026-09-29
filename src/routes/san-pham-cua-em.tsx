import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonTab } from "@/components/tabs/ComingSoonTab";
import { Palette } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/san-pham-cua-em")({
  head: () => ({
    meta: [
      { title: "Sản phẩm của em — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content: "Sản phẩm học tập của các em học sinh Trường Tiếng Việt Của Em.",
      },
      { property: "og:title", content: "Sản phẩm của em — Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content:
          "Nơi trưng bày những bài làm và tác phẩm của các bạn nhỏ Trường Tiếng Việt Của Em.",
      },
      { property: "og:url", content: "/san-pham-cua-em" },
    ],
    links: [{ rel: "canonical", href: "/san-pham-cua-em" }],
  }),
  component: SanPhamCuaEm,
});

function SanPhamCuaEm() {
  return (
    <>
      <PageHeader
        icon={Palette}
        hue="grape"
        title="Sản phẩm của em"
        lede="Nơi trưng bày những bài làm và tác phẩm của các bạn nhỏ."
        width="content"
      />
      <ComingSoonTab />
    </>
  );
}
