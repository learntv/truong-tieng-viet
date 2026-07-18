import { Star } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function ComingSoonTab() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <EmptyState
        icon={Star}
        title="Góc của em"
        description="Mục này đang được xây dựng và sẽ sớm ra mắt các bạn nhỏ nhé! 👧✏️📝🧸✈️"
      />
    </section>
  );
}
