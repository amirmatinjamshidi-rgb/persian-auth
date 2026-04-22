export type LoginType = "phone" | "email" | "username";

export type FormMode = "login" | "signup";

export interface AuthSuccessData {
  type: LoginType | "github";
  phoneNumber?: string;
  username?: string;
  email?: string;
  otpCode?: string;
  provider?: "github";
  githubCode?: string;
}

export type AuthSuccessHandler = (data: AuthSuccessData) => void;
export type AuthErrorHandler = (error: string) => void;

export interface PersianLoginFormProps {
  type: LoginType;
  mode?: FormMode;
  onAuthSuccess?: AuthSuccessHandler;
  onError?: AuthErrorHandler;
  className?: string;
}

export interface PersianLoginLibraryProps {
  type: LoginType;
  mode?: FormMode;
  onAuthSuccess: AuthSuccessHandler;
  onAuthError?: AuthErrorHandler;
  className?: string;
}

export interface GithubLoginButtonProps {
  clientId: string;
  redirectUri: string;
  scope?: string;
  state?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  onAuthSuccess?: AuthSuccessHandler;
  onError?: AuthErrorHandler;
}

export interface PersianFormValues {
  phoneNumber: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type FieldName = keyof PersianFormValues;
