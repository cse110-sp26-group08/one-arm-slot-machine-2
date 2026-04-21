import type { AuthenticatedUser } from './auth-client.js';

export interface LeaderboardEntry {
  balance: number;
  displayName: string;
  rank: number;
  title: string;
}

const seededLeaderboardEntries = [
  { displayName: 'Aurora Ace', balance: 6420, title: 'Grand Chaser' },
  { displayName: 'Lucky Mateo', balance: 5285, title: 'Volcano Reader' },
  { displayName: 'Crown Nova', balance: 4810, title: 'Bell Collector' },
  { displayName: 'Ruby Spin', balance: 4335, title: 'Cherry Keeper' },
  { displayName: 'Night Jackpot', balance: 3890, title: 'Wild Tamer' },
  { displayName: 'Blaze Seven', balance: 3510, title: 'Reel Runner' }
] satisfies Array<Omit<LeaderboardEntry, 'rank'>>;

/**
 * Fetches leaderboard rows from frontend-only sample data until MongoDB is online.
 *
 * @param {AuthenticatedUser | null} currentUser - Current authenticated player when available.
 * @param {number | null} currentBalance - Current player's tracked balance when available.
 * @returns {Promise<LeaderboardEntry[]>} Sorted leaderboard entries.
 */
export async function fetchLeaderboardEntries(
  currentUser: AuthenticatedUser | null,
  currentBalance: number | null
) {
  return Promise.resolve(buildLeaderboardEntries(currentUser, currentBalance));
}

/**
 * Builds a sorted leaderboard and injects the current player into the sample data when available.
 *
 * @param {AuthenticatedUser | null} currentUser - Current authenticated player when available.
 * @param {number | null} currentBalance - Current player's tracked balance when available.
 * @returns {LeaderboardEntry[]} Ranked leaderboard rows.
 */
export function buildLeaderboardEntries(
  currentUser: AuthenticatedUser | null,
  currentBalance: number | null
) {
  const workingEntries = seededLeaderboardEntries.map((entry) => ({ ...entry }));

  if (currentUser && typeof currentBalance === 'number' && Number.isFinite(currentBalance)) {
    workingEntries.push({
      displayName: currentUser.displayName,
      balance: currentBalance,
      title: currentUser.isGuest ? 'Guest Contender' : 'Floor Challenger'
    });
  }

  const deduplicatedEntries = Array.from(
    new Map(
      workingEntries
        .sort((leftEntry, rightEntry) => rightEntry.balance - leftEntry.balance)
        .map((entry) => [entry.displayName, entry])
    ).values()
  );

  return deduplicatedEntries
    .sort((leftEntry, rightEntry) => rightEntry.balance - leftEntry.balance)
    .slice(0, 8)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
}
