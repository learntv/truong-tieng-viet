import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ErrorScreen } from "@/components/ErrorScreen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // The learning routes (/hoc-tieng-viet/*) manage their own scroll position (collapsing
    // the map, gliding the connector into place) — the library's default restore-to-top
    // fights that and wins the race, producing a visible jump before our own scroll runs.
    scrollRestoration: ({ location }) => !location.pathname.startsWith("/hoc-tieng-viet"),
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ErrorScreen,
  });

  return router;
};
