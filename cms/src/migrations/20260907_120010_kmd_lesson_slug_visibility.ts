import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

import { deriveSlug } from '@/lib/slug'

// Adds the two columns kmd-lessons/lesson-model needs (see BaiKMD.ts): `slug`, the lesson's
// public address, and `hien_thi`, the visibility flag. Additive — no existing column is touched.
//
// `slug` is backfilled before the NOT NULL + unique index are applied, using the same
// `deriveSlug` the `beforeValidate` hook uses on every future save, so an existing lesson gets
// exactly the slug it would get if re-saved today. `hien_thi` needs no backfill: its column
// default (`false`) already leaves every existing lesson invisible, which is deliberate — nothing
// becomes public by deploying this migration.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."bai_kmd" ADD COLUMN "slug" varchar;
  ALTER TABLE "payload"."bai_kmd" ADD COLUMN "hien_thi" boolean DEFAULT false;`)

  const { docs } = await payload.find({
    collection: 'bai-kmd',
    depth: 0,
    limit: 0,
    pagination: false,
    req,
  })

  const usedSlugs = new Set<string>()
  for (const doc of docs) {
    const base = deriveSlug(doc.title) || 'bai-hoc'
    let slug = base
    let suffix = 2
    while (usedSlugs.has(slug)) {
      slug = `${base}-${suffix}`
      suffix += 1
    }
    usedSlugs.add(slug)

    await db.execute(sql`
     UPDATE "payload"."bai_kmd" SET "slug" = ${slug} WHERE "id" = ${doc.id};`)
  }

  await db.execute(sql`
   ALTER TABLE "payload"."bai_kmd" ALTER COLUMN "slug" SET NOT NULL;
  CREATE UNIQUE INDEX "bai_kmd_slug_idx" ON "payload"."bai_kmd" USING btree ("slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "payload"."bai_kmd_slug_idx";
  ALTER TABLE "payload"."bai_kmd" DROP COLUMN "slug";
  ALTER TABLE "payload"."bai_kmd" DROP COLUMN "hien_thi";`)
}
