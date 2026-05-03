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
  /**
   * Declarative backend URLs for the internal JSON client (`authFetch`).
   * **Precedence:** explicit `requestOtp` / `verifyOtp` / `submitCredentials` props
   * override these when both are set. For `requestOtp`, see Part 7.
   */
  endpoints?: PersianAuthEndpoints;
  className?: string;
  classNames?: PersianLoginClassNames;
}

export interface PersianLoginLibraryProps {
  type: LoginType;
  mode?: FormMode;
  onAuthSuccess: AuthSuccessHandler;
  onAuthError?: AuthErrorHandler;
  /** Forwarded to `PersianLoginForm` — same behaviour as `PersianLoginFormProps.endpoints`. */
  endpoints?: PersianAuthEndpoints;
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

/** Allowed HTTP verbs for built-in auth action requests. Defaults are chosen per action when omitted. */
export type AuthHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Describes one HTTP endpoint used by the library when calling your backend instead of passing
 * imperative `requestOtp` / `verifyOtp` / `submitCredentials` functions.
 *
 * A plain string shorthand (`"/api/auth/login"`) is also accepted; see `AuthEndpointSpecifier`.
 */
export interface AuthHttpEndpoint {
  /** Absolute URL or same-origin path. */
  url: string;
  method?: AuthHttpMethod;
  /** Extra headers merged on top of the client's defaults (for example JSON `Content-Type`). */
  headers?: HeadersInit;
  /** Forwarded to `fetch` — use `"include"` when your API relies on session cookies. */
  credentials?: RequestCredentials;
}

/**
 * Either a URL/path string or a full endpoint config object.
 *
 * Shorthand strings are expanded to `POST` with `Content-Type: application/json` by the built-in
 * client (Part 6), unless the endpoint object sets `method` / `headers` explicitly.
 */
export type AuthEndpointSpecifier = string | AuthHttpEndpoint;

/**
 * When login and signup hit different routes, pass one URL per `FormMode`.
 * If you only set one side, the other mode falls back to runtime behavior defined in Part 9.
 */
export interface CredentialEndpointByMode {
  login?: AuthEndpointSpecifier;
  signup?: AuthEndpointSpecifier;
}

/**
 * Optional map of backend endpoints for the built-in auth action client (`authFetch`).
 *
 * Pass this via `PersianLoginFormProps.endpoints` / `PersianLoginLibraryProps.endpoints`.
 * `requestOtp` is consumed in Part 7; verify and credential endpoints follow later.
 */
export interface PersianAuthEndpoints {
  /**
   * Request SMS / WhatsApp OTP for the given phone.
   * Built-in client sends `POST` JSON: `{ phoneNumber }` with normalized `09XXXXXXXXX`.
   */
  requestOtp?: AuthEndpointSpecifier;
  verifyOtp?: AuthEndpointSpecifier;
  /** Same route for both modes, or split routes per `FormMode`. */
  submitCredentials?: AuthEndpointSpecifier | CredentialEndpointByMode;
}

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
