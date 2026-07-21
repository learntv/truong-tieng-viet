## Goal
Add a "Xóa tài khoản" (Delete account) option to the owner's account page (`/u/$username`) that permanently removes the user's Supabase auth record and their app data.

## Changes

### 1. New server function — `src/lib/account.functions.ts`
- `deleteOwnAccount` using `createServerFn({ method: "POST" })` + `.middleware([requireSupabaseAuth])`.
- Inside handler:
  - Load `supabaseAdmin` via dynamic import.
  - Delete rows owned by `context.userId` from app tables: `user_progress`, `profiles` (and any other user-scoped tables — will verify at build time via schema).
  - Delete storage avatar object if present (best-effort, ignore errors).
  - Call `supabaseAdmin.auth.admin.deleteUser(context.userId)`.
  - Return `{ ok: true }`.

### 2. Account page UI — `src/routes/u.$username.tsx` (OwnerView)
- Add a "Danger zone" section below the existing "Đăng xuất" button:
  - `AlertDialog` triggered by a destructive "Xóa tài khoản" button (Trash icon).
  - Confirmation copy in Vietnamese explaining data will be permanently deleted and cannot be undone.
  - Require typing "XÓA" in an input to enable the confirm button (guardrail against accidental clicks).
  - On confirm: call `deleteOwnAccount` via `useServerFn`, then `supabase.auth.signOut()`, clear query cache, `navigate({ to: "/", replace: true })`, and toast success.
  - Handle errors with a toast; keep dialog open on failure.

### 3. No schema/migration changes
Existing RLS + admin deletion covers this; no new tables or policies.

## Technical notes
- `supabaseAdmin` MUST be dynamically imported inside the handler (per project rules for `*.functions.ts`).
- The server fn is protected via `requireSupabaseAuth`; the caller can only delete their own account (uses `context.userId`, ignores any client-supplied id).
- Sign-out order after deletion: cancel queries → clear cache → `signOut()` → `navigate` (mirrors existing sign-out hygiene).
