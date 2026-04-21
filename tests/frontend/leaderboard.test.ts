import assert from 'node:assert/strict';
import test from 'node:test';

import { fetchLeaderboardEntries } from '../../frontend/services/leaderboard-client.js';

test('fetchLeaderboardEntries returns backend leaderboard rows', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () =>
    ({
      ok: true,
      json: async () => [
        {
          rank: 1,
          displayName: 'LuckyJane',
          balance: 2200,
          title: 'Table leader'
        }
      ]
    })) as unknown as typeof fetch;

  const leaderboardEntries = await fetchLeaderboardEntries();

  globalThis.fetch = originalFetch;

  assert.equal(leaderboardEntries.length, 1);
  assert.equal(leaderboardEntries[0].displayName, 'LuckyJane');
  assert.equal(leaderboardEntries[0].balance, 2200);
});
