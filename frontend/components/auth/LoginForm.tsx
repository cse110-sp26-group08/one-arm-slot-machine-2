import type { LoginFormState } from './auth-types.js';
import styles from '../../pages/App.module.css';

interface LoginFormProps {
  form: LoginFormState;
  isSubmitting: boolean;
  onChange: (field: keyof LoginFormState, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
}

/**
 * Renders the email/password login form.
 *
 * @param {LoginFormProps} props - Login form props.
 * @returns {JSX.Element} Login form UI.
 */
export function LoginForm({ form, isSubmitting, onChange, onSubmit }: LoginFormProps) {
  return (
    <form className={styles.authForm} onSubmit={onSubmit}>
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
        <span>Password</span>
        <input
          autoComplete="current-password"
          className={styles.input}
          name="password"
          onChange={(event) => onChange('password', event.target.value)}
          required
          type="password"
          value={form.password}
        />
      </label>
      <button className={styles.primaryButton} disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Logging in...' : 'Enter arcade'}
      </button>
    </form>
  );
}
