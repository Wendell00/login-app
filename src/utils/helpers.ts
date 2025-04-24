
export async function generateSecretHash(
  username: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const input = username + clientId;

  if (typeof globalThis.crypto?.subtle?.importKey === 'function') {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(clientSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const data = encoder.encode(input);
    const sig = await crypto.subtle.sign('HMAC', key, data);
    const bytes = new Uint8Array(sig);
    let str = '';
    for (const b of bytes) str += String.fromCharCode(b);
    return btoa(str);
  }
  throw new Error(
    'Crypto API não suportada neste ambiente.'
  );
}