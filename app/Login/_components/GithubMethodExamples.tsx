"use client";

import { useMemo, useState } from "react";
import { GithubLoginButton, type AuthSuccessData } from "@/src";

type Message = { kind: "success" | "error"; text: string } | null;

function MessageBanner({ message }: { message: Message }) {
  if (!message) return null;
  const style =
    message.kind === "success"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : "border-rose-400/40 bg-rose-500/10 text-rose-200";

  return (
    <div className={`rounded-lg border px-3 py-2 text-sm ${style}`} role="status">
      {message.text}
    </div>
  );
}

export function GithubMethodExamples() {
  const [normalMessage, setNormalMessage] = useState<Message>(null);
  const [failMessage, setFailMessage] = useState<Message>(null);

  const redirectUri = useMemo(
    () =>
      typeof window === "undefined"
        ? "http://localhost:3000/Login/GitHub"
        : `${window.location.origin}/Login/GitHub`,
    [],
  );

  const handleNormalSuccess = (data: AuthSuccessData) => {
    setNormalMessage({
      kind: "success",
      text: `Success: github code received (${data.githubCode?.slice(0, 6) ?? "code"}...)`,
    });
  };

  const handleNormalError = (error: string) => {
    setNormalMessage({ kind: "error", text: error });
  };

  const handleForcedFailure = () => {
    try {
      throw new Error("This example always throws: forced GitHub auth failure.");
    } catch (error) {
      const text = error instanceof Error ? error.message : "Unknown forced error";
      setFailMessage({ kind: "error", text });
    }
  };

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <article className="rounded-2xl border border-emerald-300/25 bg-zinc-950/60 p-4 sm:p-5">
        <div className="mb-4 space-y-2">
          <h2 className="text-xl font-semibold text-emerald-200">Normal flow</h2>
          <p className="text-sm text-zinc-300">
            Success returner: this is the real GitHub OAuth starter button.
          </p>
          <MessageBanner message={normalMessage} />
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-lg">
          <GithubLoginButton
            clientId={process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? "demo-client-id"}
            redirectUri={redirectUri}
            onAuthSuccess={handleNormalSuccess}
            onError={handleNormalError}
          />
          <p className="mt-3 text-center text-sm text-zinc-400">
            For real use, set <code>NEXT_PUBLIC_GITHUB_CLIENT_ID</code> and complete token exchange
            on the server.
          </p>
        </div>
      </article>

      <article className="rounded-2xl border border-rose-300/25 bg-zinc-950/60 p-4 sm:p-5">
        <div className="mb-4 space-y-2">
          <h2 className="text-xl font-semibold text-rose-200">Always fail flow</h2>
          <p className="text-sm text-zinc-300">
            Error returner: this example intentionally throws an error every time.
          </p>
          <MessageBanner message={failMessage} />
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-lg">
          <button
            type="button"
            onClick={handleForcedFailure}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-800"
          >
            Trigger forced GitHub error
          </button>
          <p className="mt-3 text-center text-sm text-zinc-400">
            This card is for error handling demos and always returns a failure message.
          </p>
        </div>
      </article>
    </section>
  );
}
