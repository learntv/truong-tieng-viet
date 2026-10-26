import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home/HomePage";
import { CurtainOpening } from "@/components/CurtainOpening";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: m.home_meta_title() },
      { name: "description", content: m.home_meta_description() },
      { property: "og:title", content: m.home_meta_title() },
      { property: "og:description", content: m.home_og_description() },
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
      <HomePage />
    </main>
  );
}
