import { useEffect, useState } from 'react';

import {
  checkActiveSession,
  loginWithEmail,
  playAsGuest,
  signUpUser,
  type AuthenticatedUser,
  type LoginPayload,
  type SignUpPayload
} from '../services/auth-client.js';

type FormMode = 'login' | 'signup';

const initialLoginForm = {
  email: '',
  password: ''
};

const initialSignupForm = {
  name: '',
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  dateOfBirth: '',
  captcha: ''
};

/**
 * Visual thesis: a cinematic casino entry portal with brass, velvet, and marquee light energy.
 * Content plan: identity-led hero, auth controls, trust cues, final guest entry.
 * Interaction thesis: subtle reel shimmer, staggered panel reveal, and responsive button glow.
 *
 * @returns {JSX.Element} Login and signup experience for the slot machine app.
 */
export function App() {
  const [mode, setMode] = useState<FormMode>('login');
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [signupForm, setSignupForm] = useState(initialSignupForm);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('Enter the arcade with your existing account or spin up a new identity.');

  useEffect(() => {
    void hydrateSession();
  }, []);

  /**
   * Restores an existing cached session if a valid token exists.
   *
   * @returns {Promise<void>} Promise resolved after the session check finishes.
   */
  async function hydrateSession() {
    try {
      const activeSession = await checkActiveSession();

      if (activeSession) {
        setAuthenticatedUser(activeSession.user);
        setFeedbackMessage(`Welcome back, ${activeSession.user.displayName}. Your seat is still warm.`);
      }
    } catch {
      setFeedbackMessage('Your previous session expired. Sign in again to keep your streak intact.');
    } finally {
      setIsCheckingSession(false);
    }
  }

  /**
   * Handles the login flow using email and password.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Submitted login form event.
   * @returns {Promise<void>} Promise resolved after login completes.
   */
  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedbackMessage('Checking the cage and bringing your token balance forward...');

    try {
      const session = await loginWithEmail(loginForm as LoginPayload);

      setAuthenticatedUser(session.user);
      setFeedbackMessage(`Logged in as ${session.user.displayName}. Ready for the first spin.`);
    } catch (error) {
      setFeedbackMessage(resolveErrorMessage(error, 'Login failed. Double-check your email and password.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Handles the signup flow and client-side confirm-password/captcha checks.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Submitted signup form event.
   * @returns {Promise<void>} Promise resolved after signup completes.
   */
  async function handleSignupSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      setFeedbackMessage('Confirm password must match before a new profile can be created.');
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage('Registering your player card and lighting up a fresh machine...');

    try {
      const session = await signUpUser(signupForm as SignUpPayload);

      setAuthenticatedUser(session.user);
      setFeedbackMessage(`Account created for ${session.user.displayName}. Your guest streak starts now.`);
    } catch (error) {
      setFeedbackMessage(resolveErrorMessage(error, 'Signup failed. Review the form and try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Starts a guest session without creating a stored account.
   *
   * @returns {Promise<void>} Promise resolved after guest entry completes.
   */
  async function handleGuestEntry() {
    setIsSubmitting(true);
    setFeedbackMessage('Opening a guest lane on the floor...');

    try {
      const session = await playAsGuest();

      setAuthenticatedUser(session.user);
      setFeedbackMessage('Guest access granted. Explore the arcade before committing to a full account.');
    } catch (error) {
      setFeedbackMessage(resolveErrorMessage(error, 'Guest access is unavailable right now.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Clears the local cached session.
   *
   * @returns {void}
   */
  function handleLogout() {
    localStorage.removeItem('slot-machine-session-token');
    setAuthenticatedUser(null);
    setFeedbackMessage('Session cleared on this device. You can still return with your email login.');
  }

  if (isCheckingSession) {
    return (
      <main className="page-shell">
        <section className="status-screen">
          <p className="eyebrow">Checking cached session</p>
          <h1>Restoring your seat at the machine.</h1>
        </section>
      </main>
    );
  }

  if (authenticatedUser) {
    return (
      <main className="page-shell">
        <section className="hero-panel authenticated-panel">
          <div className="brand-stack">
            <p className="eyebrow">One Arm Arcade</p>
            <h1>{authenticatedUser.displayName}, the reels are live.</h1>
            <p className="support-copy">
              {authenticatedUser.isGuest
                ? 'You are playing as a guest. Create a permanent account later to keep streaks and unlock future machines.'
                : 'Your login is cached on this device so you do not need to sign in every visit.'}
            </p>
          </div>
          <div className="detail-rail">
            <div>
              <span className="detail-label">Profile</span>
              <p>{authenticatedUser.email ?? 'Guest access only'}</p>
            </div>
            <div>
              <span className="detail-label">Access</span>
              <p>{authenticatedUser.isGuest ? 'Guest lane' : 'Account holder'}</p>
            </div>
          </div>
          <button className="secondary-button" onClick={handleLogout} type="button">
            Clear cached login
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="brand-stack">
          <p className="eyebrow">One Arm Arcade</p>
          <h1>Claim your machine before the floor goes neon.</h1>
          <p className="support-copy">
            Sign in, register a fresh player card, or test the reels as a guest while the full slot hall comes online.
          </p>
        </div>
        <div className="marquee-strip" aria-hidden="true">
          <span>777</span>
          <span>BAR</span>
          <span>CHERRY</span>
          <span>JACKPOT</span>
        </div>
      </section>

      <section className="auth-stage">
        <aside className="auth-copy">
          <p className="eyebrow">Access modes</p>
          <h2>Front-of-house now, full casino later.</h2>
          <ul className="feature-list">
            <li>Email login with cached session restore on this device</li>
            <li>Signup flow with confirm password, date of birth, and captcha prompt</li>
            <li>Guest lane for players who want a quick look first</li>
          </ul>
          <p className="feedback-banner">{feedbackMessage}</p>
        </aside>

        <div className="auth-surface">
          <div className="mode-toggle" role="tablist" aria-label="Authentication mode">
            <button
              className={mode === 'login' ? 'mode-button active' : 'mode-button'}
              onClick={() => setMode('login')}
              type="button"
            >
              Login
            </button>
            <button
              className={mode === 'signup' ? 'mode-button active' : 'mode-button'}
              onClick={() => setMode('signup')}
              type="button"
            >
              Signup
            </button>
          </div>

          {mode === 'login' ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <label>
                <span>Email</span>
                <input
                  autoComplete="email"
                  name="email"
                  onChange={(event) =>
                    setLoginForm((currentForm) => ({
                      ...currentForm,
                      email: event.target.value
                    }))
                  }
                  required
                  type="email"
                  value={loginForm.email}
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  autoComplete="current-password"
                  name="password"
                  onChange={(event) =>
                    setLoginForm((currentForm) => ({
                      ...currentForm,
                      password: event.target.value
                    }))
                  }
                  required
                  type="password"
                  value={loginForm.password}
                />
              </label>
              <button className="primary-button" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Logging in...' : 'Enter arcade'}
              </button>
            </form>
          ) : (
            <form className="auth-form signup-form" onSubmit={handleSignupSubmit}>
              <label>
                <span>Name</span>
                <input
                  name="name"
                  onChange={(event) =>
                    setSignupForm((currentForm) => ({
                      ...currentForm,
                      name: event.target.value
                    }))
                  }
                  required
                  type="text"
                  value={signupForm.name}
                />
              </label>
              <label>
                <span>Display name</span>
                <input
                  name="displayName"
                  onChange={(event) =>
                    setSignupForm((currentForm) => ({
                      ...currentForm,
                      displayName: event.target.value
                    }))
                  }
                  required
                  type="text"
                  value={signupForm.displayName}
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  autoComplete="email"
                  name="email"
                  onChange={(event) =>
                    setSignupForm((currentForm) => ({
                      ...currentForm,
                      email: event.target.value
                    }))
                  }
                  required
                  type="email"
                  value={signupForm.email}
                />
              </label>
              <label>
                <span>Date of birth</span>
                <input
                  name="dateOfBirth"
                  onChange={(event) =>
                    setSignupForm((currentForm) => ({
                      ...currentForm,
                      dateOfBirth: event.target.value
                    }))
                  }
                  required
                  type="date"
                  value={signupForm.dateOfBirth}
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  autoComplete="new-password"
                  name="password"
                  onChange={(event) =>
                    setSignupForm((currentForm) => ({
                      ...currentForm,
                      password: event.target.value
                    }))
                  }
                  required
                  type="password"
                  value={signupForm.password}
                />
              </label>
              <label>
                <span>Confirm password</span>
                <input
                  autoComplete="new-password"
                  name="confirmPassword"
                  onChange={(event) =>
                    setSignupForm((currentForm) => ({
                      ...currentForm,
                      confirmPassword: event.target.value
                    }))
                  }
                  required
                  type="password"
                  value={signupForm.confirmPassword}
                />
              </label>
              <label className="captcha-row">
                <span>Captcha</span>
                <div className="captcha-prompt">Type JACKPOT to prove you are not a bot.</div>
                <input
                  name="captcha"
                  onChange={(event) =>
                    setSignupForm((currentForm) => ({
                      ...currentForm,
                      captcha: event.target.value
                    }))
                  }
                  placeholder="JACKPOT"
                  required
                  type="text"
                  value={signupForm.captcha}
                />
              </label>
              <button className="primary-button" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Creating account...' : 'Create player card'}
              </button>
            </form>
          )}

          <button
            className="secondary-button guest-button"
            disabled={isSubmitting}
            onClick={() => void handleGuestEntry()}
            type="button"
          >
            {isSubmitting ? 'Preparing lane...' : 'Play as guest'}
          </button>
        </div>
      </section>
    </main>
  );
}

/**
 * Extracts a human-friendly message from failed API calls.
 *
 * @param {unknown} error - Unknown thrown error value.
 * @param {string} fallbackMessage - Fallback message for unexpected failures.
 * @returns {string} Message suitable for the UI.
 */
function resolveErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
