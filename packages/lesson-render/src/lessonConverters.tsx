import type { JSXConverterArgs, JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { SerializedElementNode } from "@payloadcms/richtext-lexical/lexical";

import React from "react";

import { TONES } from "./tones";
import { ToneMarkIcon } from "./ToneMarkIcon";

import styles from "./lessonContent.module.css";

/**
 * How a lesson's rich text becomes the page a student reads.
 *
 * Payload's default converters cover the ordinary nodes (paragraphs, headings, lists, links,
 * images) and the core already applies alignment and indent, so only what this editor adds on top
 * is written here: the colours the text-colour feature stores as an inline style, the column rows
 * (features/columns in the CMS), and the three lesson blocks. Between them these are the whole
 * difference between the stored JSON and a lesson slide.
 *
 * The blocks are drawn to match their admin editors (cms/src/components/admin/blocks/*) — same
 * greens in the đánh vần diagram, same chain of boxes, same flashcard — because the editor's
 * screen is the promise this page has to keep. Where the admin needed a form control (an input,
 * a select), this has the value itself.
 */

type Media = {
  alt?: null | string;
  height?: null | number;
  url?: null | string;
  width?: null | number;
};

// Only the properties the text-colour feature writes (cms/src/features/text-color) are honoured.
// Anything else that ends up in a node's `style` is ignored rather than passed through: this
// string is rendered as CSS on a public page, and it arrives from stored content.
const STYLE_PROPERTIES = ["color", "background-color"] as const;

const parseInlineStyle = (style: null | string | undefined): React.CSSProperties | undefined => {
  if (!style) return undefined;
  const parsed: Record<string, string> = {};
  for (const declaration of style.split(";")) {
    const [rawProperty, ...rest] = declaration.split(":");
    const property = rawProperty?.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (!property || !value) continue;
    if (!(STYLE_PROPERTIES as readonly string[]).includes(property)) continue;
    if (property === "background-color") parsed.backgroundColor = value;
    else parsed.color = value;
  }
  return Object.keys(parsed).length > 0 ? (parsed as React.CSSProperties) : undefined;
};

const asString = (value: unknown): string => (typeof value === "string" ? value : "");

const asMedia = (value: unknown): Media | null =>
  value && typeof value === "object" && "url" in value ? (value as Media) : null;

const isToneValue = (value: unknown): value is (typeof TONES)[number]["value"] =>
  TONES.some((tone) => tone.value === value);

/** The word/definition card — the flashcard from VocabularyCardBlock.tsx, minus its inputs. */
const VocabularyCard: React.FC<{ fields: Record<string, unknown> }> = ({ fields }) => {
  const image = asMedia(fields.image);
  const meaning = asString(fields.meaning);
  const example = asString(fields.example);

  return (
    <div className={styles.vocabularyCard}>
      {/* A plain <img>, not next/image: this package renders in both a Next app (the CMS
          preview, where next.config.ts allow-lists only local paths and R2 media would be
          refused outright) and a plain Vite app (the site) that has no next/image at all. */}
      {image?.url && (
        <img alt={image.alt ?? ""} className={styles.vocabularyImage} src={image.url} />
      )}
      <div className={styles.vocabularyText}>
        <span className={styles.vocabularyWord}>{asString(fields.word)}</span>
        {meaning && <span className={styles.vocabularyMeaning}>{meaning}</span>}
        {example && <span className={styles.vocabularyExample}>{example}</span>}
      </div>
    </div>
  );
};

/** âm đầu → vần → dấu thanh → tiếng, the chain of boxes from SyllableChainBlock.tsx. */
const SyllableChain: React.FC<{ fields: Record<string, unknown> }> = ({ fields }) => {
  const dauThanh = fields.dauThanh;

  const cells = [
    { content: asString(fields.amDau), key: "amDau" },
    { content: asString(fields.van), key: "van" },
    {
      // `ngang` (and anything unrecognised) draws no icon — an empty cell, dropped below like
      // any other, since ngang genuinely carries no mark.
      content: isToneValue(dauThanh) ? (
        <ToneMarkIcon className={styles.chainToneIcon} value={dauThanh} />
      ) : null,
      key: "dauThanh",
    },
    { content: asString(fields.tieng), key: "tieng" },
    // An empty âm đầu is a real case — a vần that stands alone as a tiếng ("ăn") — and the chain
    // reads correctly with the box simply absent rather than blank.
  ].filter((cell) => cell.content !== "" && cell.content !== null);

  return (
    <div className={styles.chain}>
      {cells.map((cell, index) => (
        <React.Fragment key={cell.key}>
          {index > 0 && (
            <span aria-hidden className={styles.chainArrow}>
              →
            </span>
          )}
          <span
            className={
              cell.key === "tieng"
                ? `${styles.chainCell} ${styles.chainResult}`
                : cell.key === "dauThanh"
                  ? `${styles.chainCell} ${styles.chainTone}`
                  : styles.chainCell
            }
          >
            {cell.content}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

/** The đánh vần diagram: the parts across the top, the whole syllable in the box below them. */
const SyllableBlend: React.FC<{ fields: Record<string, unknown> }> = ({ fields }) => {
  const parts = Array.isArray(fields.parts)
    ? (fields.parts as Array<Record<string, unknown>>).filter((part) => asString(part.text) !== "")
    : [];

  return (
    <div className={styles.blend}>
      <div className={styles.blendParts}>
        {parts.map((part, index) => (
          <span
            className={styles.blendPart}
            key={index}
            // Each part carries the colour the editor gave it — that is the whole point of the
            // diagram, so it is stored per part rather than themed here.
            style={{ color: asString(part.color) || undefined }}
          >
            {asString(part.text)}
          </span>
        ))}
      </div>
      <span className={styles.blendResult}>{asString(fields.result)}</span>
    </div>
  );
};

/** A block node's stored values. Typed off the node rather than off `payload-types` because the
 * converter map is keyed by block slug and hands every block the same loosely-typed node. */
const fieldsOf = ({ node }: JSXConverterArgs): Record<string, unknown> =>
  (node as { fields?: Record<string, unknown> }).fields ?? {};

const childrenOf = ({ node }: JSXConverterArgs): SerializedElementNode["children"] =>
  (node as unknown as SerializedElementNode).children ?? [];

export const lessonConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    syllableBlend: (args: JSXConverterArgs) => <SyllableBlend fields={fieldsOf(args)} />,
    syllableChain: (args: JSXConverterArgs) => <SyllableChain fields={fieldsOf(args)} />,
    vocabularyCard: (args: JSXConverterArgs) => <VocabularyCard fields={fieldsOf(args)} />,
  },
  // A column row and its columns are plain element nodes, so their children convert exactly as
  // they would on the page; only the wrappers are ours. The row divides itself evenly between
  // however many columns it holds (see lessonContent.module.css), same rule as the editor.
  column: (args: JSXConverterArgs) => (
    <div className={styles.column}>{args.nodesToJSX({ nodes: childrenOf(args) })}</div>
  ),
  columns: (args: JSXConverterArgs) => (
    <div className={styles.columns}>{args.nodesToJSX({ nodes: childrenOf(args) })}</div>
  ),
  // Colour is stored as an inline style on the text node itself (cms/src/features/text-color
  // explains why), and Payload's own text converter drops it — without this, every red âm in
  // every lesson renders black.
  text: (args: JSXConverterArgs) => {
    const base = defaultConverters.text;
    const rendered = typeof base === "function" ? base(args as never) : base;
    const style = parseInlineStyle((args.node as { style?: string }).style);
    return style ? <span style={style}>{rendered}</span> : rendered;
  },
});
