import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// A KMD lesson's body becomes one embedded Canva design: the rich-text slides go, and so does
// their content. Existing lessons keep their title, slug and order but have no design yet, so
// the column is added with an empty-string default (a bare NOT NULL column can't be added to a
// table that has rows) and the default dropped straight after. The site shows those lessons as
// unavailable until an editor pastes a link, which the field's validation then requires.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."bai_kmd_blocks_free_text" CASCADE;
  ALTER TABLE "payload"."bai_kmd" ADD COLUMN "canva_url" varchar NOT NULL DEFAULT '';
  ALTER TABLE "payload"."bai_kmd" ALTER COLUMN "canva_url" DROP DEFAULT;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."bai_kmd_blocks_free_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  ALTER TABLE "payload"."bai_kmd_blocks_free_text" ADD CONSTRAINT "bai_kmd_blocks_free_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."bai_kmd"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "bai_kmd_blocks_free_text_order_idx" ON "payload"."bai_kmd_blocks_free_text" USING btree ("_order");
  CREATE INDEX "bai_kmd_blocks_free_text_parent_id_idx" ON "payload"."bai_kmd_blocks_free_text" USING btree ("_parent_id");
  CREATE INDEX "bai_kmd_blocks_free_text_path_idx" ON "payload"."bai_kmd_blocks_free_text" USING btree ("_path");
  ALTER TABLE "payload"."bai_kmd" DROP COLUMN "canva_url";`)
}
