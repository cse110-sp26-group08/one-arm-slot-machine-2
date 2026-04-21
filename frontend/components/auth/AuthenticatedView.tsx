import type { AuthenticatedUser } from '../../services/auth-client.js';
import styles from '../../pages/App.module.css';

interface AuthenticatedViewProps {
  onLogout: () => void;
  user: AuthenticatedUser;
}

/**
 * Renders the signed-in or guest-ready state after authentication.
 *
 * @param {AuthenticatedViewProps} props - Authenticated view props.
 * @returns {JSX.Element} Authenticated state UI.
 */
export function AuthenticatedView({ onLogout, user }: AuthenticatedViewProps) {
  return (
    <section className={`${styles.heroPanel} ${styles.authenticatedPanel}`}>
      <div className={styles.brandStack}>
        <p className={styles.eyebrow}>One Arm Arcade</p>
        <h1 className={styles.title}>{user.displayName}, the reels are live.</h1>
        <p className={styles.supportCopy}>
          {user.isGuest
            ? 'You are playing as a guest. Create a permanent account later to keep streaks and unlock future machines.'
            : 'Your login is cached on this device so you do not need to sign in every visit.'}
        </p>
      </div>
      <div className={styles.detailRail}>
        <div>
          <span className={styles.detailLabel}>Profile</span>
          <p className={styles.text}>{user.email ?? 'Guest access only'}</p>
        </div>
        <div>
          <span className={styles.detailLabel}>Access</span>
          <p className={styles.text}>{user.isGuest ? 'Guest lane' : 'Account holder'}</p>
        </div>
      </div>
      <button className={styles.secondaryButton} onClick={onLogout} type="button">
        Clear cached login
      </button>
    </section>
  );
}
