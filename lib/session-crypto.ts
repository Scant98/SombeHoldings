// Stateless admin session tokens: `${expiresAtMs}.${hmacSha256(expiresAtMs)}`.
// Uses Web Crypto only, so it runs in both the proxy (edge) and server actions.

const encoder = new TextEncoder()

async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(value))
  return Buffer.from(sig).toString("base64url")
}

export const SESSION_COOKIE = "sombe_admin_session"
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

export async function createToken(secret: string): Promise<string> {
  const expiresAt = String(Date.now() + SESSION_DURATION_MS)
  return `${expiresAt}.${await hmac(expiresAt, secret)}`
}

export async function verifyToken(
  token: string | undefined,
  secret: string
): Promise<boolean> {
  if (!token) return false
  const [expiresAt, signature] = token.split(".")
  if (!expiresAt || !signature) return false
  if (Number(expiresAt) < Date.now()) return false
  const expected = await hmac(expiresAt, secret)
  if (signature.length !== expected.length) return false
  // Constant-time comparison
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}
