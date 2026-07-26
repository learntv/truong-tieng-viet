import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import iconUrl from "../assets/buffalo-icon.png";
import { ErrorScreen, NotFoundScreen } from "@/components/ErrorScreen";
import { useAuth } from "@/hooks/useAuth";
import { ProfileSetupModal } from "@/components/ProfileSetupModal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
      description:
        "Hành trình học tiếng Việt vui nhộn dành cho trẻ em kiều bào.",
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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content: "Hành trình học tiếng Việt vui nhộn dành cho trẻ em kiều bào.",
      },
      { property: "og:title", content: "Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content: "Hành trình học tiếng Việt vui nhộn dành cho trẻ em kiều bào.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Trường Tiếng Việt Của Em" },
      {
        name: "twitter:description",
        content: "Hành trình học tiếng Việt vui nhộn dành cho trẻ em kiều bào.",
      },
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
        href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Nunito:wght@400;600;700;800&display=swap",
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
  return (
    <html lang="vi">
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const matches = useRouterState({ select: (s) => s.matches });
  const isFullScreen = matches.some((m) => m.routeId.includes("hoc-tap_"));

  return (
    <QueryClientProvider client={queryClient}>
      {isFullScreen ? (
        <Outlet />
      ) : (
        <>
          <Navbar />
          <Outlet />
          <Footer />
        </>
      )}
      <NewUserSetup />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
