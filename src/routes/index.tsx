import { createFileRoute } from "@tanstack/react-router";
import { createTranslator } from "use-intl";
import { HomePage } from "@/components/home/HomePage";
import { CurtainOpening } from "@/components/CurtainOpening";
import { localizePathname } from "@/i18n/config";
import { alternateLinks } from "@/i18n/seo";

export const Route = createFileRoute("/")({
  head: ({ match }) => {
    const { locale, messages } = match.context;
    const t = createTranslator({ locale, messages, namespace: "meta" });
    const url = localizePathname("/", locale);
    return {
      meta: [
        { title: t("homeTitle") },
        { name: "description", content: t("homeDescription") },
        { property: "og:title", content: t("homeTitle") },
        { property: "og:description", content: t("homeOgDescription") },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }, ...alternateLinks("/")],
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
