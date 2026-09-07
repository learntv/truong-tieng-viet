import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

/**
 * The shape `Lesson` needs from a KMD lesson document — structural, not imported from Payload's
 * generated types, so this package has no dependency on the CMS and the site never needs
 * `payload-types` at all. Payload's generated `BaiKmd` satisfies this without either side
 * importing the other (see the CMS's own type-level assertion that keeps the two from diverging).
 */
export type LessonSection = {
  id?: null | string;
  content?: null | SerializedEditorState;
};

export type LessonDoc = {
  title: string;
  amVan?: null | string[];
  blocks?: LessonSection[] | null;
};
