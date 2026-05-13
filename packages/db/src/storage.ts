import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let serverClient: SupabaseClient | null = null;

/**
 * Server-side Supabase client using SECRET key.
 * Only call from server actions / route handlers — NEVER from client.
 */
export function getStorageClient(): SupabaseClient {
  if (serverClient) return serverClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY env. Cannot use storage.',
    );
  }
  serverClient = createClient(url, secret, {
    auth: { persistSession: false },
  });
  return serverClient;
}

const BUCKET = process.env.STORAGE_BUCKET ?? 'streaming-proofs';

/** Ensure the bucket exists (no-op if already present). Call once on cold start. */
export async function ensureBucket(): Promise<void> {
  const client = getStorageClient();
  const { data: buckets } = await client.storage.listBuckets();
  if (!buckets?.find((b: { name: string }) => b.name === BUCKET)) {
    await client.storage.createBucket(BUCKET, { public: true });
  }
}

export async function uploadProofImage(
  buffer: Buffer | ArrayBuffer | Blob,
  filename: string,
  contentType: string,
): Promise<{ path: string; publicUrl: string }> {
  const client = getStorageClient();
  await ensureBucket();
  const path = `proofs/${Date.now()}-${filename}`;
  const { error } = await client.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType, upsert: false });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export function getPublicUrl(path: string): string {
  return getStorageClient().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
