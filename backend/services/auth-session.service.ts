import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_TTL_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 30;

export interface SessionUserPayload {
  id: string;
  name: string;
  displayName: string;
  email: string | null;
  isGuest: boolean;
}

interface EncodedSessionPayload {
  expiresAt: number;
  user: SessionUserPayload;
}

/**
 * Creates a signed session token that can be cached client-side.
 *
 * @param {SessionUserPayload} user - Public user payload to embed in the session.
 * @returns {string} Signed token string.
 */
export function createSessionToken(user: SessionUserPayload) {
  const encodedPayload = Buffer.from(
    JSON.stringify({
      user,
      expiresAt: Date.now() + SESSION_TTL_IN_MILLISECONDS
    } satisfies EncodedSessionPayload)
  ).toString('base64url');
  const signature = signValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes a signed session token.
 *
 * @param {string} token - Raw token string from the client.
 * @returns {SessionUserPayload | null} Decoded user payload when valid.
 */
export function decodeSessionToken(token: string) {
  const [encodedPayload, providedSignature] = token.split('.');

  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);

  if (
    Buffer.byteLength(providedSignature) !== Buffer.byteLength(expectedSignature) ||
    !timingSafeEqual(Buffer.from(providedSignature), Buffer.from(expectedSignature))
  ) {
    return null;
  }

  const parsedPayload = JSON.parse(
    Buffer.from(encodedPayload, 'base64url').toString('utf8')
  ) as EncodedSessionPayload;

  if (parsedPayload.expiresAt < Date.now()) {
    return null;
  }

  return parsedPayload.user;
}

/**
 * Signs a value using a stable secret for the local development app.
 *
 * @param {string} value - Encoded token payload.
 * @returns {string} HMAC signature.
 */
function signValue(value: string) {
  return createHmac('sha256', getSessionSecret())
    .update(value)
    .digest('base64url');
}

/**
 * Resolves the session signing secret from the environment or a local default.
 *
 * @returns {string} Secret used for HMAC signing.
 */
function getSessionSecret() {
  return process.env.AUTH_SESSION_SECRET ?? 'local-slot-machine-auth-secret';
}
