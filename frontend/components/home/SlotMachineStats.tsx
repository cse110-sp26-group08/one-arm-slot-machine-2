import { useEffect, useState } from 'react';

import styles from '../../pages/HomePage.module.css';
import type { AudioSettings, SoundtrackOption } from '../../services/celebration-audio.js';
import type { SlotMachineState, SoundtrackId } from '../../services/slot-machine-client.js';

interface SlotMachineStatsProps {
  audioSettings: AudioSettings;
  isUpdatingBet: boolean;
  isSpinning: boolean;
  onBetAmountChange: (nextBetAmount: number) => void | Promise<void>;
  onMusicMuteToggle: () => void | Promise<void>;
  onMusicVolumeChange: (nextVolume: number) => void | Promise<void>;
  onOpenLeaderboard: () => void;
  onOpenPrizePage: () => void;
  onLogout: () => void;
  onPlayButtonSound: () => void | Promise<void>;
  onSoundEffectsMuteToggle: () => void | Promise<void>;
  onSoundEffectsVolumeChange: (nextVolume: number) => void | Promise<void>;
  onSoundtrackChange: (soundtrackId: SoundtrackId) => void | Promise<void>;
  onSpin: () => void | Promise<void>;
  statusMessage: string;
  soundtrackOptions: SoundtrackOption[];
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
  audioSettings,
  isUpdatingBet,
  isSpinning,
  onBetAmountChange,
  onMusicMuteToggle,
  onMusicVolumeChange,
  onOpenLeaderboard,
  onOpenPrizePage,
  onLogout,
  onPlayButtonSound,
  onSoundEffectsMuteToggle,
  onSoundEffectsVolumeChange,
  onSoundtrackChange,
  onSpin,
  statusMessage,
  soundtrackOptions,
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

  async function handleButtonAction(action: () => void | Promise<void>) {
    await onPlayButtonSound();
    await action();
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
        onClick={() => {
          void handleButtonAction(onSpin);
        }}
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
      <button
        className={styles.exitButton}
        onClick={() => {
          void handleButtonAction(onLogout);
        }}
        type="button"
      >
        Exit floor
      </button>
      <button
        className={styles.exitButton}
        onClick={() => {
          void handleButtonAction(onOpenLeaderboard);
        }}
        type="button"
      >
        Leaderboard
      </button>
      <button
        className={styles.exitButton}
        onClick={() => {
          void handleButtonAction(onOpenPrizePage);
        }}
        type="button"
      >
        Prize vault
      </button>
      <div className={styles.audioDock}>
        <div className={styles.audioControl}>
          <span className={styles.statsLabel}>Music</span>
          <div className={styles.audioControlRow}>
            <button
              className={styles.audioMuteButton}
              onClick={() => {
                void handleButtonAction(onMusicMuteToggle);
              }}
              type="button"
            >
              {audioSettings.musicMuted ? 'Unmute' : 'Mute'}
            </button>
            <input
              aria-label="Music volume"
              className={styles.volumeSlider}
              max="100"
              min="0"
              onChange={(event) => {
                void onMusicVolumeChange(Number(event.target.value) / 100);
              }}
              type="range"
              value={Math.round(audioSettings.musicVolume * 100)}
            />
          </div>
        </div>
        <div className={styles.audioControl}>
          <span className={styles.statsLabel}>Soundtrack</span>
          <select
            className={styles.soundtrackSelect}
            onChange={(event) => {
              void onSoundtrackChange(event.target.value as SoundtrackId);
            }}
            value={slotMachineState.prizes.selectedSoundtrackId}
          >
            {soundtrackOptions.map((soundtrackOption) => (
              <option key={soundtrackOption.id} value={soundtrackOption.id}>
                {soundtrackOption.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.audioControl}>
          <span className={styles.statsLabel}>Sound effects</span>
          <div className={styles.audioControlRow}>
            <button
              className={styles.audioMuteButton}
              onClick={() => {
                void handleButtonAction(onSoundEffectsMuteToggle);
              }}
              type="button"
            >
              {audioSettings.soundEffectsMuted ? 'Unmute' : 'Mute'}
            </button>
            <input
              aria-label="Sound effects volume"
              className={styles.volumeSlider}
              max="100"
              min="0"
              onChange={(event) => {
                void onSoundEffectsVolumeChange(Number(event.target.value) / 100);
              }}
              type="range"
              value={Math.round(audioSettings.soundEffectsVolume * 100)}
            />
          </div>
        </div>
      </div>
      <div className={styles.statusBanner}>{statusMessage}</div>
    </section>
  );
}
