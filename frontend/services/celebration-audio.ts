import type { SlotMachineState } from './slot-machine-client.js';

const AUDIO_SETTINGS_STORAGE_KEY = 'pirate-slot-audio-settings';

export interface AudioSettings {
  musicMuted: boolean;
  musicVolume: number;
  soundEffectsMuted: boolean;
  soundEffectsVolume: number;
}

export type WinSoundTier = 'small' | 'medium' | 'jackpot';

const defaultAudioSettings: AudioSettings = {
  musicVolume: 0.22,
  soundEffectsVolume: 0.7,
  musicMuted: false,
  soundEffectsMuted: false
};

let pirateAudioEngine: PirateAudioEngine | null = null;

/**
 * Returns the default audio settings for the pirate machine.
 *
 * @returns {AudioSettings} Default audio settings.
 */
export function createDefaultAudioSettings() {
  return { ...defaultAudioSettings };
}

/**
 * Clamps an audio volume into the supported 0..1 range.
 *
 * @param {number} value - Requested audio volume.
 * @returns {number} Clamped audio volume.
 */
export function clampAudioVolume(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

/**
 * Normalizes persisted audio settings into a safe runtime shape.
 *
 * @param {unknown} settings - Unknown persisted settings.
 * @returns {AudioSettings} Normalized audio settings.
 */
export function sanitizeAudioSettings(settings: unknown): AudioSettings {
  if (!settings || typeof settings !== 'object') {
    return createDefaultAudioSettings();
  }

  const candidate = settings as Partial<AudioSettings>;

  return {
    musicMuted: candidate.musicMuted ?? defaultAudioSettings.musicMuted,
    musicVolume: clampAudioVolume(candidate.musicVolume ?? defaultAudioSettings.musicVolume),
    soundEffectsMuted: candidate.soundEffectsMuted ?? defaultAudioSettings.soundEffectsMuted,
    soundEffectsVolume: clampAudioVolume(
      candidate.soundEffectsVolume ?? defaultAudioSettings.soundEffectsVolume
    )
  };
}

/**
 * Loads persisted pirate audio settings from local storage.
 *
 * @returns {AudioSettings} Current stored or default settings.
 */
export function loadAudioSettings() {
  if (typeof window === 'undefined') {
    return createDefaultAudioSettings();
  }

  try {
    const storedSettings = window.localStorage.getItem(AUDIO_SETTINGS_STORAGE_KEY);

    if (!storedSettings) {
      return createDefaultAudioSettings();
    }

    return sanitizeAudioSettings(JSON.parse(storedSettings));
  } catch {
    return createDefaultAudioSettings();
  }
}

/**
 * Persists pirate audio settings locally for the next visit.
 *
 * @param {AudioSettings} settings - Settings to persist.
 */
export function saveAudioSettings(settings: AudioSettings) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    AUDIO_SETTINGS_STORAGE_KEY,
    JSON.stringify(sanitizeAudioSettings(settings))
  );
}

/**
 * Resolves the pirate win-sound tier from a finished slot-machine state.
 *
 * @param {SlotMachineState} state - Finished slot-machine state.
 * @returns {WinSoundTier} Tier describing the win intensity.
 */
export function resolveWinSoundTier(state: SlotMachineState): WinSoundTier {
  const payoutRatio = state.lastPayout / Math.max(1, state.stats.currentBetAmount);

  if (payoutRatio >= 10 || state.lastPayout >= 500) {
    return 'jackpot';
  }

  if (payoutRatio >= 5 || state.lastPayout >= 150) {
    return 'medium';
  }

  return 'small';
}

/**
 * Starts the pirate music engine if audio is supported.
 *
 * @param {AudioSettings} settings - Current audio settings.
 * @returns {Promise<void>} Promise resolved after initialization work.
 */
export async function initializePirateAudio(settings: AudioSettings) {
  const engine = getPirateAudioEngine();

  if (!engine) {
    return;
  }

  await engine.initialize(settings);
}

/**
 * Applies new pirate audio settings to the shared audio engine.
 *
 * @param {AudioSettings} settings - Current audio settings.
 */
export function syncPirateAudioSettings(settings: AudioSettings) {
  const engine = getPirateAudioEngine();

  if (!engine) {
    return;
  }

  engine.applySettings(settings);
}

/**
 * Plays the pirate button-tap sound.
 *
 * @returns {Promise<void>} Promise resolved after the sound has been scheduled.
 */
export async function playButtonTapSound() {
  const engine = getPirateAudioEngine();

  if (!engine) {
    return;
  }

  await engine.playButtonTap();
}

/**
 * Starts the wooden wheel ticking loop for the active spin.
 *
 * @param {number} durationInMilliseconds - Expected spin duration.
 * @returns {Promise<void>} Promise resolved after the ticking loop has started.
 */
