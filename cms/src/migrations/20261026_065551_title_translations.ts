import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// An optional English translation beside each translatable title (lib/translations.ts): speaking
// topics, chủ đề, nội dung and bài. New nullable columns only; the Vietnamese titles stay where
// they are.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."speaking_topics" ADD COLUMN "title_translations_en" varchar;
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais" ADD COLUMN "title_translations_en" varchar;
  ALTER TABLE "payload"."chu_de_changs_noi_dungs" ADD COLUMN "title_translations_en" varchar;
  ALTER TABLE "payload"."chu_de" ADD COLUMN "title_translations_en" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."speaking_topics" DROP COLUMN "title_translations_en";
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais" DROP COLUMN "title_translations_en";
  ALTER TABLE "payload"."chu_de_changs_noi_dungs" DROP COLUMN "title_translations_en";
  ALTER TABLE "payload"."chu_de" DROP COLUMN "title_translations_en";`)
}
