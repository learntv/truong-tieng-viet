import { createFileRoute } from "@tanstack/react-router";

// Avatar upload. Same content-addressed R2 pattern as api.tts.ts — hash the bytes, PUT under
// `avatars/<hash>.<ext>`, hand back the public URL for the caller to store on the profile.
// Unlike TTS this endpoint writes user-supplied bytes to a public bucket, so it requires a
// valid Supabase access token and caps both the size and the accepted content types.
//
// Both handlers also retire the caller's previous avatar object: the bucket is public and
// R2 serves objects forever, so an avatar the user has "replaced" would otherwise stay
// fetchable at its old URL indefinitely.
const MAX_BYTES = 2 * 1024 * 1024;

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

type Env = { publicBaseUrl: string; supabaseUrl: string; supabaseKey: string };

function readEnv(): Env | null {
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!publicBaseUrl || !supabaseUrl || !supabaseKey) {
    console.error("[api/avatar] Missing R2_PUBLIC_BASE_URL or Supabase environment variable(s).");
    return null;
  }
  return { publicBaseUrl, supabaseUrl, supabaseKey };
}

// Hitting the auth REST endpoint directly rather than going through a Supabase client: this
// only needs to answer "is this caller's own token valid", which the publishable key can do —
// no service-role client (and no SUPABASE_SERVICE_ROLE_KEY) required.
async function authenticate(request: Request, env: Env): Promise<string | null> {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return null;

  const res = await fetch(`${env.supabaseUrl}/auth/v1/user`, {
    headers: { apikey: env.supabaseKey, authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;

  const user = (await res.json()) as { id?: string };
  return user.id ?? null;
}

async function queryProfiles(env: Env, token: string, query: string): Promise<unknown[]> {
  const res = await fetch(`${env.supabaseUrl}/rest/v1/profiles?${query}`, {
    headers: { apikey: env.supabaseKey, authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`profiles query failed (${res.status}): ${await res.text()}`);
  return (await res.json()) as unknown[];
}

// Deletes the caller's current avatar object, unless it's the one they're switching TO, or
// another profile points at the same object. That second check matters specifically because
// keys are content-hashed: two users who upload byte-identical images share a single object,
// so deleting on behalf of one would break the other's avatar.
async function retirePreviousAvatar(
  env: Env,
  token: string,
  userId: string,
  keepKey: string | null,
) {
  const prefix = `${env.publicBaseUrl}/`;
  const rows = (await queryProfiles(
    env,
    token,
    `id=eq.${userId}&select=avatar_url`,
  )) as Array<{ avatar_url: string | null }>;

  const previousUrl = rows[0]?.avatar_url;
  if (!previousUrl || !previousUrl.startsWith(`${prefix}avatars/`)) return;

  const previousKey = previousUrl.slice(prefix.length);
  if (previousKey === keepKey) return;

  const sharers = (await queryProfiles(
    env,
    token,
    `avatar_url=eq.${encodeURIComponent(previousUrl)}&select=id`,
  )) as Array<{ id: string }>;
  if (sharers.some((row) => row.id !== userId)) return;

  const { deleteObject } = await import("@/lib/tts/r2.server");
  await deleteObject(previousKey);
}

export const Route = createFileRoute("/api/avatar")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const env = readEnv();
        if (!env) return new Response("Avatar upload not configured", { status: 502 });

        const token = (request.headers.get("authorization") ?? "").replace("Bearer ", "");
        const userId = await authenticate(request, env);
        if (!userId) return new Response("Unauthorized", { status: 401 });

        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File)) {
          return new Response("Missing 'file' form field", { status: 400 });
        }

        const extension = EXTENSION_BY_TYPE[file.type];
        if (!extension) {
          return new Response(`Unsupported image type: ${file.type || "unknown"}`, { status: 415 });
        }
        if (file.size > MAX_BYTES) {
          return new Response(`Image exceeds ${MAX_BYTES / 1024 / 1024}MB`, { status: 413 });
        }

        try {
          const bytes = new Uint8Array(await file.arrayBuffer());
          const digest = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
          const hash = Array.from(new Uint8Array(digest))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
            .slice(0, 32);
          const objectKey = `avatars/${hash}.${extension}`;

          const { headObject, putObject } = await import("@/lib/tts/r2.server");
          // Content-hashed, so an identical re-upload is already there — skip the write.
          if (!(await headObject(objectKey))) {
            // Deliberately NOT the immutable year-long lifetime used for audio. Avatars get
            // deleted when replaced, and an immutable public cache would keep serving the
            // deleted image from Cloudflare's edge long after it left the bucket. Five
            // minutes bounds how long a removed avatar stays reachable.
            await putObject(objectKey, bytes, file.type, "public, max-age=300");
          }

          // Only after the replacement is durably in place, so a failure here can never leave
          // the user with no avatar at all. Cleanup is best-effort: a leaked object is a much
          // better outcome than failing an upload that already succeeded.
          try {
            await retirePreviousAvatar(env, token, userId, objectKey);
          } catch (err) {
            console.error("[api/avatar] failed to retire previous avatar:", err);
          }

          return new Response(JSON.stringify({ url: `${env.publicBaseUrl}/${objectKey}` }), {
            headers: { "content-type": "application/json", "cache-control": "no-store" },
          });
        } catch (err) {
          console.error("[api/avatar] upload failed:", err);
          return new Response("Avatar upload failed", { status: 502 });
        }
      },

      // Called when the user switches from an uploaded picture back to an emoji — that path
      // never touches POST, so without this the abandoned object would linger.
      DELETE: async ({ request }) => {
        const env = readEnv();
        if (!env) return new Response("Avatar upload not configured", { status: 502 });

        const token = (request.headers.get("authorization") ?? "").replace("Bearer ", "");
        const userId = await authenticate(request, env);
        if (!userId) return new Response("Unauthorized", { status: 401 });

        try {
          await retirePreviousAvatar(env, token, userId, null);
          return new Response(null, { status: 204 });
        } catch (err) {
          console.error("[api/avatar] delete failed:", err);
          return new Response("Avatar delete failed", { status: 502 });
        }
      },
    },
  },
});
