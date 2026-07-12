import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ErrorScreen } from "@/components/ErrorScreen";
import { isQuyen1Path } from "@/lib/learning";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // The Quyển 1 roadmap and its lesson pages are full-screen/immersive and manage their
    // own scroll position — the library's default restore-to-top fights that.
    scrollRestoration: ({ location }) => !isQuyen1Path(location.pathname),
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ErrorScreen,
  });

  return router;
};
