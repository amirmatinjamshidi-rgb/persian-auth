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

export type PersianInputSlot =
  | "phone"
  | "username"
  | "email"
  | "password"
  | "confirmPassword"
  | "otp";

export interface PersianLoginClassNames {
  container?: string;
  formRoot?: string;
  form?: string;
  formGroup?: string;
  label?: string;
  input?: string;
  inputError?: string;
  inputByField?: Partial<Record<PersianInputSlot, string>>;
  inputErrorByField?: Partial<Record<PersianInputSlot, string>>;
  errorText?: string;
  submitButton?: string;
  verificationStep?: string;
  instructions?: string;
  otpContainer?: string;
  otpInput?: string;
  otpInputError?: string;
  resendButton?: string;
  actions?: string;
  primaryActionButton?: string;
  secondaryActionButton?: string;
  generalError?: string;
}

export interface PersianLoginFormProps {
  type: LoginType;
  mode?: FormMode;
  onAuthSuccess?: AuthSuccessHandler;
  onError?: AuthErrorHandler;
  className?: string;
  classNames?: PersianLoginClassNames;
}

export interface PersianLoginLibraryProps {
  type: LoginType;
  mode?: FormMode;
  onAuthSuccess: AuthSuccessHandler;
  onAuthError?: AuthErrorHandler;
  className?: string;
  classNames?: PersianLoginClassNames;
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
