import type { SlotMachineState } from '../../services/slot-machine-client.js';

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

/**
 * Builds deterministic confetti particle values for the win overlay.
 *
 * @param {number} particleCount - Number of particles to generate.
 * @returns {ConfettiParticle[]} Particle metadata for CSS-driven animation.
 */
export function createConfettiParticles(particleCount = 24) {
  return Array.from({ length: particleCount }, (_, index) => ({
    color: confettiPalette[index % confettiPalette.length],
    driftOffset: ((index * 19) % 44) - 22,
    durationInMilliseconds: 1450 + ((index * 73) % 500),
    horizontalPosition: 4 + ((index * 11) % 92),
    rotationInDegrees: (index * 41) % 360,
    sizeInPixels: 10 + (index % 5) * 2,
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
