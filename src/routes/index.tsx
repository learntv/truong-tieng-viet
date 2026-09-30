import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home/HomePage";
import { CurtainOpening } from "@/components/CurtainOpening";
import { messagesFor } from "@/i18n";

export const Route = createFileRoute("/")({
  head: ({ match }) => {
    const t = messagesFor(match.context.locale);
    // The home page leads with the site name, the reverse of every other page's title.
    const title = `${t.site.name} | ${t.meta.home.tagline}`;
    return {
      meta: [
        { title },
        { name: "description", content: t.meta.home.description },
        { property: "og:title", content: title },
        { property: "og:description", content: t.meta.home.ogDescription },
        { property: "og:url", content: "/" },
      ],
      links: [{ rel: "canonical", href: "/" }],
    };
  },
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
