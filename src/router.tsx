import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";
import { ErrorScreen } from "@/components/ErrorScreen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Every route scrolls to the top on navigation (and back to where you were on "back").
    // Quyển 1 used to opt out of this because its roadmap was a full-screen map that managed
    // its own scroll; it's an ordinary scrolling list now, so opening a chặng from partway
    // down the list must land at the top of the lesson.
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ErrorScreen,
  });

  // Carries route-loader query data (e.g. leaderboard, learning structure) from the server's
  // queryClient into the client's on hydration, so pages don't briefly flash an empty/error
  // state while refetching data the SSR pass already had.
  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
};
