import { useEffect, useState } from 'react';

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
  const [betInputValue, setBetInputValue] = useState(String(slotMachineState.stats.currentBetAmount));
  const canSpin =
    !isSpinning &&
    !isUpdatingBet &&
    slotMachineState.stats.currentBetAmount <= slotMachineState.stats.totalBalance;
  const isBetInputDisabled = isSpinning || isUpdatingBet;

  useEffect(() => {
    setBetInputValue(String(slotMachineState.stats.currentBetAmount));
  }, [slotMachineState.stats.currentBetAmount]);

  async function commitBetAmountChange() {
    const trimmedValue = betInputValue.trim();

    if (!trimmedValue) {
      setBetInputValue(String(slotMachineState.stats.currentBetAmount));
      return;
    }

    const parsedBetAmount = Number.parseInt(trimmedValue, 10);

    if (Number.isNaN(parsedBetAmount)) {
      setBetInputValue(String(slotMachineState.stats.currentBetAmount));
      return;
    }

    if (parsedBetAmount === slotMachineState.stats.currentBetAmount) {
      setBetInputValue(String(parsedBetAmount));
      return;
    }

    await onBetAmountChange(parsedBetAmount);
  }

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
          <input
            aria-label="Current bet amount"
            className={styles.betInput}
            disabled={isBetInputDisabled}
            inputMode="numeric"
            min="1"
            onBlur={() => {
              void commitBetAmountChange();
            }}
            onChange={(event) => {
              setBetInputValue(event.target.value.replace(/[^\d]/g, ''));
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.currentTarget.blur();
              }

              if (event.key === 'Escape') {
                setBetInputValue(String(slotMachineState.stats.currentBetAmount));
                event.currentTarget.blur();
              }
            }}
            type="text"
            value={betInputValue}
          />
        </div>
      </div>
      <div className={styles.compassColumn} aria-hidden="true">
        <div className={styles.compassIcon}>
          <span className={styles.compassNeedle} />
          <span className={styles.compassCenter} />
          <span className={styles.compassLetterNorth}>N</span>
          <span className={styles.compassLetterEast}>E</span>
          <span className={styles.compassLetterSouth}>S</span>
          <span className={styles.compassLetterWest}>W</span>
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
