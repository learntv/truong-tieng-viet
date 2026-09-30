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

import appCss from "../styles.css?url";
import iconUrl from "../assets/buffalo-icon.png";
import { ErrorScreen, NotFoundScreen } from "@/components/ErrorScreen";
import { useAuth } from "@/hooks/useAuth";
import { ProfileSetupModal } from "@/components/ProfileSetupModal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LanguageWelcome } from "@/components/LanguageWelcome";
import { SkyPage } from "@/components/layout/SkyPage";
import { logCmsHealth } from "@/lib/cms-health";
import { I18nProvider } from "@/i18n";
import { getLocale } from "@/i18n/get-locale";
import { siteMeta } from "@/i18n/head";

const SITE_URL = "https://truongtiengviet.cvcec.org";
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
  // The interface language comes from the `locale` cookie, read here on the server and on the
  // client alike, so SSR already renders the right language. The HTML therefore varies by
  // cookie: if SSR responses are ever cached at the edge, the cache must honour `Vary: Cookie`
  // (or skip requests carrying a `locale` cookie), or visitors will get each other's language.
  beforeLoad: () => ({ locale: getLocale() }),
  head: ({ match }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      ...siteMeta(match.context.locale),
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
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundScreen,
  errorComponent: ErrorScreen,
});

function RootShell({ children }: { children: ReactNode }) {
  const locale = Route.useRouteContext({ select: (c) => c.locale });
  return (
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
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

const BARE_SKY_ROUTES = [
  "/dang-nhap",
  "/hoc-tap/khai-minh-duc/$slug",
  "/hoc-tap/tap-viet",
];

function RootComponent() {
  const { queryClient, locale } = Route.useRouteContext();
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
      <I18nProvider locale={locale}>
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
        <LanguageWelcome />
        <Toaster richColors position="top-center" />
      </I18nProvider>
    </QueryClientProvider>
  );
}
