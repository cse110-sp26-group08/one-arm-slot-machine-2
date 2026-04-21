import { useEffect, useState } from 'react';

import { SlotMachineGrid } from '../components/home/SlotMachineGrid.js';
import { SlotMachineStats } from '../components/home/SlotMachineStats.js';
import { classicGoldTheme } from '../components/home/slot-theme.js';
import { fetchSlotMachineState, spinSlotMachine, type SlotMachineState, type SlotSymbol } from '../services/slot-machine-client.js';
import type { AuthenticatedUser } from '../services/auth-client.js';
import styles from './HomePage.module.css';

interface HomePageProps {
  onLogout: () => void;
  user: AuthenticatedUser;
}

const previewSymbols: SlotSymbol[] = ['seven', 'diamond', 'bar', 'cherry', 'bell', 'horseshoe', 'wild'];
const revealDelayInMilliseconds = 170;

/**
 * Home page containing the connected slot-machine experience.
 *
 * @param {HomePageProps} props - Home page props.
 * @returns {JSX.Element} Home page UI.
 */
export function HomePage({ onLogout, user }: HomePageProps) {
  const [slotMachineState, setSlotMachineState] = useState<SlotMachineState | null>(null);
  const [displayedGrid, setDisplayedGrid] = useState<SlotMachineState['grid'] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('No scroll, five paylines, and a bright center spin button ready to go.');

  useEffect(() => {
    void hydrateSlotMachineState();
  }, []);

  async function hydrateSlotMachineState() {
    const currentState = await fetchSlotMachineState();
    setSlotMachineState(currentState);
    setDisplayedGrid(currentState.grid);
  }

  async function handleSpin() {
    if (!slotMachineState || !displayedGrid || isSpinning) {
      return;
    }

    setIsSpinning(true);
    setStatusMessage('Reels are spinning. They will stop from left to right to build tension.');

    const previewInterval = window.setInterval(() => {
      setDisplayedGrid(createPreviewGrid());
    }, 90);
    const nextState = await spinSlotMachine();

    window.clearInterval(previewInterval);

    for (let columnIndex = 0; columnIndex < nextState.grid[0].length; columnIndex += 1) {
      await pause(revealDelayInMilliseconds);
      setDisplayedGrid((currentGrid) => replaceGridColumn(currentGrid ?? nextState.grid, nextState.grid, columnIndex));
    }

    setSlotMachineState(nextState);
    setDisplayedGrid(nextState.grid);
    setIsSpinning(false);
    setStatusMessage(resolveOutcomeMessage(nextState));
  }

  if (!slotMachineState || !displayedGrid) {
    return (
      <main className={styles.pageShell}>
        <section className={styles.machineFrame}>
          <p className={styles.eyebrow}>Preparing machine</p>
          <h1 className={styles.machineTitle}>Loading the reels for {user.displayName}.</h1>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.pageShell}>
      <SlotMachineGrid
        displayedGrid={displayedGrid}
        isSpinning={isSpinning}
        slotMachineState={slotMachineState}
        theme={classicGoldTheme}
      />
      <SlotMachineStats
        isSpinning={isSpinning}
        onLogout={onLogout}
        onSpin={handleSpin}
        slotMachineState={slotMachineState}
        statusMessage={statusMessage}
        userDisplayName={user.displayName}
      />
    </main>
  );
}

/**
 * Creates a random visual grid used during reel-spin animation.
 *
 * @returns {SlotMachineState['grid']} Temporary animation grid.
 */
function createPreviewGrid(): SlotMachineState['grid'] {
  return Array.from({ length: 3 }, () =>
    Array.from(
      { length: 5 },
      () => previewSymbols[Math.floor(Math.random() * previewSymbols.length)]
    )
  );
}

/**
 * Replaces one column in the current grid with the final spin result.
 *
 * @param {SlotMachineState['grid']} currentGrid - Current visible grid.
 * @param {SlotMachineState['grid']} finalGrid - Final backend grid.
 * @param {number} columnIndex - Column index to reveal.
 * @returns {SlotMachineState['grid']} Updated grid with the revealed column.
 */
function replaceGridColumn(
  currentGrid: SlotMachineState['grid'],
  finalGrid: SlotMachineState['grid'],
  columnIndex: number
) {
  return currentGrid.map((row, rowIndex) =>
    row.map((symbol, currentColumnIndex) =>
      currentColumnIndex === columnIndex ? finalGrid[rowIndex][columnIndex] : symbol
    )
  );
}

/**
 * Maps slot-machine results into player-facing status messages.
 *
 * @param {SlotMachineState} state - Final slot-machine state.
 * @returns {string} Status message shown below the machine.
 */
function resolveOutcomeMessage(state: SlotMachineState) {
  if (state.outcome === 'win') {
    return `Win! ${state.winningLines.length} payline${state.winningLines.length > 1 ? 's' : ''} connected for ${state.lastPayout}.`;
  }

  if (state.outcome === 'near-miss') {
    return 'Near miss. Two symbols lined up early, but the payline broke before a win.';
  }

  return 'No payout this round. Losses move fast so the next spin stays front and center.';
}

/**
 * Waits for the provided duration in milliseconds.
 *
 * @param {number} durationInMilliseconds - Delay duration.
 * @returns {Promise<void>} Promise resolved after the delay completes.
 */
function pause(durationInMilliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, durationInMilliseconds);
  });
}
