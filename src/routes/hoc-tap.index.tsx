import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/hoc-tap/")({
  beforeLoad: () => {
    throw redirect({ to: "/hoc-tap/lo-trinh" });
  },
});
