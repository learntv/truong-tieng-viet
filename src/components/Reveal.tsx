import type { ReactNode, Ref } from "react";
import { useInView } from "@/hooks/useInView";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "article" | "header";
  id?: string;
};

export function Reveal({ children, className = "", delay = 0, as = "div", id }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  const Tag = as as "div";

  return (
    <Tag
      ref={ref as Ref<HTMLDivElement>}
      id={id}
      style={inView && delay ? { animationDelay: `${delay}ms` } : undefined}
      className={[
        className,
        inView
          ? "animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
          : "opacity-0",
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}
