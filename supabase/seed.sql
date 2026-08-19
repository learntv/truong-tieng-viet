-- Local development seed. Applied by `supabase db reset` against the local stack only —
-- it is never run by `supabase db push`, so this account cannot reach production.
--
-- Login: admin@email.com / 123456
--
-- The password is deliberately trivial because this database is local-only and is thrown
-- away on every reset. Do not copy these credentials into any hosted environment.
--
-- The uuid below is fixed so the account survives a reset with the same id — progress rows,
-- badges and anything else keyed on user_id stay valid across resets.

-- Password hashing lives in the extensions schema on Supabase, so the calls are qualified;
-- the default search_path does not always include it.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new
)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-4000-a000-000000000001',
  'authenticated',
  'authenticated',
  'admin@email.com',
  extensions.crypt('123456', extensions.gen_salt('bf')),
  now(),                                    -- pre-confirmed: no verification mail locally
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  now(),
  now(),
  -- GoTrue scans these into Go strings and NULL is not a valid string, so leaving them
  -- unset makes every login fail with "Database error querying schema". They have no
  -- column default, so the empty strings must be written explicitly.
  '', '', '', ''
)
on conflict (id) do nothing;

-- GoTrue resolves an email login through auth.identities, not auth.users alone; without
-- this row the sign-in fails even though the user exists.
insert into auth.identities (user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
values (
  '00000000-0000-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  'email',
  jsonb_build_object(
    'sub', '00000000-0000-4000-a000-000000000001',
    'email', 'admin@email.com',
    'email_verified', true
  ),
  now(),
  now(),
  now()
)
on conflict (provider, provider_id) do nothing;

-- public.profiles has no trigger off auth.users, so the row is created here. username and
-- display_name are NOT NULL; completed_count is filled in by init_profile_completed_count.
insert into public.profiles (id, username, display_name, avatar_emoji, country)
values ('00000000-0000-4000-a000-000000000001', 'admin', 'Quản trị viên', '🐣', 'VN')
on conflict (id) do nothing;

-- The staff role gates the impact dashboard, so the local admin can actually see it.
insert into public.user_roles (user_id, role)
values ('00000000-0000-4000-a000-000000000001', 'staff')
on conflict (user_id, role) do nothing;
