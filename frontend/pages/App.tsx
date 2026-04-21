import { useEffect, useState } from 'react';

import { AuthStatusScreen } from '../components/auth/AuthStatusScreen.js';
import { checkActiveSession, clearStoredSession, type AuthenticatedUser, type AuthSession } from '../services/auth-client.js';
import styles from './App.module.css';
import { HomePage } from './HomePage.js';
import { LeaderboardPage } from './LeaderboardPage.js';
import { LoginPage } from './LoginPage.js';

type AppView = 'leaderboard' | 'machine';

/**
 * Root application shell.
 *
 * @returns {JSX.Element} Application entry page.
 */
export function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('machine');

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
    setCurrentView('machine');
  }

  function handleLogout() {
    clearStoredSession();
    setAuthenticatedUser(null);
    setCurrentBalance(null);
    setCurrentView('machine');
  }

  function handleOpenLeaderboard(nextBalance: number | null = null) {
    if (typeof nextBalance === 'number') {
      setCurrentBalance(nextBalance);
    }

    setCurrentView('leaderboard');
  }

  function handleCloseLeaderboard() {
    setCurrentView('machine');
  }

  if (isCheckingSession) {
    return (
      <main className={styles.pageShell}>
        <AuthStatusScreen />
      </main>
    );
  }

  if (currentView === 'leaderboard') {
    return (
      <LeaderboardPage
        currentBalance={currentBalance}
        currentUser={authenticatedUser}
        onBack={handleCloseLeaderboard}
      />
    );
  }

  if (!authenticatedUser) {
    return <LoginPage onAuthenticated={handleAuthenticated} onOpenLeaderboard={() => handleOpenLeaderboard()} />;
  }

  return (
    <HomePage
      onLogout={handleLogout}
      onOpenLeaderboard={(nextBalance) => handleOpenLeaderboard(nextBalance)}
      user={authenticatedUser}
    />
  );
}
