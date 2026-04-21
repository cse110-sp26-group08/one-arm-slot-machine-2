const SESSION_STORAGE_KEY = 'slot-machine-session-token';
const API_BASE_URL = 'http://localhost:4000/api/auth';

export interface AuthenticatedUser {
  id: string;
  name: string;
  displayName: string;
  email: string | null;
  isGuest: boolean;
}

export interface AuthSession {
  token: string;
  user: AuthenticatedUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  captcha: string;
}

/**
 * Attempts login with email and password and caches the returned session token.
 *
 * @param {LoginPayload} credentials - Login form payload.
 * @returns {Promise<AuthSession>} Authenticated session data.
 */
export async function loginWithEmail(credentials: LoginPayload) {
  const session = await sendRequest<AuthSession>('/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });

  cacheSessionToken(session.token);
  return session;
}

/**
 * Signs up a new user account and caches the returned session token.
 *
 * @param {SignUpPayload} signupPayload - Signup form payload.
 * @returns {Promise<AuthSession>} Authenticated session data.
 */
export async function signUpUser(signupPayload: SignUpPayload) {
  const session = await sendRequest<AuthSession>('/signup', {
    method: 'POST',
    body: JSON.stringify(signupPayload)
  });

  cacheSessionToken(session.token);
  return session;
}

/**
 * Starts a guest session and caches the returned token.
 *
 * @returns {Promise<AuthSession>} Guest session data.
 */
export async function playAsGuest() {
  const session = await sendRequest<AuthSession>('/guest', {
    method: 'POST'
  });

  cacheSessionToken(session.token);
  return session;
}

/**
 * Validates and restores the cached session token when present.
 *
 * @returns {Promise<AuthSession | null>} Session if valid; otherwise null.
 */
export async function checkActiveSession() {
  const cachedToken = localStorage.getItem(SESSION_STORAGE_KEY);

  if (!cachedToken) {
    return null;
  }

  try {
    const session = await sendRequest<AuthSession>('/session', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cachedToken}`
      }
    });

    cacheSessionToken(session.token);
    return session;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

/**
 * Clears the cached session token from local storage.
 *
 * @returns {void}
 */
export function clearStoredSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

/**
 * Stores the session token locally to preserve login across reloads.
 *
 * @param {string} token - Signed session token from the backend.
 * @returns {void}
 */
function cacheSessionToken(token: string) {
  localStorage.setItem(SESSION_STORAGE_KEY, token);
}

/**
 * Sends a JSON request to the auth API and raises a clear error on failure.
 *
 * @template ResponseBody
 * @param {string} path - Relative auth API path.
 * @param {RequestInit} options - Fetch options for the request.
 * @returns {Promise<ResponseBody>} Parsed JSON response.
 */
async function sendRequest<ResponseBody>(path: string, options: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    }
  });

  const payload = (await response.json()) as { error?: string } & ResponseBody;

  if (!response.ok) {
    throw new Error(payload.error ?? 'Request failed.');
  }

  return payload;
}
