import styles from '../../pages/App.module.css';

/**
 * Displays the temporary loading state while the cached session is checked.
 *
 * @returns {JSX.Element} Session restore status UI.
 */
export function AuthStatusScreen() {
  return (
    <section className={styles.statusScreen}>
      <p className={styles.eyebrow}>Checking cached session</p>
      <h1 className={styles.title}>Restoring your seat at the machine.</h1>
    </section>
  );
}
