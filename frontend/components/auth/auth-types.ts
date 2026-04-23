/**
 * Supported auth surface modes for the login page.
 */
export type FormMode = 'login' | 'signup';

/**
 * Serializable form state for the login flow.
 */
export interface LoginFormState {
  email: string;
  password: string;
}

/**
 * Serializable form state for the signup flow.
 */
export interface SignupFormState {
  name: string;
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  captcha: string;
}

/**
 * Empty login-form defaults used when initializing or resetting the login view.
 */
export const initialLoginForm: LoginFormState = {
  email: '',
  password: ''
};

/**
 * Empty signup-form defaults used when initializing or resetting the signup view.
 */
export const initialSignupForm: SignupFormState = {
  name: '',
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  dateOfBirth: '',
  captcha: ''
};
