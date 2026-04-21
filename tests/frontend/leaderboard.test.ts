import assert from 'node:assert/strict';
import test from 'node:test';

import { buildLeaderboardEntries } from '../../frontend/services/leaderboard-client.js';

test('buildLeaderboardEntries injects the current player and keeps entries sorted by balance', () => {
  const leaderboardEntries = buildLeaderboardEntries(
    {
      id: 'current-player',
      name: 'Marina',
      displayName: 'Marina Blaze',
      email: null,
      isGuest: false
    },
    7000
  );

  assert.equal(leaderboardEntries[0].displayName, 'Marina Blaze');
  assert.equal(leaderboardEntries[0].balance, 7000);
  assert.equal(leaderboardEntries[0].rank, 1);
});

test('buildLeaderboardEntries skips the current player when there is no tracked balance yet', () => {
  const leaderboardEntries = buildLeaderboardEntries(
    {
      id: 'guest-player',
      name: 'Guest',
      displayName: 'Guest',
      email: null,
      isGuest: true
    },
    null
  );

  assert.equal(leaderboardEntries.some((entry) => entry.displayName === 'Guest'), false);
  assert.equal(leaderboardEntries.length, 6);
});
