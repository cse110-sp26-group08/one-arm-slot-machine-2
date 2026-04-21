export type FormMode = 'login' | 'signup';

export interface LoginFormState {
  email: string;
  password: string;
}

export interface SignupFormState {
  name: string;
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  captcha: string;
}

export const initialLoginForm: LoginFormState = {
  email: '',
  password: ''
};

export const initialSignupForm: SignupFormState = {
  name: '',
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  dateOfBirth: '',
  captcha: ''
};
