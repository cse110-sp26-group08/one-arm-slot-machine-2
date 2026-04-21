import { useEffect, useState } from 'react';

import { AuthStatusScreen } from '../components/auth/AuthStatusScreen.js';
import { checkActiveSession, clearStoredSession, type AuthenticatedUser, type AuthSession } from '../services/auth-client.js';
import styles from './App.module.css';
import { HomePage } from './HomePage.js';
import { LoginPage } from './LoginPage.js';

/**
 * Root application shell.
 *
 * @returns {JSX.Element} Application entry page.
 */
export function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    void hydrateSession();
  }, []);

  async function hydrateSession() {
    try {
      const activeSession = await checkActiveSession();
      setAuthenticatedUser(activeSession?.user ?? null);
    } finally {
      setIsCheckingSession(false);
    }
  }

  function handleAuthenticated(session: AuthSession) {
    setAuthenticatedUser(session.user);
  }

  function handleLogout() {
    clearStoredSession();
    setAuthenticatedUser(null);
  }

  if (isCheckingSession) {
    return (
      <main className={styles.pageShell}>
        <AuthStatusScreen />
      </main>
    );
  }

  if (!authenticatedUser) {
    return <LoginPage onAuthenticated={handleAuthenticated} />;
  }

  return <HomePage onLogout={handleLogout} user={authenticatedUser} />;
}
