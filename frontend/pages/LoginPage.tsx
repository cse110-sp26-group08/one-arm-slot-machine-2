import { useState } from 'react';

import {
  loginWithEmail,
  playAsGuest,
  signUpUser,
  type AuthSession,
  type LoginPayload,
  type SignUpPayload
} from '../services/auth-client.js';
import styles from './App.module.css';
import { AuthShell } from '../components/auth/AuthShell.js';
import { initialLoginForm, initialSignupForm, type FormMode, type LoginFormState, type SignupFormState } from '../components/auth/auth-types.js';
import { LoginForm } from '../components/auth/LoginForm.js';
import { SignupForm } from '../components/auth/SignupForm.js';

interface LoginPageProps {
  onAuthenticated: (session: AuthSession) => void;
  onOpenLeaderboard: () => void;
}

/**
 * Visual thesis: a cinematic casino entry portal with brass, velvet, and marquee light energy.
 * Content plan: identity-led hero, auth controls, trust cues, final guest entry.
 * Interaction thesis: subtle reel shimmer, staggered panel reveal, and responsive button glow.
 *
 * @returns {JSX.Element} Login and signup page for the slot machine app.
 */
export function LoginPage({ onAuthenticated, onOpenLeaderboard }: LoginPageProps) {
  const [mode, setMode] = useState<FormMode>('login');
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [signupForm, setSignupForm] = useState(initialSignupForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('Enter the arcade with your existing account or spin up a new identity.');

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedbackMessage('Checking the cage and bringing your token balance forward...');

    try {
      const session = await loginWithEmail(loginForm as LoginPayload);

      onAuthenticated(session);
      setFeedbackMessage(`Logged in as ${session.user.displayName}. Ready for the first spin.`);
    } catch (error) {
      setFeedbackMessage(resolveErrorMessage(error, 'Login failed. Double-check your email and password.'));
    } finally {
      setIsSubmitting(false);
    }
  }

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

      onAuthenticated(session);
      setFeedbackMessage(`Account created for ${session.user.displayName}. Your guest streak starts now.`);
    } catch (error) {
      setFeedbackMessage(resolveErrorMessage(error, 'Signup failed. Review the form and try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGuestEntry() {
    setIsSubmitting(true);
    setFeedbackMessage('Opening a guest lane on the floor...');

    try {
      const session = await playAsGuest();

      onAuthenticated(session);
      setFeedbackMessage('Guest access granted. Explore the arcade before committing to a full account.');
    } catch (error) {
      setFeedbackMessage(resolveErrorMessage(error, 'Guest access is unavailable right now.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleLoginChange(field: keyof LoginFormState, value: string) {
    setLoginForm((currentForm) => ({
      ...currentForm,
      [field]: value
    }));
  }

  function handleSignupChange(field: keyof SignupFormState, value: string) {
    setSignupForm((currentForm) => ({
      ...currentForm,
      [field]: value
    }));
  }

  return (
    <main className={styles.pageShell}>
      <AuthShell
        feedbackMessage={feedbackMessage}
        isSubmitting={isSubmitting}
        mode={mode}
        onLeaderboardOpen={onOpenLeaderboard}
        onGuestEntry={handleGuestEntry}
        onModeChange={setMode}
      >
        {mode === 'login' ? (
          <LoginForm
            form={loginForm}
            isSubmitting={isSubmitting}
            onChange={handleLoginChange}
            onSubmit={handleLoginSubmit}
          />
        ) : (
          <SignupForm
            form={signupForm}
            isSubmitting={isSubmitting}
            onChange={handleSignupChange}
            onSubmit={handleSignupSubmit}
          />
        )}
      </AuthShell>
    </main>
  );
}

function resolveErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
