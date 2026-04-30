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


export type AuthErrorCode =
  | "network"
  | "timeout"
  | "aborted"
  | "validation"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limited"
  | "server"
  | "unknown";


export interface AuthError {
  code: AuthErrorCode;
  message: string;
  status?: number;
  fields?: Partial<Record<FieldName | "otp" | "general", string>>;
  cause?: unknown;
}

/** Lifecycle state of any auth action (form submit, OTP request, session fetch, ...). */
export type AuthActionStatus = "idle" | "pending" | "success" | "error";

/**
 * Discriminated result of a settled auth action.
 *
 * Consumers can branch on `result.ok` instead of wrapping calls in
 * try/catch or pulling in a server-state library:
 *
 * ```ts
 * const result = await action.run();
 * if (result.ok) { ... } else { showError(result.error); }
 * ```
 */
export type AuthActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: AuthError };
