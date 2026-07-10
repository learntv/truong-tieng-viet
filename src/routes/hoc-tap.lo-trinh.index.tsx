import { createFileRoute } from "@tanstack/react-router";
import { BookShelf } from "@/components/tabs/LoTrinhTab";

export const Route = createFileRoute("/hoc-tap/lo-trinh/")({
  component: BookShelf,
});
