import styles from '../../pages/HomePage.module.css';
import type { SlotMachineState } from '../../services/slot-machine-client.js';

interface SlotMachineStatsProps {
  isUpdatingBet: boolean;
  isSpinning: boolean;
  onBetAmountChange: (nextBetAmount: number) => void | Promise<void>;
  onOpenLeaderboard: () => void;
  onOpenPrizePage: () => void;
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
  isUpdatingBet,
  isSpinning,
  onBetAmountChange,
  onOpenLeaderboard,
  onOpenPrizePage,
  onLogout,
  onSpin,
  statusMessage,
  slotMachineState,
  userDisplayName
}: SlotMachineStatsProps) {
  const canIncreaseBet =
    !isSpinning &&
    !isUpdatingBet &&
    slotMachineState.stats.currentBetAmount < slotMachineState.stats.totalBalance;
  const canDecreaseBet =
    !isSpinning && !isUpdatingBet && slotMachineState.stats.currentBetAmount > 1;
  const canSpin =
    !isSpinning &&
    !isUpdatingBet &&
    slotMachineState.stats.currentBetAmount <= slotMachineState.stats.totalBalance;

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
        disabled={!canSpin}
        onClick={() => void onSpin()}
        type="button"
      >
        {isSpinning ? 'Spinning...' : 'Spin'}
      </button>
      <div className={styles.statsColumn}>
        <span className={styles.statsLabel}>Current bet</span>
        <div className={styles.betControl}>
          <button
            className={styles.betStepper}
            disabled={!canDecreaseBet}
            onClick={() => void onBetAmountChange(slotMachineState.stats.currentBetAmount - 1)}
            type="button"
          >
            -
          </button>
          <strong className={styles.statsValue}>{slotMachineState.stats.currentBetAmount}</strong>
          <button
            className={styles.betStepper}
            disabled={!canIncreaseBet}
            onClick={() => void onBetAmountChange(slotMachineState.stats.currentBetAmount + 1)}
            type="button"
          >
            +
          </button>
        </div>
      </div>
      <div className={styles.statsColumn}>
        <span className={styles.statsLabel}>Number of spins</span>
        <strong className={styles.statsValue}>{slotMachineState.stats.numberOfSpins}</strong>
      </div>
      <button className={styles.exitButton} onClick={onLogout} type="button">
        Exit floor
      </button>
      <button className={styles.exitButton} onClick={onOpenLeaderboard} type="button">
        Leaderboard
      </button>
      <button className={styles.exitButton} onClick={onOpenPrizePage} type="button">
        Prize vault
      </button>
      <div className={styles.statusBanner}>{statusMessage}</div>
    </section>
  );
}
