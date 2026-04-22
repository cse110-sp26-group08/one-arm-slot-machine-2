import type { CSSProperties } from 'react';

import styles from '../../pages/HomePage.module.css';
import type { SlotMachineAnimationState } from './animation-state.js';
import type { ConfettiParticle } from './celebration.js';
import type { WinCelebrationTheme } from '../../services/slot-machine-client.js';

interface WinCelebrationProps {
  announcement: string;
  animationTier: Extract<SlotMachineAnimationState, 'win' | 'big-win' | 'jackpot'>;
  confettiParticles: ConfettiParticle[];
  isVisible: boolean;
  onDismiss: () => void;
  theme: WinCelebrationTheme;
}

/**
 * Renders the win overlay with CSS confetti and a dismiss control.
 *
 * @param {WinCelebrationProps} props - Celebration overlay props.
 * @returns {JSX.Element | null} Overlay UI when the player wins.
 */
export function WinCelebration({
  announcement,
  animationTier,
  confettiParticles,
  isVisible,
  onDismiss,
  theme
}: WinCelebrationProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={[
        styles.celebrationOverlay,
        animationTier === 'big-win' ? styles.celebrationOverlayBigWin : '',
        animationTier === 'jackpot' ? styles.celebrationOverlayJackpot : ''
      ].join(' ')}
      role="dialog"
      aria-live="polite"
      aria-modal="true"
    >
      <div className={styles.celebrationConfetti} aria-hidden="true">
        {confettiParticles.map((particle, index) => {
          const particleStyle: CSSProperties & Record<'--confetti-drift', string> = {
            backgroundColor: particle.color,
            left: `${particle.horizontalPosition}%`,
            width: `${particle.sizeInPixels}px`,
            height: `${particle.sizeInPixels * 0.6}px`,
            animationDuration: `${particle.durationInMilliseconds}ms`,
            animationDelay: `${particle.delayInMilliseconds}ms`,
            transform: `rotate(${particle.rotationInDegrees}deg)`,
            '--confetti-drift': `${particle.driftOffset}px`
          };

          return (
            <span
              className={theme === 'snow' ? styles.snowParticle : styles.confettiParticle}
              key={`${particle.horizontalPosition}-${index}`}
              style={particleStyle}
            />
          );
        })}
      </div>
      <div className={styles.celebrationCoins} aria-hidden="true">
        {Array.from({ length: animationTier === 'jackpot' ? 16 : 8 }, (_, index) => (
          <span
            className={styles.celebrationCoin}
            key={`celebration-coin-${index}`}
            style={
              {
                animationDelay: `${index * 90}ms`,
                left: `${10 + ((index * 7) % 76)}%`
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className={styles.celebrationShipScene} aria-hidden="true">
        <div className={styles.celebrationWave} />
        <div className={styles.celebrationShip}>
          <span className={styles.shipSail} />
          <span className={styles.shipHull} />
        </div>
      </div>
      {animationTier === 'jackpot' ? (
        <div className={styles.celebrationCannons} aria-hidden="true">
          <span className={styles.celebrationCannonLeft} />
          <span className={styles.celebrationCannonRight} />
        </div>
      ) : null}
      <div className={styles.celebrationCard}>
        <p className={styles.celebrationEyebrow}>Jackpot lights</p>
        <h2 className={styles.celebrationTitle}>You win!</h2>
        <p className={styles.celebrationBody}>{announcement}</p>
        <button className={styles.celebrationButton} onClick={onDismiss} type="button">
          Keep playing
        </button>
      </div>
    </div>
  );
}
