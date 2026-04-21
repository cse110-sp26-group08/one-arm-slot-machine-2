import styles from '../../pages/HomePage.module.css';
import type { SlotMachineState } from '../../services/slot-machine-client.js';
import { ReelCell } from './ReelCell.js';
import type { SlotMachineTheme } from './slot-theme.js';

interface SlotMachineGridProps {
  displayedGrid: SlotMachineState['grid'];
  isSpinning: boolean;
  slotMachineState: SlotMachineState;
  theme: SlotMachineTheme;
}

/**
 * Renders the 3x5 slot-machine reel grid.
 *
 * @param {SlotMachineGridProps} props - Grid props.
 * @returns {JSX.Element} Slot-machine grid UI.
 */
export function SlotMachineGrid({
  displayedGrid,
  isSpinning,
  slotMachineState,
  theme
}: SlotMachineGridProps) {
  const winningPositions = new Set(
    slotMachineState.winningLines.flatMap((winningLine) =>
      winningLine.path
        .slice(0, winningLine.matchingCount)
        .map((rowIndex, columnIndex) => `${rowIndex}-${columnIndex}`)
    )
  );

  return (
    <section className={styles.machineFrame}>
      <div className={styles.machineHeading}>
        <div>
          <p className={styles.eyebrow}>{theme.accentLabel}</p>
          <h1 className={styles.machineTitle}>{theme.machineName}</h1>
        </div>
        <div className={styles.payoutBadge}>
          {slotMachineState.outcome === 'win'
            ? `Win ${slotMachineState.lastPayout}`
            : slotMachineState.outcome === 'near-miss'
              ? 'Near miss'
              : `Last payout: ${slotMachineState.lastPayout}`}
        </div>
      </div>
      <div className={styles.reelMatrix}>
        {displayedGrid.flatMap((row, rowIndex) =>
          row.map((symbol, columnIndex) => (
            <ReelCell
              isSpinning={isSpinning}
              isWinning={!isSpinning && winningPositions.has(`${rowIndex}-${columnIndex}`)}
              key={`${rowIndex}-${columnIndex}-${symbol}`}
              spinDelayMilliseconds={columnIndex * 160}
              symbol={symbol}
              theme={theme}
            />
          ))
        )}
      </div>
      <div className={styles.machineMeta}>
        <div className={styles.metaBlock}>
          <span className={styles.metaLabel}>Paylines</span>
          <span className={styles.metaValue}>5 active lines</span>
        </div>
        <div className={styles.metaBlock}>
          <span className={styles.metaLabel}>Rules</span>
          <span className={styles.metaValue}>3+ matches from the left. Wilds substitute.</span>
        </div>
        <div className={styles.metaBlock}>
          <span className={styles.metaLabel}>Animation</span>
          <span className={styles.metaValue}>
            {isSpinning ? 'Columns stop one by one.' : 'Idle glow keeps focus on the play button.'}
          </span>
        </div>
      </div>
    </section>
  );
}
