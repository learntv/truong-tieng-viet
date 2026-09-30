import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Removes the `amVan` (Âm/Vần) field from KMD lessons. It was the collection's only hasMany text
// field, so its whole backing table goes with it.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."bai_kmd_texts" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."bai_kmd_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "payload"."bai_kmd_texts" ADD CONSTRAINT "bai_kmd_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."bai_kmd"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "bai_kmd_texts_order_parent" ON "payload"."bai_kmd_texts" USING btree ("order","parent_id");`)
}
