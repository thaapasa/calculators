export async function hashBytes(x: string, digest: string): Promise<Uint8Array> {
  const msgBuffer = new TextEncoder().encode(x);
  const hashBuffer = await crypto.subtle.digest(digest, msgBuffer);
  return new Uint8Array(hashBuffer);
}

export async function hash(x: string, digest: string): Promise<string> {
  const bytes = await hashBytes(x, digest);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}
