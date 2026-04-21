import styles from '../../pages/HomePage.module.css';
import type { SlotMachineState } from '../../services/slot-machine-client.js';
import { ReelCell } from './ReelCell.js';
import type { SlotMachineTheme } from './slot-theme.js';

interface SlotMachineGridProps {
  slotMachineState: SlotMachineState;
  theme: SlotMachineTheme;
}

/**
 * Renders the 3x5 slot-machine reel grid.
 *
 * @param {SlotMachineGridProps} props - Grid props.
 * @returns {JSX.Element} Slot-machine grid UI.
 */
export function SlotMachineGrid({ slotMachineState, theme }: SlotMachineGridProps) {
  return (
    <section className={styles.machineFrame}>
      <div className={styles.machineHeading}>
        <div>
          <p className={styles.eyebrow}>{theme.accentLabel}</p>
          <h1 className={styles.machineTitle}>{theme.machineName}</h1>
        </div>
        <div className={styles.payoutBadge}>Last payout: {slotMachineState.lastPayout}</div>
      </div>
      <div className={styles.reelMatrix}>
        {slotMachineState.grid.flatMap((row, rowIndex) =>
          row.map((symbol, columnIndex) => (
            <ReelCell
              key={`${rowIndex}-${columnIndex}-${symbol}`}
              symbol={symbol}
              theme={theme}
            />
          ))
        )}
      </div>
    </section>
  );
}