export async function startWheelSpinSound(durationInMilliseconds: number) {
  const engine = getPirateAudioEngine();

  if (!engine) {
    return;
  }

  await engine.startWheelSpin(durationInMilliseconds);
}

/**
 * Stops any currently playing wheel-spin sound.
 */
export function stopWheelSpinSound() {
  const engine = getPirateAudioEngine();

  if (!engine) {
    return;
  }

  engine.stopWheelSpin();
}

/**
 * Plays the pirate loss sound.
 *
 * @returns {Promise<void>} Promise resolved after the sound has been scheduled.
 */
export async function playLossSound() {
  const engine = getPirateAudioEngine();

  if (!engine) {
    return;
  }

  await engine.playLoss();
}

/**
 * Plays the pirate win sound based on the current payout tier.
 *
 * @param {SlotMachineState} state - Finished slot-machine state.
 * @returns {Promise<void>} Promise resolved after the sound has been scheduled.
 */
export async function playWinJingle(state: SlotMachineState) {
  const engine = getPirateAudioEngine();

  if (!engine) {
    return;
  }

  await engine.playWin(resolveWinSoundTier(state));
}

/**
 * Returns the shared pirate audio engine when Web Audio is available.
 *
 * @returns {PirateAudioEngine | null} Shared audio engine instance.
 */
function getPirateAudioEngine() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!pirateAudioEngine) {
    pirateAudioEngine = new PirateAudioEngine();
  }

  return pirateAudioEngine;
}

class PirateAudioEngine {
  private audioContext: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private soundEffectsGainNode: GainNode | null = null;
  private musicStarted = false;
  private musicSchedulerId: number | null = null;
  private nextMusicTime = 0;
  private spinTimeoutId: number | null = null;
  private spinToken = 0;
  private settings = createDefaultAudioSettings();

  async initialize(settings: AudioSettings) {
    this.settings = sanitizeAudioSettings(settings);
    await this.ensureAudioContext();
    this.applySettings(this.settings);
    this.startMusicLoop();
  }

  applySettings(settings: AudioSettings) {
    this.settings = sanitizeAudioSettings(settings);

    if (this.musicGainNode) {
      this.musicGainNode.gain.setTargetAtTime(
        this.settings.musicMuted ? 0.0001 : this.settings.musicVolume,
        this.audioContext?.currentTime ?? 0,
        0.08
      );
    }

    if (this.soundEffectsGainNode) {
      this.soundEffectsGainNode.gain.setTargetAtTime(
        this.settings.soundEffectsMuted ? 0.0001 : this.settings.soundEffectsVolume,
        this.audioContext?.currentTime ?? 0,
        0.04
      );
    }
  }

  async playButtonTap() {
    await this.ensureAudioContext();

    if (!this.audioContext || !this.soundEffectsGainNode) {
      return;
    }

    const startTime = this.audioContext.currentTime + 0.01;

    this.playPercussiveNote({
      durationInSeconds: 0.1,
      frequency: 230,
      gainAmount: 0.1,
      startTime,
      type: 'triangle'
    });

    this.playPercussiveNote({
      durationInSeconds: 0.07,
      frequency: 420,
      gainAmount: 0.05,
      startTime: startTime + 0.015,
      type: 'square'
    });
  }

  async startWheelSpin(durationInMilliseconds: number) {
    await this.ensureAudioContext();

    if (!this.audioContext || !this.soundEffectsGainNode) {
      return;
    }

    this.stopWheelSpin();
    this.spinToken += 1;
    const activeToken = this.spinToken;
    const startTimestamp = performance.now();

    const scheduleTick = () => {
      if (activeToken !== this.spinToken || !this.audioContext) {
        return;
      }

      const elapsedMilliseconds = performance.now() - startTimestamp;
      const progress = Math.min(1, elapsedMilliseconds / durationInMilliseconds);
      const now = this.audioContext.currentTime;

      this.playPercussiveNote({
        durationInSeconds: 0.045,
        frequency: 180 - progress * 40,
        gainAmount: 0.06 + (1 - progress) * 0.08,
        startTime: now + 0.005,
        type: 'square'
      });

      const nextDelay = 58 + progress * 160;

      if (progress < 1) {
        this.spinTimeoutId = window.setTimeout(scheduleTick, nextDelay);
      } else {
        this.spinTimeoutId = null;
      }
    };

    scheduleTick();
  }

  stopWheelSpin() {
    this.spinToken += 1;

    if (this.spinTimeoutId) {
      window.clearTimeout(this.spinTimeoutId);
      this.spinTimeoutId = null;
    }
  }

  async playLoss() {
    await this.ensureAudioContext();

    if (!this.audioContext) {
      return;
    }

    const startTime = this.audioContext.currentTime + 0.01;

    this.playPercussiveNote({
      durationInSeconds: 0.22,
      frequency: 174,
      gainAmount: 0.07,
      startTime,
      type: 'triangle'
    });

    this.playPercussiveNote({
      durationInSeconds: 0.28,
      frequency: 130,
      gainAmount: 0.05,
      startTime: startTime + 0.06,
      type: 'sine'
    });
  }

