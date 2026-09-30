import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the user `role` (collections/Users.ts, lib/access.ts). Every account that exists today
// has been editing everything, so they all become admins: the column is added with 'admin' as
// its default (which fills the existing rows), then the default is switched to the narrower
// 'kmd' the config declares for accounts made from now on.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_users_role" AS ENUM('admin', 'kmd');
  ALTER TABLE "payload"."users" ADD COLUMN "role" "payload"."enum_users_role" DEFAULT 'admin' NOT NULL;
  ALTER TABLE "payload"."users" ALTER COLUMN "role" SET DEFAULT 'kmd';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."users" DROP COLUMN "role";
  DROP TYPE "payload"."enum_users_role";`)
}
