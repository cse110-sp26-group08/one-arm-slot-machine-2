import styles from '../../pages/App.module.css';
import type { FormMode } from './auth-types.js';

interface AuthShellProps {
  children: React.ReactNode;
  feedbackMessage: string;
  isSubmitting: boolean;
  mode: FormMode;
  onGuestEntry: () => void | Promise<void>;
  onModeChange: (mode: FormMode) => void;
}

/**
 * Provides the shared layout and controls for login-related forms.
 *
 * @param {AuthShellProps} props - Auth shell props.
 * @returns {JSX.Element} Auth layout shell.
 */
export function AuthShell({
  children,
  feedbackMessage,
  isSubmitting,
  mode,
  onGuestEntry,
  onModeChange
}: AuthShellProps) {
  return (
    <>
      <section className={styles.heroPanel}>
        <div className={styles.brandStack}>
          <p className={styles.eyebrow}>One Arm Arcade</p>
          <h1 className={styles.title}>Claim your machine before the floor goes neon.</h1>
          <p className={styles.supportCopy}>
            Sign in, register a fresh player card, or test the reels as a guest while the full slot hall comes online.
          </p>
        </div>
        <div className={styles.marqueeStrip} aria-hidden="true">
          <span className={styles.marqueeItem}>777</span>
          <span className={styles.marqueeItem}>BAR</span>
          <span className={styles.marqueeItem}>CHERRY</span>
          <span className={styles.marqueeItem}>JACKPOT</span>
        </div>
      </section>

      <section className={styles.authStage}>
        <aside className={styles.authCopy}>
          <p className={styles.eyebrow}>Access modes</p>
          <h2 className={styles.sectionTitle}>Front-of-house now, full casino later.</h2>
          <ul className={styles.featureList}>
            <li>Email login with cached session restore on this device</li>
            <li>Signup flow with confirm password, date of birth, and captcha prompt</li>
            <li>Guest lane for players who want a quick look first</li>
          </ul>
          <p className={styles.feedbackBanner}>{feedbackMessage}</p>
        </aside>

        <div className={styles.authSurface}>
          <div className={styles.modeToggle} role="tablist" aria-label="Authentication mode">
            <button
              className={mode === 'login' ? `${styles.modeButton} ${styles.modeButtonActive}` : styles.modeButton}
              onClick={() => onModeChange('login')}
              type="button"
            >
              Login
            </button>
            <button
              className={mode === 'signup' ? `${styles.modeButton} ${styles.modeButtonActive}` : styles.modeButton}
              onClick={() => onModeChange('signup')}
              type="button"
            >
              Signup
            </button>
          </div>

          {children}

          <button
            className={`${styles.secondaryButton} ${styles.guestButton}`}
            disabled={isSubmitting}
            onClick={() => void onGuestEntry()}
            type="button"
          >
            {isSubmitting ? 'Preparing lane...' : 'Play as guest'}
          </button>
        </div>
      </section>
    </>
  );
}
