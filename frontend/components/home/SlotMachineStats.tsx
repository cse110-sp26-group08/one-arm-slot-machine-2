import styles from '../../pages/HomePage.module.css';
import type { SlotMachineState } from '../../services/slot-machine-client.js';

interface SlotMachineStatsProps {
  isSpinning: boolean;
  onLogout: () => void;
  onSpin: () => void | Promise<void>;
  statusMessage: string;
  slotMachineState: SlotMachineState;
  userDisplayName: string;
}

/**
 * Displays game stats and the primary play action beneath the machine.
 *
 * @param {SlotMachineStatsProps} props - Stats panel props.
 * @returns {JSX.Element} Stats and controls UI.
 */
export function SlotMachineStats({
  isSpinning,
  onLogout,
  onSpin,
  statusMessage,
  slotMachineState,
  userDisplayName
}: SlotMachineStatsProps) {
  return (
    <section className={styles.statsBar}>
      <div className={styles.statsColumn}>
        <span className={styles.statsLabel}>Player</span>
        <strong className={styles.statsValue}>{userDisplayName}</strong>
      </div>
      <div className={styles.statsColumn}>
        <span className={styles.statsLabel}>Total balance</span>
        <strong className={styles.statsValue}>{slotMachineState.stats.totalBalance}</strong>
      </div>
      <button
        className={`${styles.spinButton} ${isSpinning ? styles.spinButtonBusy : ''}`}
        disabled={isSpinning}
        onClick={() => void onSpin()}
        type="button"
      >
        {isSpinning ? 'Spinning...' : 'Spin'}
      </button>
      <div className={styles.statsColumn}>
        <span className={styles.statsLabel}>Current bet</span>
        <strong className={styles.statsValue}>{slotMachineState.stats.currentBetAmount}</strong>
      </div>
      <div className={styles.statsColumn}>
        <span className={styles.statsLabel}>Number of spins</span>
        <strong className={styles.statsValue}>{slotMachineState.stats.numberOfSpins}</strong>
      </div>
      <button className={styles.exitButton} onClick={onLogout} type="button">
        Exit floor
      </button>
      <div className={styles.statusBanner}>{statusMessage}</div>
    </section>
  );
}
