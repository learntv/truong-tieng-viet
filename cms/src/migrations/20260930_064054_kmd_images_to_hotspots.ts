import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

import { randomBytes } from 'node:crypto'

// Turns every plain image in a KMD lesson (a Lexical `upload` node pointing at media) into an
// ImageHotspots block (blocks/ImageHotspots.ts) holding the same picture and no boxes yet, so
// boxes can be drawn on the lesson's existing images without uploading them again. The lesson
// editor no longer offers the plain upload node at all (see FreeText.ts), and a leftover one
// would have no toolbar entry to edit it by.
//
// A data-only migration: the lesson body is rich text stored as JSON in
// bai_kmd_blocks_free_text.content, so no column changes. Each node is replaced where it sits,
// inside a column included, keeping its alignment.

type Node = { [key: string]: unknown; children?: Node[] }

// The shape Payload gives a block's own `id` (24 hex characters, like the existing blocks').
const blockId = () => randomBytes(12).toString('hex')

const mediaId = (value: unknown): unknown =>
  value && typeof value === 'object' && 'id' in value ? (value as { id: unknown }).id : value

export const convert = (node: Node): { changed: number; node: Node } => {
  if (node.type === 'upload' && node.relationTo === 'media' && mediaId(node.value) != null) {
    return {
      changed: 1,
      node: {
        type: 'block',
        fields: {
          id: blockId(),
          image: mediaId(node.value),
          hotspots: [],
          blockName: '',
          blockType: 'imageHotspots',
        },
        format: node.format ?? '',
        version: 2,
      },
    }
  }

  if (!node.children) return { changed: 0, node }

  let changed = 0
  const children = node.children.map((child) => {
    const result = convert(child)
    changed += result.changed
    return result.node
  })
  return { changed, node: changed ? { ...node, children } : node }
}

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  const { rows } = await db.execute(
    sql`SELECT "id", "content" FROM "payload"."bai_kmd_blocks_free_text" WHERE "content" IS NOT NULL`,
  )

  let images = 0
  let sections = 0
  for (const row of rows as Array<{ content: { root: Node }; id: string }>) {
    const { changed, node: root } = convert(row.content.root)
    if (!changed) continue
    images += changed
    sections += 1
    await db.execute(sql`
      UPDATE "payload"."bai_kmd_blocks_free_text"
      SET "content" = ${JSON.stringify({ ...row.content, root })}::jsonb
      WHERE "id" = ${row.id}`)
  }

  payload.logger.info(`Converted ${images} image(s) in ${sections} KMD section(s) to ImageHotspots blocks.`)
}

// Deliberately a no-op. Turning the blocks back into plain images would throw away every box
// drawn on them since, and it couldn't tell a converted image from a block an editor inserted
// by hand. A picture shown either way looks the same to a student.
export async function down(_args: MigrateDownArgs): Promise<void> {}
