"use client";
import React, { useEffect, useRef } from "react";
import type { GithubLoginButtonProps } from "../types";

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";

function buildAuthorizeUrl(props: {
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
}): string {
  const params = new URLSearchParams({
    client_id: props.clientId,
    redirect_uri: props.redirectUri,
    scope: props.scope,
    state: props.state,
    allow_signup: "true",
  });
  return `${GITHUB_AUTHORIZE_URL}?${params.toString()}`;
}

function randomState(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

/**
 * Client-side button that kicks off the GitHub OAuth authorization-code flow.
 *
 * On click it redirects the browser to GitHub's authorize endpoint. After the
 * user approves, GitHub will redirect back to `redirectUri` with `?code=...&state=...`.
 * The token exchange MUST happen on your server (it requires the client secret).
 *
 * When the button is rendered on the redirect page and detects `?code=` in the
 * URL, it will fire `onAuthSuccess` with the code so the parent can forward it
 * to the backend.
 */
export const GithubLoginButton: React.FC<GithubLoginButtonProps> = ({
  clientId,
  redirectUri,
  scope = "read:user user:email",
  state,
  label = "ورود با گیت‌هاب",
  disabled = false,
  className,
  onAuthSuccess,
  onError,
}) => {
  const handledCallback = useRef(false);

  useEffect(() => {
    if (handledCallback.current) return;
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const err = params.get("error");
    const returnedState = params.get("state");
    const expectedState = window.sessionStorage.getItem("persian-auth:github-state");

    if (err) {
      handledCallback.current = true;
      onError?.(params.get("error_description") ?? err);
      return;
    }
    if (code) {
      handledCallback.current = true;
      if (expectedState && returnedState && expectedState !== returnedState) {
        onError?.("state نامعتبر است");
        return;
      }
      window.sessionStorage.removeItem("persian-auth:github-state");
      onAuthSuccess?.({
        type: "github",
        provider: "github",
        githubCode: code,
      });
    }
  }, [onAuthSuccess, onError]);

  const handleClick = () => {
    if (disabled) return;
    const finalState = state ?? randomState();
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("persian-auth:github-state", finalState);
      window.location.href = buildAuthorizeUrl({
        clientId,
        redirectUri,
        scope,
        state: finalState,
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`btn github-btn ${className ?? ""}`.trim()}
      aria-label={label}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 4.86 3.15 8.98 7.52 10.43.55.1.75-.24.75-.53 0-.26-.01-.95-.02-1.86-3.06.66-3.71-1.47-3.71-1.47-.5-1.27-1.22-1.61-1.22-1.61-.99-.68.08-.66.08-.66 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.69-1.48-2.44-.28-5-1.22-5-5.42 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.39.11-2.9 0 0 .93-.3 3.05 1.12.88-.24 1.83-.36 2.77-.37.94.01 1.89.13 2.77.37 2.11-1.42 3.04-1.12 3.04-1.12.6 1.51.22 2.62.11 2.9.7.77 1.13 1.75 1.13 2.95 0 4.21-2.56 5.14-5.01 5.41.39.34.74 1.01.74 2.03 0 1.47-.01 2.65-.01 3.01 0 .29.2.64.76.53 4.36-1.46 7.5-5.58 7.5-10.43C23.02 5.24 18.27.5 12 .5z" />
      </svg>
      <span>{label}</span>
    </button>
  );
};

export default GithubLoginButton;
