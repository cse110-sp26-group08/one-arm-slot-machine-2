import { useEffect, useState } from 'react';

import { AuthStatusScreen } from '../components/auth/AuthStatusScreen.js';
import { checkActiveSession, clearStoredSession, type AuthenticatedUser, type AuthSession } from '../services/auth-client.js';
import styles from './App.module.css';
import { HomePage } from './HomePage.js';
import { LeaderboardPage } from './LeaderboardPage.js';
import { LoginPage } from './LoginPage.js';
import { PrizePage } from './PrizePage.js';

type AppView = 'leaderboard' | 'machine' | 'prizes';

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

  function handleOpenPrizePage(nextBalance: number | null = null) {
    if (typeof nextBalance === 'number') {
      setCurrentBalance(nextBalance);
    }

    setCurrentView('prizes');
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
        currentUser={authenticatedUser}
        onBack={handleCloseLeaderboard}
      />
    );
  }

  if (currentView === 'prizes') {
    return (
      <PrizePage
        currentBalance={currentBalance}
        currentUser={authenticatedUser}
        onBack={handleCloseLeaderboard}
        onPrizePurchased={(nextBalance) => setCurrentBalance(nextBalance)}
      />
    );
  }

  if (!authenticatedUser) {
    return <LoginPage onAuthenticated={handleAuthenticated} onOpenLeaderboard={() => handleOpenLeaderboard()} />;
  }

  return (
    <HomePage
      onLogout={handleLogout}
      onOpenPrizePage={(nextBalance) => handleOpenPrizePage(nextBalance)}
      onOpenLeaderboard={(nextBalance) => handleOpenLeaderboard(nextBalance)}
      onStateBalanceChange={(nextBalance) => setCurrentBalance(nextBalance)}
      user={authenticatedUser}
    />
  );
}
