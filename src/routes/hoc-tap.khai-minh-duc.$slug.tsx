import "@ttv/lesson-render/tokens.css";

import { createFileRoute, Link } from "@tanstack/react-router";
import { Lesson } from "@ttv/lesson-render";
import { SearchX } from "lucide-react";
import { useKmdLesson } from "@/hooks/useKmdLesson";
import { BackLink } from "@/components/BackLink";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/page-loader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/hoc-tap/khai-minh-duc/$slug")({
  head: ({ params }) => {
    const title = `Khai Minh Đức: ${params.slug} — Trường Tiếng Việt Của Em`;
    const description = "Học đánh vần cùng chương trình Khai Minh Đức, cùng Trâu con.";
    const url = `/hoc-tap/khai-minh-duc/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: KhaiMinhDucLessonRoute,
});

function KhaiMinhDucLessonRoute() {
  const { slug } = Route.useParams();
  const { data: lesson, isLoading, error } = useKmdLesson(slug);

  if (isLoading) {
    return <PageLoader label="Đang mở bài học" />;
  }

  if (error || !lesson) {
    return (
      <Container width="narrow" className="py-16">
        <EmptyState
          icon={SearchX}
          title="Bài học không có sẵn"
          description="Bài học này không tồn tại hoặc đã được đổi tên."
          action={
            <Button asChild>
              <Link to="/hoc-tap/khai-minh-duc">Xem danh sách bài học</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  return (
    <div className="bg-leaf-50/60 pb-16">
      <Container className="max-w-[90rem] pt-6 pb-4">
        <BackLink to="/hoc-tap/khai-minh-duc" label="Danh sách bài học" />
      </Container>
      <div className="mx-auto w-full max-w-[90rem]">
        <Lesson lesson={lesson} />
      </div>
    </div>
  );
}
