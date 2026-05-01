import type { AuthError, AuthErrorCode } from "../types";

/**
 * Used as a fallback when a thrown value carries no usable message of its
 * own (for example a bare `Response` object or a non-`Error` throw).
 */
export const DEFAULT_AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  network: "ارتباط با سرور برقرار نشد",
  timeout: "زمان درخواست به پایان رسید",
  aborted: "درخواست لغو شد",
  validation: "اطلاعات وارد شده نامعتبر است",
  unauthorized: "احراز هویت ناموفق بود",
  forbidden: "دسترسی شما به این بخش مجاز نیست",
  not_found: "مورد درخواستی یافت نشد",
  rate_limited: "تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید",
  server: "خطای سرور؛ لطفاً بعداً دوباره تلاش کنید",
  unknown: "خطایی رخ داد",
};

/**
 * Map an HTTP status code to the closest matching `AuthErrorCode`.
 *
 * Anything unrecognized is reported as `"unknown"` so callers always get a
 * valid code back (no `undefined`s creeping into the error type).
 */
export function statusToAuthErrorCode(status: number): AuthErrorCode {
  if (status === 400) return "validation";
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 408) return "timeout";
  if (status === 429) return "rate_limited";
  if (status >= 500 && status < 600) return "server";
  return "unknown";
}

function isAuthErrorLike(value: unknown): value is AuthError {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Partial<AuthError>;
  return typeof v.code === "string" && typeof v.message === "string";
}

function isResponseLike(value: unknown): value is Response {
  if (typeof value !== "object" || value === null) return false;
  const v = value as { status?: unknown; ok?: unknown };
  return typeof v.status === "number" && "ok" in v;
}

/**
 * Convert any thrown value into the normalized `AuthError` shape.
 *
 * Handles:
 *  - already-shaped `AuthError` objects (passed through untouched)
 *  - plain strings and `Error` instances
 *  - `AbortError` / aborted requests
 *  - network failures (`TypeError` from `fetch`)
 *  - bare `Response` objects (failed `fetch` results)
 *  - JSON-style payloads with `{ message, code, status, fields }`
 *  - anything else (falls back to a generic `unknown` error)
 *
 * The original thrown value is preserved on `cause` for debugging.
 */
export function normalizeAuthError(
  value: unknown,
  fallbackMessage: string = DEFAULT_AUTH_ERROR_MESSAGES.unknown,
): AuthError {
  if (isAuthErrorLike(value)) return value;

  if (typeof value === "string") {
    return {
      code: "unknown",
      message: value || fallbackMessage,
      cause: value,
    };
  }

  if (
    typeof value === "object" &&
    value !== null &&
    (value as { name?: unknown }).name === "AbortError"
  ) {
    return {
      code: "aborted",
      message: DEFAULT_AUTH_ERROR_MESSAGES.aborted,
      cause: value,
    };
  }

  if (value instanceof TypeError && /fetch|network/i.test(value.message)) {
    return {
      code: "network",
      message: DEFAULT_AUTH_ERROR_MESSAGES.network,
      cause: value,
    };
  }

  if (value instanceof Error) {
    return {
      code: "unknown",
      message: value.message || fallbackMessage,
      cause: value,
    };
  }

  if (isResponseLike(value)) {
    const code = statusToAuthErrorCode(value.status);
    return {
      code,
      message: DEFAULT_AUTH_ERROR_MESSAGES[code],
      status: value.status,
      cause: value,
    };
  }

  if (typeof value === "object" && value !== null) {
    const obj = value as {
      message?: unknown;
      error?: unknown;
      code?: unknown;
      status?: unknown;
      fields?: unknown;
    };
    const message =
      typeof obj.message === "string" && obj.message
        ? obj.message
        : typeof obj.error === "string" && obj.error
          ? obj.error
          : fallbackMessage;
    const status = typeof obj.status === "number" ? obj.status : undefined;
    const code: AuthErrorCode =
      typeof obj.code === "string" && obj.code in DEFAULT_AUTH_ERROR_MESSAGES
        ? (obj.code as AuthErrorCode)
        : status !== undefined
          ? statusToAuthErrorCode(status)
          : "unknown";
    const fields =
      typeof obj.fields === "object" && obj.fields !== null
        ? (obj.fields as AuthError["fields"])
        : undefined;
    return {
      code,
      message,
      status,
      fields,
      cause: value,
    };
  }

  return {
    code: "unknown",
    message: fallbackMessage,
    cause: value,
  };
}
