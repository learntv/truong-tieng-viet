import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { useEffect, useState, type ReactNode } from "react";
import { IntlProvider, createTranslator } from "use-intl";

import appCss from "../styles.css?url";
import iconUrl from "../assets/buffalo-icon.png";
import { ErrorScreen, NotFoundScreen } from "@/components/ErrorScreen";
import { useAuth } from "@/hooks/useAuth";
import { ProfileSetupModal } from "@/components/ProfileSetupModal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SkyPage } from "@/components/layout/SkyPage";
import { logCmsHealth } from "@/lib/cms-health";
import { DEFAULT_LOCALE, localeFromPathname } from "@/i18n/config";
import { loadMessages } from "@/i18n/messages";
import { SITE_URL } from "@/i18n/seo";

const OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/23fe28ec-8f13-4117-91d0-e728c468b1e1/id-preview-55843cf1--6f159385-7fe4-4d96-95b9-462c8529b5ee.lovable.app-1782308677073.png";

const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Trường Tiếng Việt Của Em",
      url: SITE_URL,
      description: "Hành trình học tiếng Việt vui nhộn dành cho trẻ em kiều bào.",
      image: OG_IMAGE,
      inLanguage: "vi",
    },
    {
      "@type": ["Organization", "EducationalOrganization"],
      name: "Trường Tiếng Việt Của Em",
      url: SITE_URL,
      logo: `${SITE_URL}${iconUrl}`,
      image: OG_IMAGE,
      description:
        "Nền tảng học tiếng Việt dành cho trẻ em Việt Nam ở trong và ngoài nước, dưới sự bảo trợ của UBNVONN – Bộ Ngoại giao.",
      inLanguage: "vi",
      sameAs: [SITE_URL],
    },
  ],
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // The language comes from the public URL ("/en/..."), which the router's
  // rewrite strips before matching. Its messages ride along in the route
  // context, so the server's copy is dehydrated with the page and the client
  // never refetches it on hydration.
  beforeLoad: async ({ location }) => {
    const locale = localeFromPathname(location.publicHref.split(/[?#]/)[0]);
    return { locale, messages: await loadMessages(locale) };
  },
  head: ({ match }) => {
    const t = createTranslator({
      locale: match.context.locale,
      messages: match.context.messages,
      namespace: "meta",
    });
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { title: t("siteTitle") },
        { name: "description", content: t("siteDescription") },
        { property: "og:title", content: t("siteTitle") },
        { property: "og:description", content: t("siteDescription") },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: t("siteTitle") },
        { name: "twitter:description", content: t("siteDescription") },
        {
          property: "og:image",
          content: OG_IMAGE,
        },
        {
          name: "twitter:image",
          content: OG_IMAGE,
        },
      ],
      links: [
        { rel: "icon", href: "/favicon.ico", sizes: "any" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap",
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: structuredData,
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundScreen,
  errorComponent: ErrorScreen,
});

function RootShell({ children }: { children: ReactNode }) {
  // The context is missing only if beforeLoad itself failed; the error screen
  // then renders in the default language.
  const context = Route.useRouteContext();
  const locale = context.locale ?? DEFAULT_LOCALE;

  return (
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body>
        <IntlProvider locale={locale} messages={context.messages}>
          {children}
        </IntlProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NewUserSetup() {
  const { user, isLoading } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (isLoading || !user || dismissed) return null;
  if (user.user_metadata?.profile_setup_completed) return null;

  return <ProfileSetupModal user={user} onComplete={() => setDismissed(true)} />;
}

const BARE_SKY_ROUTES = ["/dang-nhap", "/hoc-tap/khai-minh-duc/$slug", "/hoc-tap/tap-viet"];

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const matches = useRouterState({ select: (s) => s.matches });

  // Debug: one line in the console saying whether the CMS answered.
  useEffect(() => {
    logCmsHealth();
  }, []);

  const isFullScreen = matches.some((m) => m.routeId.includes("hoc-tap_"));
  const isHome = matches.some((m) => m.routeId === "/");
  const isDashboard = matches.some((m) => m.routeId === "/dashboard");
  // The sign-in page is one centred card, a Khai Minh Đức lesson is a slide
  // deck whose own pieces are already framed, and Tập viết is a notebook
  // page — all of them sit
  // straight on the sky rather than inside SkyPage's white card.
  const isBareSky = matches.some((m) => BARE_SKY_ROUTES.includes(m.routeId));

  return (
    <QueryClientProvider client={queryClient}>
      {isFullScreen || isHome || isDashboard ? (
        <>
          {!isFullScreen && <Navbar />}
          <Outlet />
          {!isFullScreen && <Footer />}
        </>
      ) : (
        <>
          <Navbar />
          <SkyPage card={!isBareSky}>
            <Outlet />
          </SkyPage>
          <Footer />
        </>
      )}
      <NewUserSetup />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
