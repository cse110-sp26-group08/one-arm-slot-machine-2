import { useEffect, useRef, useState, type MutableRefObject } from 'react';

import {
  resolveSlotMachineAnimationState,
  resolveWinAnimationTier
} from '../components/home/animation-state.js';
import { createCelebrationParticles, getWinAnnouncement } from '../components/home/celebration.js';
import { SlotMachineGrid } from '../components/home/SlotMachineGrid.js';
import { SlotMachineStats } from '../components/home/SlotMachineStats.js';
import { WinCelebration } from '../components/home/WinCelebration.js';
import { pirateTreasureTheme } from '../components/home/slot-theme.js';
import {
  clampAudioVolume,
  getSoundtrackOptions,
  initializePirateAudio,
  loadAudioSettings,
  playButtonTapSound,
  playLossSound,
  playWinJingle,
  saveAudioSettings,
  startWheelSpinSound,
  stopWheelSpinSound,
  syncPirateAudioSettings,
  type AudioSettings
} from '../services/celebration-audio.js';
import {
  fetchSlotMachineState,
  spinSlotMachine,
  updateSlotMachineSoundtrack,
  updateSlotMachineBetAmount,
  type SoundtrackId,
  type SlotMachineState,
  type SlotSymbol
} from '../services/slot-machine-client.js';
import type { AuthenticatedUser } from '../services/auth-client.js';
import styles from './HomePage.module.css';

interface HomePageProps {
  onOpenLeaderboard: (currentBalance: number) => void;
  onOpenPrizePage: (currentBalance: number) => void;
  onLogout: () => void;
  onStateBalanceChange: (currentBalance: number) => void;
  user: AuthenticatedUser;
}

const previewSymbols: SlotSymbol[] = ['seven', 'diamond', 'bar', 'cherry', 'bell', 'horseshoe', 'wild'];
const revealDelayInMilliseconds = 190;
const celebrationDurationInMilliseconds = 3400;
const settleAnimationDurationInMilliseconds = 420;

/**
 * Home page containing the connected slot-machine experience.
 *
 * @param {HomePageProps} props - Home page props.
 * @returns {JSX.Element} Home page UI.
 */
