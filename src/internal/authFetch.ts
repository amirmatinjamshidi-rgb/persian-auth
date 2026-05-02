import type {
  AuthActionResult,
  AuthEndpointSpecifier,
  AuthError,
  AuthHttpEndpoint,
  AuthHttpMethod,
} from "../types";
import {
  DEFAULT_AUTH_ERROR_MESSAGES,
  normalizeAuthError,
  statusToAuthErrorCode,
} from "./normalizeError";

/**
 * Endpoint after resolving a string shorthand or merging default `method`.
 * Used internally before calling `authFetch`.
 */
export type ResolvedAuthEndpoint = Omit<AuthHttpEndpoint, "method"> & {
  method: AuthHttpMethod;
};

/**
 * Turns `"/api/otp"` or `{ url: "...", headers: {...} }` into a uniform shape.
 * Plain strings become `POST` by default unless you pass another `defaultMethod`.
 */
export function resolveAuthEndpoint(
  specifier: AuthEndpointSpecifier,
  defaultMethod: AuthHttpMethod = "POST",
): ResolvedAuthEndpoint {
  if (typeof specifier === "string") {
    return { url: specifier, method: defaultMethod };
  }
  return {
    url: specifier.url,
    method: specifier.method ?? defaultMethod,
    headers: specifier.headers,
    credentials: specifier.credentials,
  };
}

/** One JSON `fetch` built from `resolveAuthEndpoint` output plus optional JSON body / abort signal. */
export interface AuthFetchInput extends ResolvedAuthEndpoint {
  /** `JSON.stringify`’d unless you override `Content-Type`. */
  body?: unknown;
  signal?: AbortSignal;
}

function truncateMessage(text: string, max = 400): string {
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

async function failureFromResponse(res: Response): Promise<AuthError> {
  const status = res.status;
  const fallback = DEFAULT_AUTH_ERROR_MESSAGES[statusToAuthErrorCode(status)];
  let text = "";
  try {
    text = await res.text();
  } catch {
    return {
      code: statusToAuthErrorCode(status),
      message: fallback,
      status,
      cause: res,
    };
  }

  let parsed: unknown;
  try {
    parsed = text ? (JSON.parse(text) as unknown) : undefined;
  } catch {
    parsed = text.trim() ? { message: truncateMessage(text) } : undefined;
  }

  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const normalized = normalizeAuthError(
      { ...(parsed as Record<string, unknown>), status },
      fallback,
    );
    return {
      ...normalized,
      status: normalized.status ?? status,
      cause: res,
    };
  }

  const code = statusToAuthErrorCode(status);
  const message =
    typeof parsed === "string" && parsed.trim()
      ? truncateMessage(parsed)
      : text.trim()
        ? truncateMessage(text)
        : fallback;

  return { code, message, status, cause: res };
}

async function successBody<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text.trim()) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

/**
 * Internal JSON-oriented `fetch` for auth actions.
 *
 * - Never throws — failures are `{ ok: false, error: AuthError }`.
 * - Sets `Content-Type: application/json` when `body` is present and you did not set it yourself.
 * - Failed responses try to parse JSON `{ message, error, fields, code }` and fall back to status-based messages.
 */
export async function authFetch<T = void>(input: AuthFetchInput): Promise<AuthActionResult<T>> {
  try {
    const headers = new Headers(input.headers);
    let body: string | undefined;

    if (input.body !== undefined) {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json; charset=utf-8");
      }
      body = JSON.stringify(input.body);
    }

    const res = await fetch(input.url, {
      method: input.method,
      headers,
      credentials: input.credentials,
      body,
      signal: input.signal,
    });

    if (!res.ok) {
      return { ok: false, error: await failureFromResponse(res) };
    }

    const data = await successBody<T>(res);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: normalizeAuthError(err) };
  }
}
