"use client";

import { useMemo, useState } from "react";
import { PersianLoginForm } from "@/src/components/PersianLoginForm";
import type { AuthSuccessData, FormMode, LoginType, PersianLoginClassNames } from "@/src";

type Message = { kind: "success" | "error"; text: string } | null;

interface PersianMethodExamplesProps {
  type: LoginType;
  mode?: FormMode;
  successTitle?: string;
  failTitle?: string;
  normalClassNames?: PersianLoginClassNames;
  failClassNames?: PersianLoginClassNames;
}

function formatSuccessMessage(data: AuthSuccessData): string {
  if (data.type === "phone") {
    return `Success: verified ${data.phoneNumber ?? "phone"} with OTP`;
  }
  if (data.type === "email") {
    return `Success: logged in as ${data.email ?? "email user"}`;
  }
  return `Success: completed for ${data.username ?? "username user"}`;
}

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

export function PersianMethodExamples({
  type,
  mode = "login",
  successTitle = "Normal flow",
  failTitle = "Always fail flow",
  normalClassNames,
  failClassNames,
}: PersianMethodExamplesProps) {
  const [normalMessage, setNormalMessage] = useState<Message>(null);
  const [failMessage, setFailMessage] = useState<Message>(null);

  const failText = useMemo(() => {
    if (type === "phone") return "This example always throws: OTP service is unavailable.";
    if (type === "email") return "This example always throws: invalid email/password pair.";
    return "This example always throws: invalid username/password pair.";
  }, [type]);

  const normalSuccess = (data: AuthSuccessData) => {
    setNormalMessage({ kind: "success", text: formatSuccessMessage(data) });
  };

  const normalError = (error: string) => {
    setNormalMessage({ kind: "error", text: error });
  };

  const failSuccess = () => {
    setFailMessage({
      kind: "error",
      text: "Unexpected success. This card should always return an error.",
    });
  };

  const failError = (error: string) => {
    setFailMessage({ kind: "error", text: error });
  };

  const alwaysFail = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    throw new Error(failText);
  };

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <article className="rounded-2xl border border-emerald-300/25 bg-zinc-950/60 p-4 sm:p-5">
        <div className="mb-4 space-y-2">
          <h2 className="text-xl font-semibold text-emerald-200">{successTitle}</h2>
          <p className="text-sm text-zinc-300">
            Success returner: this demo uses the normal flow and can pass with valid input.
          </p>
          <MessageBanner message={normalMessage} />
        </div>
        <PersianLoginForm
          type={type}
          mode={mode}
          onAuthSuccess={normalSuccess}
          onError={normalError}
          classNames={normalClassNames}
        />
      </article>

      <article className="rounded-2xl border border-rose-300/25 bg-zinc-950/60 p-4 sm:p-5">
        <div className="mb-4 space-y-2">
          <h2 className="text-xl font-semibold text-rose-200">{failTitle}</h2>
          <p className="text-sm text-zinc-300">
            Error returner: this demo always fails and throws an error message.
          </p>
          <MessageBanner message={failMessage} />
        </div>
        <PersianLoginForm
          type={type}
          mode={mode}
          onAuthSuccess={failSuccess}
          onError={failError}
          requestOtp={type === "phone" ? alwaysFail : undefined}
          verifyOtp={type === "phone" ? alwaysFail : undefined}
          submitCredentials={type === "phone" ? undefined : alwaysFail}
          classNames={failClassNames}
        />
      </article>
    </section>
  );
}