export function HomePage({
  onLogout,
  onOpenLeaderboard,
  onOpenPrizePage,
  onStateBalanceChange,
  user
}: HomePageProps) {
  const [slotMachineState, setSlotMachineState] = useState<SlotMachineState | null>(null);
  const [displayedGrid, setDisplayedGrid] = useState<SlotMachineState['grid'] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isUpdatingBet, setIsUpdatingBet] = useState(false);
  const [settlingColumnIndexes, setSettlingColumnIndexes] = useState<number[]>([]);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => loadAudioSettings());
  const [statusMessage, setStatusMessage] = useState(
    'The pirate deck is loaded. Five treasure lines are ready whenever you spin.'
  );
  const [isCelebratingWin, setIsCelebratingWin] = useState(false);
  const [winAnnouncement, setWinAnnouncement] = useState('');
  const celebrationTimeoutRef = useRef<number | null>(null);
  const celebrationTheme = slotMachineState?.winCelebrationTheme ?? 'classic';
  const celebrationParticles = createCelebrationParticles(celebrationTheme);
  const animationState = slotMachineState
    ? resolveSlotMachineAnimationState(slotMachineState, isSpinning)
    : 'idle';
  const ownedSoundtrackIds = slotMachineState?.prizes.ownedSoundtrackIds ?? [];
  const unlockedSoundtrackOptions = getSoundtrackOptions().filter(
    (soundtrackOption) =>
      soundtrackOption.isUnlockedByDefault ||
      ownedSoundtrackIds.includes(soundtrackOption.id as Exclude<SoundtrackId, 'default-theme'>)
  );

  useEffect(() => {
    void hydrateSlotMachineState();
  }, []);

  useEffect(() => {
    saveAudioSettings(audioSettings);
    syncPirateAudioSettings(
      audioSettings,
      slotMachineState?.prizes.selectedSoundtrackId ?? 'default-theme'
    );
  }, [audioSettings, slotMachineState?.prizes.selectedSoundtrackId]);

  useEffect(() => {
    const activateAudio = () => {
      void initializePirateAudio(
        audioSettings,
        slotMachineState?.prizes.selectedSoundtrackId ?? 'default-theme'
      );
      window.removeEventListener('pointerdown', activateAudio);
      window.removeEventListener('keydown', activateAudio);
    };

    window.addEventListener('pointerdown', activateAudio);
    window.addEventListener('keydown', activateAudio);

    return () => {
      window.removeEventListener('pointerdown', activateAudio);
      window.removeEventListener('keydown', activateAudio);
    };
  }, [audioSettings, slotMachineState?.prizes.selectedSoundtrackId]);

  function dismissCelebration() {
    clearCelebration(celebrationTimeoutRef, setIsCelebratingWin);
  }

  useEffect(() => {
    return () => {
      if (celebrationTimeoutRef.current) {
        window.clearTimeout(celebrationTimeoutRef.current);
      }
    };
  }, []);

  async function hydrateSlotMachineState() {
    const currentState = await fetchSlotMachineState();
    setSlotMachineState(currentState);
    setDisplayedGrid(currentState.grid);
    setSettlingColumnIndexes([]);
    onStateBalanceChange(currentState.stats.totalBalance);
  }

  async function handleSpin() {
    if (!slotMachineState || !displayedGrid || isSpinning) {
      return;
    }

    dismissCelebration();
    await initializePirateAudio(audioSettings, slotMachineState.prizes.selectedSoundtrackId);
    setIsSpinning(true);
    setStatusMessage('The reels are rolling through the tide and will settle from port to starboard.');
    const previewInterval = window.setInterval(() => {
      setDisplayedGrid(createPreviewGrid());
    }, 90);
    const expectedSpinDuration =
      nextRevealDurationInMilliseconds((displayedGrid[0]?.length ?? 3), revealDelayInMilliseconds) +
      220;
    await startWheelSpinSound(expectedSpinDuration);

    try {
      const nextState = await spinSlotMachine();

      window.clearInterval(previewInterval);

      for (let columnIndex = 0; columnIndex < nextState.grid[0].length; columnIndex += 1) {
        await pause(revealDelayInMilliseconds);
        setDisplayedGrid((currentGrid) => replaceGridColumn(currentGrid ?? nextState.grid, nextState.grid, columnIndex));
        triggerSettlingColumnAnimation(columnIndex, setSettlingColumnIndexes);
      }

      setSlotMachineState(nextState);
      setDisplayedGrid(nextState.grid);
      onStateBalanceChange(nextState.stats.totalBalance);
      setStatusMessage(resolveOutcomeMessage(nextState));

      if (nextState.outcome === 'win') {
        const announcement = getWinAnnouncement(nextState);
        setWinAnnouncement(announcement);
        setIsCelebratingWin(true);
        await playWinJingle(nextState);

        if (celebrationTimeoutRef.current) {
          window.clearTimeout(celebrationTimeoutRef.current);
        }

        celebrationTimeoutRef.current = window.setTimeout(() => {
          celebrationTimeoutRef.current = null;
          setIsCelebratingWin(false);
        }, celebrationDurationInMilliseconds);
      } else {
        await playLossSound();
      }
    } catch (error) {
      setStatusMessage(resolveActionErrorMessage(error, 'Spin could not start.'));
      await hydrateSlotMachineState();
    } finally {
      window.clearInterval(previewInterval);
      stopWheelSpinSound();
      setIsSpinning(false);
    }
  }

  async function handleBetAmountChange(nextBetAmount: number) {
    if (!slotMachineState || isSpinning || isUpdatingBet) {
      return;
    }

    setIsUpdatingBet(true);

    try {
      const nextState = await updateSlotMachineBetAmount(nextBetAmount);
      setSlotMachineState(nextState);
      onStateBalanceChange(nextState.stats.totalBalance);
      setStatusMessage(
        `Bet updated to ${nextState.stats.currentBetAmount}. Balance available: ${nextState.stats.totalBalance}.`
      );
    } catch (error) {
      setStatusMessage(resolveActionErrorMessage(error, 'Bet amount was not updated.'));
      await hydrateSlotMachineState();
    } finally {
      setIsUpdatingBet(false);
    }
  }

  async function handleButtonTap() {
    await initializePirateAudio(audioSettings, slotMachineState?.prizes.selectedSoundtrackId ?? 'default-theme');
    await playButtonTapSound();
  }

  async function handleSoundtrackChange(soundtrackId: SoundtrackId) {
    if (!slotMachineState) {
      return;
    }

    const nextState = await updateSlotMachineSoundtrack(soundtrackId);
    setSlotMachineState(nextState);
    await initializePirateAudio(audioSettings, nextState.prizes.selectedSoundtrackId);
    syncPirateAudioSettings(audioSettings, nextState.prizes.selectedSoundtrackId);
    setStatusMessage(`Soundtrack set to ${resolveSoundtrackLabel(soundtrackId)}.`);
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
      <WinCelebration
        announcement={winAnnouncement}
        animationTier={slotMachineState ? resolveWinAnimationTier(slotMachineState) : 'win'}
        confettiParticles={celebrationParticles}
        isVisible={isCelebratingWin}
        onDismiss={dismissCelebration}
        theme={celebrationTheme}
      />
      <SlotMachineGrid
        animationState={animationState}
        displayedGrid={displayedGrid}
        isSpinning={isSpinning}
        settlingColumnIndexes={settlingColumnIndexes}
        slotMachineState={slotMachineState}
        theme={pirateTreasureTheme}
      />
      <SlotMachineStats
        audioSettings={audioSettings}
        isUpdatingBet={isUpdatingBet}
        isSpinning={isSpinning}
        onBetAmountChange={handleBetAmountChange}
        onMusicMuteToggle={() => {
          setAudioSettings((currentSettings) => ({
            ...currentSettings,
            musicMuted: !currentSettings.musicMuted
          }));
        }}
        onMusicVolumeChange={(nextVolume) => {
          setAudioSettings((currentSettings) => ({
            ...currentSettings,
            musicVolume: clampAudioVolume(nextVolume),
            musicMuted: false
          }));
        }}
        onOpenPrizePage={() => onOpenPrizePage(slotMachineState.stats.totalBalance)}
        onOpenLeaderboard={() => onOpenLeaderboard(slotMachineState.stats.totalBalance)}
        onLogout={onLogout}
        onPlayButtonSound={handleButtonTap}
        onSoundEffectsMuteToggle={() => {
          setAudioSettings((currentSettings) => ({
            ...currentSettings,
            soundEffectsMuted: !currentSettings.soundEffectsMuted
          }));
        }}
        onSoundEffectsVolumeChange={(nextVolume) => {
          setAudioSettings((currentSettings) => ({
            ...currentSettings,
            soundEffectsVolume: clampAudioVolume(nextVolume),
            soundEffectsMuted: false
          }));
        }}
        onSoundtrackChange={handleSoundtrackChange}
        onSpin={handleSpin}
        soundtrackOptions={unlockedSoundtrackOptions}
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
      { length: 3 },
      () => previewSymbols[Math.floor(Math.random() * previewSymbols.length)]
    )
  );
}

