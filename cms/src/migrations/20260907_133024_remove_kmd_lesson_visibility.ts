import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Removes the `hienThi` visibility flag added in 20260907_120010_kmd_lesson_slug_visibility.
// Every KMD lesson with a slug is public now — there is no gate. `slug` and its unique index are
// untouched.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."bai_kmd" DROP COLUMN "hien_thi";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."bai_kmd" ADD COLUMN "hien_thi" boolean DEFAULT false;`)
}
