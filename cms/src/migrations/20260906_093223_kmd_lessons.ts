import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."bai_kmd_blocks_free_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."bai_kmd" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."bai_kmd_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "payload"."media" ALTER COLUMN "prefix" SET DEFAULT 'media';
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "bai_kmd_id" integer;
  ALTER TABLE "payload"."bai_kmd_blocks_free_text" ADD CONSTRAINT "bai_kmd_blocks_free_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."bai_kmd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."bai_kmd_texts" ADD CONSTRAINT "bai_kmd_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."bai_kmd"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "bai_kmd_blocks_free_text_order_idx" ON "payload"."bai_kmd_blocks_free_text" USING btree ("_order");
  CREATE INDEX "bai_kmd_blocks_free_text_parent_id_idx" ON "payload"."bai_kmd_blocks_free_text" USING btree ("_parent_id");
  CREATE INDEX "bai_kmd_blocks_free_text_path_idx" ON "payload"."bai_kmd_blocks_free_text" USING btree ("_path");
  CREATE INDEX "bai_kmd__order_idx" ON "payload"."bai_kmd" USING btree ("_order");
  CREATE INDEX "bai_kmd_updated_at_idx" ON "payload"."bai_kmd" USING btree ("updated_at");
  CREATE INDEX "bai_kmd_created_at_idx" ON "payload"."bai_kmd" USING btree ("created_at");
  CREATE INDEX "bai_kmd_texts_order_parent" ON "payload"."bai_kmd_texts" USING btree ("order","parent_id");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bai_kmd_fk" FOREIGN KEY ("bai_kmd_id") REFERENCES "payload"."bai_kmd"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_bai_kmd_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("bai_kmd_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."bai_kmd_blocks_free_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."bai_kmd" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."bai_kmd_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."bai_kmd_blocks_free_text" CASCADE;
  DROP TABLE "payload"."bai_kmd" CASCADE;
  DROP TABLE "payload"."bai_kmd_texts" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_bai_kmd_fk";
  
  DROP INDEX "payload"."payload_locked_documents_rels_bai_kmd_id_idx";
  ALTER TABLE "payload"."media" ALTER COLUMN "prefix" SET DEFAULT '';
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "bai_kmd_id";`)
}
