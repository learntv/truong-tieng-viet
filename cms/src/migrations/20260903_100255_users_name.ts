import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// This migration carries a second statement beyond the users column it's named for:
// setting media.prefix's default to 'media'. That follows from the media collection's
// `prefix: MEDIA_PREFIX` in payload.config.ts's s3Storage setup — it's not a new change,
// just previously-unrecorded drift. It surfaces here rather than in its own migration
// because the generator diffs the config against this project's dev database, and that
// database's schema comes entirely from dev push, never from applying migrations; whatever
// config drifted ahead of the migration history shows up in the next migration generated,
// regardless of which field prompted the generator to run. Splitting it into its own
// migration would mean hand-authoring one that, like this one, can never be exercised here
// before it runs in production — a worse risk than one extra, well-documented statement.
// It's non-destructive: only a column default changes, no rows are touched. This file will
// be applied for the first time in production, having never run in development.
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
