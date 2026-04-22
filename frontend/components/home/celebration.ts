import type { SlotMachineState, WinCelebrationTheme } from '../../services/slot-machine-client.js';

export interface ConfettiParticle {
  color: string;
  driftOffset: number;
  durationInMilliseconds: number;
  horizontalPosition: number;
  rotationInDegrees: number;
  sizeInPixels: number;
  delayInMilliseconds: number;
}

const confettiPalette = ['#f9c968', '#ff7f51', '#ff4d6d', '#5eead4', '#7dd3fc', '#fef08a'];
const snowPalette = ['#f8fdff', '#d8f4ff', '#e8fbff'];

/**
 * Resolves the main title shown in the celebration overlay for the current win tier.
 *
 * @param {'win' | 'big-win' | 'jackpot'} animationTier - Animation intensity for the finished spin.
 * @returns {string} Celebration title copy.
 */
export function getCelebrationHeadline(animationTier: 'win' | 'big-win' | 'jackpot') {
  if (animationTier === 'jackpot') {
    return 'Jackpot!';
  }

  if (animationTier === 'big-win') {
    return 'Big win!';
  }

  return 'You win!';
}

/**
 * Resolves the smaller accent label shown above the celebration title.
 *
 * @param {'win' | 'big-win' | 'jackpot'} animationTier - Animation intensity for the finished spin.
 * @returns {string} Accent label copy.
 */
export function getCelebrationEyebrow(animationTier: 'win' | 'big-win' | 'jackpot') {
  if (animationTier === 'jackpot') {
    return 'Treasure vault open';
  }

  if (animationTier === 'big-win') {
    return 'High tide payout';
  }

  return 'Jackpot lights';
}

/**
 * Builds deterministic confetti particle values for the win overlay.
 *
 * @param {number} particleCount - Number of particles to generate.
 * @returns {ConfettiParticle[]} Particle metadata for CSS-driven animation.
 */
export function createCelebrationParticles(
  theme: WinCelebrationTheme,
  particleCount = 24
) {
  const palette = theme === 'snow' ? snowPalette : confettiPalette;

  return Array.from({ length: particleCount }, (_, index) => ({
    color: palette[index % palette.length],
    driftOffset: theme === 'snow' ? ((index * 13) % 26) - 13 : ((index * 19) % 44) - 22,
    durationInMilliseconds:
      theme === 'snow' ? 2500 + ((index * 91) % 900) : 1450 + ((index * 73) % 500),
    horizontalPosition: 4 + ((index * 11) % 92),
    rotationInDegrees: (index * 41) % 360,
    sizeInPixels: theme === 'snow' ? 8 + (index % 4) * 3 : 10 + (index % 5) * 2,
    delayInMilliseconds: (index % 8) * 50
  }));
}

/**
 * Creates the player-facing win overlay copy from the finished slot-machine state.
 *
 * @param {SlotMachineState} state - Finished slot-machine state.
 * @returns {string} Celebration message for the overlay.
 */
export function getWinAnnouncement(state: SlotMachineState) {
  const connectedLines = `${state.winningLines.length} payline${state.winningLines.length === 1 ? '' : 's'}`;
  return `You win! ${connectedLines} paid out ${state.lastPayout}.`;
}
