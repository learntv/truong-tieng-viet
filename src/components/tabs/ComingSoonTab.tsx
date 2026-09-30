import { Star } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Mascot } from "@/components/Mascot";
import { useT } from "@/i18n";

export function ComingSoonTab() {
  const t = useT();
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <EmptyState
        icon={Star}
        illustration={<Mascot pose="peeking" size="lg" decorative />}
        title={t.comingSoon.title}
        description={t.comingSoon.description}
      />
    </section>
  );
}
