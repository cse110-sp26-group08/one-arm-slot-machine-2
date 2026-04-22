export interface LeaderboardEntry {
  balance: number;
  displayName: string;
  rank: number;
  title: string;
}

const LEADERBOARD_API_BASE_URL = 'http://localhost:4000/api/leaderboard';

/**
 * Fetches leaderboard rows from the backend Mongo-backed leaderboard endpoint.
 *
 * @returns {Promise<LeaderboardEntry[]>} Sorted leaderboard entries.
 */
export async function fetchLeaderboardEntries() {
  const response = await fetch(LEADERBOARD_API_BASE_URL);
  const payload = (await response.json()) as { error?: string } | LeaderboardEntry[];

  if (!response.ok) {
    throw new Error(
      typeof payload === 'object' && payload !== null && 'error' in payload
        ? payload.error ?? 'Unable to load the leaderboard.'
        : 'Unable to load the leaderboard.'
    );
  }

  return payload as LeaderboardEntry[];
}
