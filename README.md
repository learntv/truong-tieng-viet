# Trường Tiếng Việt

Two schemas share one Supabase database, each with its own migration system:

- `public` — the app's tables, migrated with the Supabase CLI from `supabase/migrations/`.
- `payload` — the CMS's tables, migrated by Payload from `cms/src/migrations/`.

They must stay separate. Always pass `--schema public` to Supabase CLI commands that read
the database (`db pull`, `db diff`), or the CLI captures the CMS's tables too and the two
systems start fighting over the same objects.

## App migrations (`public`)

The Supabase CLI isn't installed globally — run it via `npx supabase`. You need Docker for
anything that builds a shadow database (`db reset`, `db diff`, `db pull`), and the project
must be linked (`npx supabase link --project-ref <ref>`; the ref is in
`supabase/config.toml`).

```bash
npx supabase migration new add_something   # empty timestamped file
# write the SQL in supabase/migrations/*.sql
npx supabase db reset                      # replay from zero locally + apply seed.sql
npx supabase db push                       # apply to production
npx supabase migration list                # local vs remote history
```

`db reset` replays every migration on an empty database, so it's the real test of whether
yours works on a clean one — not just on yours. It also wipes the local `payload` schema.

### Local seed data

`supabase/seed.sql` runs on `db reset` and never on `db push`. It creates a dev login:
**admin@email.com** / **123**, with the `staff` role so the impact dashboard is visible.
The password is trivial because the database is local and disposable — don't reuse it
anywhere hosted.

### When they drift

Drift means production has schema no migration file accounts for, usually from changes made
in the Supabase dashboard. `migration list` shows it as rows where `local` and `remote`
don't line up. `db push` can't fix it — it would replay migrations for objects that already
exist. Make production the starting point instead:

1. Delete the stale files from `supabase/migrations/` (they stay in git history).
2. If production's history references a version you have no file for, recover it with
   `npx supabase migration fetch --linked`. To discard that version instead, drop the
   record with `npx supabase migration repair --status reverted <version>` — this edits
   only the history table, never the schema.
3. `npx supabase db pull --schema public` writes the remaining difference as one new file
   and marks it applied.
4. `npx supabase db diff --linked --schema public` should print `No schema changes found`.

That's how the current baseline was made, which is why `supabase/migrations/` starts with
one large snapshot rather than the original per-feature files.

## CMS migrations (`payload`)

Payload creates tables automatically in dev, but not in production. After any collection
change, create a migration and apply it by hand:

```bash
cd cms
bunx payload migrate:create
DATABASE_URL='<prod 5432 string>' PAYLOAD_SECRET='<prod secret>' bunx payload migrate
```

If a deployed `/admin` errors with `relation "payload.users" does not exist`, the
migrations haven't been applied — run the `migrate` line above.

### The production connection string

Use a **5432** connection. The transaction pooler on 6543 breaks `payload migrate`, which
runs DDL inside a transaction. 6543 is fine for the Vercel runtime env var.

```
# Direct — IPv6 only, unless you have the IPv4 add-on
postgresql://postgres:[PASSWORD]@db.<ref>.supabase.co:5432/postgres

# Session pooler — same semantics, IPv4-reachable. Note the postgres.<ref> username.
postgresql://postgres.<ref>:[PASSWORD]@aws-0-<region>.pooler.supabase.com:5432/postgres
```

Use the session pooler from WSL, which is IPv4-only. Copy the exact host and region from
the Supabase dashboard → Project Settings → Database rather than guessing. The database
password is separate from your Supabase account password; URL-encode it if it contains
`@`, `:`, `/`, or `#`.

## Caveats

- Objects outside `public` (storage bucket policies, for instance) aren't covered by
  `--schema public`, so changes to them never land in a migration.
- `supabase/prod-snapshot/` (production data dump) and `supabase/.temp/` (CLI credentials)
  are gitignored. Don't commit either.
