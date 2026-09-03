import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."media" ALTER COLUMN "prefix" SET DEFAULT 'media';
  ALTER TABLE "payload"."users" ADD COLUMN "name" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."media" ALTER COLUMN "prefix" SET DEFAULT '';
  ALTER TABLE "payload"."users" DROP COLUMN "name";`)
}
