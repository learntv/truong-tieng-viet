import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."quyen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."chu_de_changs_noi_dungs_bais_texts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."chu_de_changs_noi_dungs_bais_hinhs_captions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."chu_de_changs_noi_dungs_bais_hinhs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."chu_de_changs_noi_dungs_bais" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"meta_audio_url" varchar,
  	"meta_video_url" varchar,
  	"meta_link" varchar
  );
  
  CREATE TABLE "payload"."chu_de_changs_noi_dungs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."chu_de_changs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."chu_de" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"quyen_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload"."media" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "quyen_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "chu_de_id" integer;
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais_texts" ADD CONSTRAINT "chu_de_changs_noi_dungs_bais_texts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."chu_de_changs_noi_dungs_bais"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais_hinhs_captions" ADD CONSTRAINT "chu_de_changs_noi_dungs_bais_hinhs_captions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."chu_de_changs_noi_dungs_bais_hinhs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais_hinhs" ADD CONSTRAINT "chu_de_changs_noi_dungs_bais_hinhs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais_hinhs" ADD CONSTRAINT "chu_de_changs_noi_dungs_bais_hinhs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."chu_de_changs_noi_dungs_bais"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais" ADD CONSTRAINT "chu_de_changs_noi_dungs_bais_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."chu_de_changs_noi_dungs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."chu_de_changs_noi_dungs" ADD CONSTRAINT "chu_de_changs_noi_dungs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."chu_de_changs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."chu_de_changs" ADD CONSTRAINT "chu_de_changs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."chu_de"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."chu_de" ADD CONSTRAINT "chu_de_quyen_id_quyen_id_fk" FOREIGN KEY ("quyen_id") REFERENCES "payload"."quyen"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "quyen__order_idx" ON "payload"."quyen" USING btree ("_order");
  CREATE UNIQUE INDEX "quyen_slug_idx" ON "payload"."quyen" USING btree ("slug");
  CREATE INDEX "quyen_updated_at_idx" ON "payload"."quyen" USING btree ("updated_at");
  CREATE INDEX "quyen_created_at_idx" ON "payload"."quyen" USING btree ("created_at");
  CREATE INDEX "chu_de_changs_noi_dungs_bais_texts_order_idx" ON "payload"."chu_de_changs_noi_dungs_bais_texts" USING btree ("_order");
  CREATE INDEX "chu_de_changs_noi_dungs_bais_texts_parent_id_idx" ON "payload"."chu_de_changs_noi_dungs_bais_texts" USING btree ("_parent_id");
  CREATE INDEX "chu_de_changs_noi_dungs_bais_hinhs_captions_order_idx" ON "payload"."chu_de_changs_noi_dungs_bais_hinhs_captions" USING btree ("_order");
  CREATE INDEX "chu_de_changs_noi_dungs_bais_hinhs_captions_parent_id_idx" ON "payload"."chu_de_changs_noi_dungs_bais_hinhs_captions" USING btree ("_parent_id");
  CREATE INDEX "chu_de_changs_noi_dungs_bais_hinhs_order_idx" ON "payload"."chu_de_changs_noi_dungs_bais_hinhs" USING btree ("_order");
  CREATE INDEX "chu_de_changs_noi_dungs_bais_hinhs_parent_id_idx" ON "payload"."chu_de_changs_noi_dungs_bais_hinhs" USING btree ("_parent_id");
  CREATE INDEX "chu_de_changs_noi_dungs_bais_hinhs_image_idx" ON "payload"."chu_de_changs_noi_dungs_bais_hinhs" USING btree ("image_id");
  CREATE INDEX "chu_de_changs_noi_dungs_bais_order_idx" ON "payload"."chu_de_changs_noi_dungs_bais" USING btree ("_order");
  CREATE INDEX "chu_de_changs_noi_dungs_bais_parent_id_idx" ON "payload"."chu_de_changs_noi_dungs_bais" USING btree ("_parent_id");
  CREATE INDEX "chu_de_changs_noi_dungs_order_idx" ON "payload"."chu_de_changs_noi_dungs" USING btree ("_order");
  CREATE INDEX "chu_de_changs_noi_dungs_parent_id_idx" ON "payload"."chu_de_changs_noi_dungs" USING btree ("_parent_id");
  CREATE INDEX "chu_de_changs_order_idx" ON "payload"."chu_de_changs" USING btree ("_order");
  CREATE INDEX "chu_de_changs_parent_id_idx" ON "payload"."chu_de_changs" USING btree ("_parent_id");
  CREATE INDEX "chu_de__order_idx" ON "payload"."chu_de" USING btree ("_order");
  CREATE INDEX "chu_de_quyen_idx" ON "payload"."chu_de" USING btree ("quyen_id");
  CREATE INDEX "chu_de_updated_at_idx" ON "payload"."chu_de" USING btree ("updated_at");
  CREATE INDEX "chu_de_created_at_idx" ON "payload"."chu_de" USING btree ("created_at");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quyen_fk" FOREIGN KEY ("quyen_id") REFERENCES "payload"."quyen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chu_de_fk" FOREIGN KEY ("chu_de_id") REFERENCES "payload"."chu_de"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_quyen_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("quyen_id");
  CREATE INDEX "payload_locked_documents_rels_chu_de_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("chu_de_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."quyen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais_hinhs_captions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais_hinhs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."chu_de_changs_noi_dungs_bais" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."chu_de_changs_noi_dungs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."chu_de_changs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."chu_de" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."quyen" CASCADE;
  DROP TABLE "payload"."chu_de_changs_noi_dungs_bais_texts" CASCADE;
  DROP TABLE "payload"."chu_de_changs_noi_dungs_bais_hinhs_captions" CASCADE;
  DROP TABLE "payload"."chu_de_changs_noi_dungs_bais_hinhs" CASCADE;
  DROP TABLE "payload"."chu_de_changs_noi_dungs_bais" CASCADE;
  DROP TABLE "payload"."chu_de_changs_noi_dungs" CASCADE;
  DROP TABLE "payload"."chu_de_changs" CASCADE;
  DROP TABLE "payload"."chu_de" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_quyen_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_chu_de_fk";
  
  DROP INDEX "payload"."payload_locked_documents_rels_quyen_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_chu_de_id_idx";
  ALTER TABLE "payload"."media" DROP COLUMN "prefix";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "quyen_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "chu_de_id";`)
}