  async playWin(tier: WinSoundTier) {
    await this.ensureAudioContext();

    if (!this.audioContext) {
      return;
    }

    const startTime = this.audioContext.currentTime + 0.02;

    if (tier === 'small') {
      this.playCoinRun(startTime, [622, 784, 988], 0.09);
      return;
    }

    if (tier === 'medium') {
      this.playCoinRun(startTime, [523, 659, 784, 880], 0.11);
      this.playPercussiveNote({
        durationInSeconds: 0.26,
        frequency: 392,
        gainAmount: 0.12,
        startTime: startTime + 0.12,
        type: 'triangle'
      });
      return;
    }

    this.playCoinRun(startTime, [523, 659, 784, 988, 1174], 0.12);
    [220, 277, 330].forEach((frequency, index) => {
      this.playPercussiveNote({
        durationInSeconds: 0.48,
        frequency,
        gainAmount: 0.1,
        startTime: startTime + 0.16 + index * 0.08,
        type: 'sawtooth'
      });
    });
    [988, 1174, 1318].forEach((frequency, index) => {
      this.playPercussiveNote({
        durationInSeconds: 0.22,
        frequency,
        gainAmount: 0.09,
        startTime: startTime + 0.24 + index * 0.07,
        type: 'square'
      });
    });
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      const AudioContextConstructor =
        window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextConstructor) {
        return;
      }

      this.audioContext = new AudioContextConstructor();
      this.musicGainNode = this.audioContext.createGain();
      this.soundEffectsGainNode = this.audioContext.createGain();
      this.musicGainNode.connect(this.audioContext.destination);
      this.soundEffectsGainNode.connect(this.audioContext.destination);
      this.applySettings(this.settings);
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  private startMusicLoop() {
    if (!this.audioContext || !this.musicGainNode || this.musicStarted) {
      return;
    }

    this.musicStarted = true;
    this.nextMusicTime = this.audioContext.currentTime + 0.08;

    const scheduleMusic = () => {
      if (!this.audioContext || !this.musicGainNode) {
        return;
      }

      while (this.nextMusicTime < this.audioContext.currentTime + 1.2) {
        this.schedulePirateBar(this.nextMusicTime);
        this.nextMusicTime += 2.4;
      }
    };

    scheduleMusic();
    this.musicSchedulerId = window.setInterval(scheduleMusic, 420);
  }

  private schedulePirateBar(barStartTime: number) {
    const chord = [164.81, 220, 246.94];
    const melody = [329.63, 392, 440, 392];

    chord.forEach((frequency) => {
      this.playSustainedNote({
        durationInSeconds: 2.2,
        frequency,
        gainAmount: 0.022,
        startTime: barStartTime,
        type: 'triangle'
      });
    });

    melody.forEach((frequency, index) => {
      this.playSustainedNote({
        durationInSeconds: 0.42,
        frequency,
        gainAmount: 0.03,
        startTime: barStartTime + index * 0.52,
        type: 'square'
      });
    });

    [0, 0.72, 1.44].forEach((offset) => {
      this.playPercussiveNote({
        durationInSeconds: 0.08,
        frequency: 110,
        gainAmount: 0.035,
        startTime: barStartTime + offset,
        type: 'sine'
      });
    });
  }

  private playCoinRun(startTime: number, frequencies: number[], gainAmount: number) {
    frequencies.forEach((frequency, index) => {
      this.playPercussiveNote({
        durationInSeconds: 0.16,
        frequency,
        gainAmount,
        startTime: startTime + index * 0.09,
        type: 'triangle'
      });
    });
  }

  private playPercussiveNote(options: ScheduledNoteOptions) {
    this.playNote(options, this.soundEffectsGainNode);
  }

  private playSustainedNote(options: ScheduledNoteOptions) {
    this.playNote(options, this.musicGainNode);
  }

  private playNote(
    options: ScheduledNoteOptions,
    outputGainNode: GainNode | null
  ) {
    if (!this.audioContext || !outputGainNode) {
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filterNode = this.audioContext.createBiquadFilter();

    oscillator.type = options.type;
    oscillator.frequency.setValueAtTime(options.frequency, options.startTime);
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(Math.max(300, options.frequency * 5), options.startTime);

    gainNode.gain.setValueAtTime(0.0001, options.startTime);
    gainNode.gain.exponentialRampToValueAtTime(
      Math.max(0.0002, options.gainAmount),
      options.startTime + 0.02
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      options.startTime + options.durationInSeconds
    );

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(outputGainNode);
    oscillator.start(options.startTime);
    oscillator.stop(options.startTime + options.durationInSeconds + 0.05);
  }
}

interface ScheduledNoteOptions {
  durationInSeconds: number;
  frequency: number;
  gainAmount: number;
  startTime: number;
  type: OscillatorType;
}
