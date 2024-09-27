export async function hash(x: string, digest: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(x); // Encode message as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest(digest, msgBuffer); // Calculate SHA-256 digest
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert bytes to hex string
  return hashHex;
}
