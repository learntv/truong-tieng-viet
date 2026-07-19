import { AwsClient } from "aws4fetch";

// R2 via its S3-compatible API (not a Cloudflare Workers `r2_bindings` binding) — bindings
// only exist under `wrangler dev`/the deployed Worker, but local dev here runs via plain
// `vite dev`. One S3-style client, authenticated with an R2 API token, works identically in
// the Bun pregeneration script and the deployed Worker.

function getConfig() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;

  const missing = [
    !accountId && "R2_ACCOUNT_ID",
    !accessKeyId && "R2_ACCESS_KEY_ID",
    !secretAccessKey && "R2_SECRET_ACCESS_KEY",
    !bucket && "R2_BUCKET",
  ].filter(Boolean);
  if (missing.length > 0) {
    throw new Error(`Missing R2 environment variable(s): ${missing.join(", ")}`);
  }

  return {
    accountId: accountId!,
    bucket: bucket!,
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    client: new AwsClient({
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
      service: "s3",
      region: "auto",
    }),
  };
}

function objectUrl(key: string): string {
  const { endpoint, bucket } = getConfig();
  return `${endpoint}/${bucket}/${key}`;
}

export async function getObject(key: string): Promise<Uint8Array | null> {
  const { client } = getConfig();
  const res = await client.fetch(objectUrl(key));
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`R2 getObject(${key}) failed (${res.status}): ${await res.text()}`);
  return new Uint8Array(await res.arrayBuffer());
}

export async function headObject(key: string): Promise<boolean> {
  const { client } = getConfig();
  const res = await client.fetch(objectUrl(key), { method: "HEAD" });
  if (res.status === 404) return false;
  if (!res.ok) throw new Error(`R2 headObject(${key}) failed (${res.status}): ${await res.text()}`);
  return true;
}

// `cacheControl` defaults to a year-long immutable lifetime, which suits content-hashed
// objects that are only ever added (audio). Callers that also *delete* objects must pass
// something shorter — an immutable edge-cached copy outlives the delete, so the object stays
// publicly fetchable long after it's gone from the bucket (see api.avatar.ts).
export async function putObject(
  key: string,
  body: Uint8Array,
  contentType: string,
  cacheControl = "public, max-age=31536000, immutable",
): Promise<void> {
  const { client } = getConfig();
  const res = await client.fetch(objectUrl(key), {
    method: "PUT",
    // Wrapped in a Blob: TS's DOM lib types BodyInit's Uint8Array overload as
    // `Uint8Array<ArrayBuffer>` specifically, which a plain `Uint8Array<ArrayBufferLike>`
    // (what crypto/fetch APIs actually return) doesn't structurally satisfy.
    body: new Blob([body as BlobPart]),
    headers: {
      "content-type": contentType,
      "cache-control": cacheControl,
    },
  });
  if (!res.ok) throw new Error(`R2 putObject(${key}) failed (${res.status}): ${await res.text()}`);
}

export async function deleteObject(key: string): Promise<void> {
  const { client } = getConfig();
  const res = await client.fetch(objectUrl(key), { method: "DELETE" });
  // 404 is fine — already gone is the desired end state.
  if (!res.ok && res.status !== 404) {
    throw new Error(`R2 deleteObject(${key}) failed (${res.status}): ${await res.text()}`);
  }
}

// Used only by the maintenance `--prune` script, not the request path — lists every key
// under `audio/` so it can be diffed against the live DB to find true orphans.
export async function listObjectKeys(prefix: string): Promise<string[]> {
  const { client, endpoint, bucket } = getConfig();
  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const url = new URL(`${endpoint}/${bucket}`);
    url.searchParams.set("list-type", "2");
    url.searchParams.set("prefix", prefix);
    if (continuationToken) url.searchParams.set("continuation-token", continuationToken);

    const res = await client.fetch(url.toString());
    if (!res.ok) throw new Error(`R2 listObjects failed (${res.status}): ${await res.text()}`);
    const xml = await res.text();

    for (const match of xml.matchAll(/<Key>([^<]+)<\/Key>/g)) keys.push(match[1]);

    const truncated = /<IsTruncated>true<\/IsTruncated>/.test(xml);
    const tokenMatch = xml.match(/<NextContinuationToken>([^<]+)<\/NextContinuationToken>/);
    continuationToken = truncated && tokenMatch ? tokenMatch[1] : undefined;
  } while (continuationToken);

  return keys;
}
