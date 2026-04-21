/**
 * Plays a short synthesized win jingle using the Web Audio API.
 *
 * @returns {Promise<void>} Promise resolved once the audio has been scheduled.
 */
export async function playWinJingle() {
  if (typeof window === 'undefined') {
    return;
  }

  const AudioContextConstructor = window.AudioContext ?? (window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
  }).webkitAudioContext;

  if (!AudioContextConstructor) {
    return;
  }

  const audioContext = new AudioContextConstructor();

  try {
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const melody = [
      { frequency: 523.25, startOffset: 0, duration: 0.14 },
      { frequency: 659.25, startOffset: 0.14, duration: 0.14 },
      { frequency: 783.99, startOffset: 0.28, duration: 0.16 },
      { frequency: 1046.5, startOffset: 0.44, duration: 0.34 }
    ];
    const startTime = audioContext.currentTime + 0.02;

    melody.forEach((note) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(note.frequency, startTime + note.startOffset);

      gainNode.gain.setValueAtTime(0.0001, startTime + note.startOffset);
      gainNode.gain.exponentialRampToValueAtTime(0.12, startTime + note.startOffset + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + note.startOffset + note.duration
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(startTime + note.startOffset);
      oscillator.stop(startTime + note.startOffset + note.duration + 0.04);
    });

    window.setTimeout(() => {
      void audioContext.close();
    }, 1200);
  } catch {
    void audioContext.close();
  }
}
