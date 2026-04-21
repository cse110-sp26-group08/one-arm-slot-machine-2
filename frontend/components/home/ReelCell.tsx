import styles from '../../pages/HomePage.module.css';
import type { SlotSymbol } from '../../services/slot-machine-client.js';
import type { SlotMachineTheme } from './slot-theme.js';

interface ReelCellProps {
  isSpinning: boolean;
  isWinning: boolean;
  spinDelayMilliseconds: number;
  symbol: SlotSymbol;
  theme: SlotMachineTheme;
}

/**
 * Displays one slot-machine reel cell using the active theme symbol mapping.
 *
 * @param {ReelCellProps} props - Reel cell props.
 * @returns {JSX.Element} Reel cell UI.
 */
export function ReelCell({
  isSpinning,
  isWinning,
  spinDelayMilliseconds,
  symbol,
  theme
}: ReelCellProps) {
  return (
    <div
      className={[
        styles.reelCell,
        isSpinning ? styles.reelCellSpinning : '',
        isWinning ? styles.reelCellWinning : ''
      ].join(' ')}
      style={{ animationDelay: `${spinDelayMilliseconds}ms` }}
    >
      <span className={styles.reelSymbol}>{theme.symbolMap[symbol]}</span>
      <span className={styles.reelLabel}>{symbol}</span>
    </div>
  );
}