/**
 * Marks a reel column as settling so the final stop can bounce into place.
 *
 * @param {number} columnIndex - Revealed reel column.
 * @param {(value: number[] | ((currentColumns: number[]) => number[])) => void} setSettlingColumnIndexes - Settling column setter.
 */
function triggerSettlingColumnAnimation(
  columnIndex: number,
  setSettlingColumnIndexes: (
    value: number[] | ((currentColumns: number[]) => number[])
  ) => void
) {
  setSettlingColumnIndexes((currentColumns) =>
    currentColumns.includes(columnIndex) ? currentColumns : [...currentColumns, columnIndex]
  );

  window.setTimeout(() => {
    setSettlingColumnIndexes((currentColumns) =>
      currentColumns.filter((currentColumnIndex) => currentColumnIndex !== columnIndex)
    );
  }, settleAnimationDurationInMilliseconds);
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

  return 'No treasure this round. Reset the wheel and send the next crew across the reels.';
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

/**
 * Returns the rough spin-sound duration based on the column reveal cadence.
 *
 * @param {number} columnCount - Number of reel columns.
 * @param {number} revealDelayPerColumnInMilliseconds - Delay between column reveals.
 * @returns {number} Expected spin duration.
 */
function nextRevealDurationInMilliseconds(
  columnCount: number,
  revealDelayPerColumnInMilliseconds: number
) {
  return columnCount * revealDelayPerColumnInMilliseconds;
}

function resolveSoundtrackLabel(soundtrackId: SoundtrackId) {
  if (soundtrackId === 'default-theme') {
    return 'Default deck';
  }

  if (soundtrackId === 'black-flag-theme') {
    return 'Black Flag March';
  }

  return 'Pirate Adventure';
}

/**
 * Extracts a readable message from failed frontend slot-machine actions.
 *
 * @param {unknown} error - Thrown error value.
 * @param {string} fallbackMessage - Message to use when the error is not readable.
 * @returns {string} Player-facing error copy.
 */
function resolveActionErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}

/**
 * Clears the win celebration overlay and any pending timeout.
 *
 * @param {MutableRefObject<number | null>} celebrationTimeoutRef - Pending celebration timeout ref.
 * @param {(value: boolean) => void} setIsCelebratingWin - Celebration visibility setter.
 */
function clearCelebration(
  celebrationTimeoutRef: MutableRefObject<number | null>,
  setIsCelebratingWin: (value: boolean) => void
) {
  if (celebrationTimeoutRef.current) {
    window.clearTimeout(celebrationTimeoutRef.current);
    celebrationTimeoutRef.current = null;
  }

  setIsCelebratingWin(false);
}
