# Trường Tiếng Việt

## Database migrations

Schema changes are tracked as SQL files in `supabase/migrations/` and applied with the
Supabase CLI. The CLI is not installed globally — run it through `npx supabase`.

You need Docker running for anything that builds a shadow database (`db reset`, `db diff`,
`db pull`), and the project must be linked (`npx supabase link --project-ref <ref>`; the ref
lives in `supabase/config.toml`).

### How it works

Two things have to agree: the files in `supabase/migrations/`, and the `schema_migrations`
table on the remote database that records which of them have run. Check them side by side:

```bash
npx supabase migration list
```

Every row should have the same value in the `local` and `remote` columns. A row with one
side blank means the two have drifted apart — see *When they drift* below.

### Everyday change

```bash
npx supabase migration new add_something     # creates an empty timestamped file
# write your SQL in the new supabase/migrations/*.sql file
npx supabase db reset                        # rebuild the local db from scratch and test
npx supabase db push                         # apply to production
```

`db reset` drops the local database, replays every migration in order, then applies
`supabase/seed.sql`. Because it replays from zero it is the real test of whether your
migration works on a clean database — not just whether it happened to work on yours.

### Always scope to `--schema public`

Pass `--schema public` to `db pull` and `db diff`:

```bash
npx supabase db diff --linked --schema public
```

The database also holds a `payload` schema owned by the CMS, which manages its own
migrations. Without the flag the CLI captures those tables too and the two migration
systems start fighting over the same objects.

### Local seed data

`supabase/seed.sql` runs on `db reset` and only ever touches the local database — `db push`
never applies it. It creates a development login:

- **admin@email.com** / **123**, with the `staff` role so the impact dashboard is visible.

The password is trivial on purpose: this database is local and disposable. Don't reuse
these credentials anywhere hosted.

### When they drift

Drift means production has schema that no migration file accounts for — usually from
changes applied straight through the Supabase dashboard. `migration list` shows it as rows
where `local` and `remote` don't line up. `db push` cannot fix this; it would try to replay
migrations for objects that already exist.

The fix is to make production the starting point instead of fighting it:

1. Delete the stale files from `supabase/migrations/`. They stay in git history.
2. If production's history references a version you have no file for, recover the file with
   `npx supabase migration fetch --linked` — the SQL of every applied migration is stored in
   the history table, and this writes it back out to `supabase/migrations/`. If you'd rather
   discard that version than keep it, drop the record instead with
   `npx supabase migration repair --status reverted <version>` (this only edits the history
   table; it never changes the schema).
3. `npx supabase db pull --schema public` writes the difference between your remaining
   migrations and production as one new file, and records it as applied.
4. Confirm with `npx supabase db diff --linked --schema public` — it should print
   `No schema changes found`.

This is how the current baseline was produced, which is why `supabase/migrations/` starts
with one large snapshot file rather than the original per-feature migrations.

### Caveats

- `db reset` wipes the whole local database, including the CMS's `payload` schema and any
  content you seeded into it.
- Objects outside the `public` schema (storage bucket policies, for instance) are not
  covered by `--schema public`, so changes to them won't appear in migrations.
- `supabase/prod-snapshot/` and `supabase/.temp/` are gitignored. The first holds a dump of
  production data, the second holds CLI credentials. Don't commit either.
