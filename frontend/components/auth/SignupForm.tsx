import type { SignupFormState } from './auth-types.js';
import styles from '../../pages/App.module.css';

interface SignupFormProps {
  form: SignupFormState;
  isSubmitting: boolean;
  onChange: (field: keyof SignupFormState, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
}

/**
 * Renders the signup form for a new player account.
 *
 * @param {SignupFormProps} props - Signup form props.
 * @returns {JSX.Element} Signup form UI.
 */
export function SignupForm({ form, isSubmitting, onChange, onSubmit }: SignupFormProps) {
  return (
    <form className={`${styles.authForm} ${styles.signupForm}`} onSubmit={onSubmit}>
      <label className={styles.field}>
        <span>Name</span>
        <input
          className={styles.input}
          name="name"
          onChange={(event) => onChange('name', event.target.value)}
          required
          type="text"
          value={form.name}
        />
      </label>
      <label className={styles.field}>
        <span>Display name</span>
        <input
          className={styles.input}
          name="displayName"
          onChange={(event) => onChange('displayName', event.target.value)}
          required
          type="text"
          value={form.displayName}
        />
      </label>
      <label className={styles.field}>
        <span>Email</span>
        <input
          autoComplete="email"
          className={styles.input}
          name="email"
          onChange={(event) => onChange('email', event.target.value)}
          required
          type="email"
          value={form.email}
        />
      </label>
      <label className={styles.field}>
        <span>Date of birth</span>
        <input
          className={styles.input}
          name="dateOfBirth"
          onChange={(event) => onChange('dateOfBirth', event.target.value)}
          required
          type="date"
          value={form.dateOfBirth}
        />
      </label>
      <label className={styles.field}>
        <span>Password</span>
        <input
          autoComplete="new-password"
          className={styles.input}
          name="password"
          onChange={(event) => onChange('password', event.target.value)}
          required
          type="password"
          value={form.password}
        />
      </label>
      <label className={styles.field}>
        <span>Confirm password</span>
        <input
          autoComplete="new-password"
          className={styles.input}
          name="confirmPassword"
          onChange={(event) => onChange('confirmPassword', event.target.value)}
          required
          type="password"
          value={form.confirmPassword}
        />
      </label>
      <label className={`${styles.field} ${styles.fullWidth}`}>
        <span>Captcha</span>
        <div className={styles.captchaPrompt}>Type JACKPOT to prove you are not a bot.</div>
        <input
          className={styles.input}
          name="captcha"
          onChange={(event) => onChange('captcha', event.target.value)}
          placeholder="JACKPOT"
          required
          type="text"
          value={form.captcha}
        />
      </label>
      <button className={`${styles.primaryButton} ${styles.fullWidth}`} disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Creating account...' : 'Create player card'}
      </button>
    </form>
  );
}
