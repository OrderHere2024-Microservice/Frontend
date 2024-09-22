export interface SignState {
  isOpen: boolean;
  content: 'login' | 'register' | 'forgetpassword';
  isLogin: boolean;
  token?: string;
  passwordResetStatus?: 'success' | 'error';
  message?: string;
  error?: string;
}
