import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."chu_de_changs_noi_dungs_bais_texts" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."chu_de_changs_noi_dungs_bais_texts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais_texts" ADD CONSTRAINT "chu_de_changs_noi_dungs_bais_texts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."chu_de_changs_noi_dungs_bais"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "chu_de_changs_noi_dungs_bais_texts_order_idx" ON "payload"."chu_de_changs_noi_dungs_bais_texts" USING btree ("_order");
  CREATE INDEX "chu_de_changs_noi_dungs_bais_texts_parent_id_idx" ON "payload"."chu_de_changs_noi_dungs_bais_texts" USING btree ("_parent_id");`)
}
