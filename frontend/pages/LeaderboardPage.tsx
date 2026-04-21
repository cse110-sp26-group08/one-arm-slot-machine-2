import { useEffect, useState } from 'react';

import type { AuthenticatedUser } from '../services/auth-client.js';
import { fetchLeaderboardEntries, type LeaderboardEntry } from '../services/leaderboard-client.js';
import styles from './LeaderboardPage.module.css';

interface LeaderboardPageProps {
  currentBalance: number | null;
  currentUser: AuthenticatedUser | null;
  onBack: () => void;
}

/**
 * Displays a frontend-driven leaderboard until persistent Mongo-backed rankings are available.
 *
 * @param {LeaderboardPageProps} props - Leaderboard page props.
 * @returns {JSX.Element} Leaderboard page UI.
 */
export function LeaderboardPage({
  currentBalance,
  currentUser,
  onBack
}: LeaderboardPageProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    void loadLeaderboard();
  }, [currentUser, currentBalance]);

  async function loadLeaderboard() {
    const nextEntries = await fetchLeaderboardEntries(currentUser, currentBalance);
    setEntries(nextEntries);
  }

  return (
    <main className={styles.pageShell}>
      <section className={styles.heroPanel}>
        <div>
          <p className={styles.eyebrow}>Floor standings</p>
          <h1 className={styles.title}>Leaderboard</h1>
          <p className={styles.supportCopy}>
            MongoDB is temporarily offline, so this board uses seeded floor data and adds the current player when available.
          </p>
        </div>
        <button className={styles.backButton} onClick={onBack} type="button">
          {currentUser ? 'Return to machine' : 'Back to login'}
        </button>
      </section>

      <section className={styles.boardPanel}>
        <div className={styles.boardHeader}>
          <span>Rank</span>
          <span>Player</span>
          <span>Title</span>
          <span>Balance</span>
        </div>
        <div className={styles.boardRows}>
          {entries.map((entry) => {
            const isCurrentUser = currentUser?.displayName === entry.displayName;

            return (
              <article
                className={isCurrentUser ? `${styles.boardRow} ${styles.boardRowCurrent}` : styles.boardRow}
                key={`${entry.rank}-${entry.displayName}`}
              >
                <strong className={styles.rankBadge}>#{entry.rank}</strong>
                <div className={styles.playerCell}>
                  <span className={styles.playerName}>{entry.displayName}</span>
                  {isCurrentUser ? <span className={styles.currentTag}>You</span> : null}
                </div>
                <span className={styles.playerTitle}>{entry.title}</span>
                <strong className={styles.balanceValue}>{entry.balance}</strong>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
