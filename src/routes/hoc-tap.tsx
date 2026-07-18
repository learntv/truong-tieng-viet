import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/hoc-tap")({
  component: HocTapLayout,
});

function HocTapLayout() {
  return (
    <div className="relative min-h-screen bg-surface-subtle">
      <Outlet />
    </div>
  );
}
