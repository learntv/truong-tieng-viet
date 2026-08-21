import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais" DROP COLUMN "meta_audio_url";
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais" ADD COLUMN "meta_audio_id" integer;
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais" ADD CONSTRAINT "chu_de_changs_noi_dungs_bais_meta_audio_id_media_id_fk" FOREIGN KEY ("meta_audio_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "chu_de_changs_noi_dungs_bais_meta_meta_audio_idx" ON "payload"."chu_de_changs_noi_dungs_bais" USING btree ("meta_audio_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais" DROP CONSTRAINT "chu_de_changs_noi_dungs_bais_meta_audio_id_media_id_fk";

  DROP INDEX "payload"."chu_de_changs_noi_dungs_bais_meta_meta_audio_idx";
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais" DROP COLUMN "meta_audio_id";
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais" ADD COLUMN "meta_audio_url" varchar;`)
}
