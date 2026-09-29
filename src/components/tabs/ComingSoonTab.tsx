import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Mascot } from "@/components/Mascot";

export function ComingSoonTab() {
  return (
    <Container width="content" className="pb-20">
      <EmptyState
        icon={Sparkles}
        illustration={<Mascot pose="peeking" size="lg" decorative className="animate-bob" />}
        title="Góc của em đang được xây dựng"
        description="Mục này sẽ sớm ra mắt các bạn nhỏ nhé! Trong lúc chờ, em vào học một bài mới cùng Trâu con."
        action={
          <Button asChild>
            <Link to="/hoc-tap">Vào học tập</Link>
          </Button>
        }
      />
    </Container>
  );
}
