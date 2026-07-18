import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
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

  return router;
};
