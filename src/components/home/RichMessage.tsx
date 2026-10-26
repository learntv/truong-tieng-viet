import { Fragment, type ReactNode } from "react";
import type { MessagePart } from "@/paraglide/runtime";

type Tags = Record<string, (children: ReactNode) => ReactNode>;

/**
 * Renders a message that carries markup, like `{#b}…{/b}`, from its
 * `m.key.parts()`. The message decides where the emphasis falls, which moves
 * between languages; `tags` decides what each tag looks like here.
 */
export function RichMessage({ parts, tags }: { parts: MessagePart[]; tags: Tags }) {
  const stack: { name: string; children: ReactNode[] }[] = [{ name: "", children: [] }];
  const wrap = (name: string, children: ReactNode) => {
    const render = tags[name];
    return render ? render(children) : children;
  };

  parts.forEach((part, i) => {
    const top = stack[stack.length - 1].children;
    if (part.type === "text") top.push(part.value);
    else if (part.type === "markup-start") stack.push({ name: part.name, children: [] });
    else if (part.type === "markup-standalone")
      top.push(<Fragment key={i}>{wrap(part.name, null)}</Fragment>);
    else if (stack.length > 1) {
      const done = stack.pop()!;
      stack[stack.length - 1].children.push(
        <Fragment key={i}>{wrap(done.name, done.children)}</Fragment>,
      );
    }
  });

  // An unclosed tag still shows its text, just without the styling.
  return <>{stack.flatMap((level) => level.children)}</>;
}
