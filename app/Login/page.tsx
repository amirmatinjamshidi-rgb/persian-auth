"use client";
import { useState } from "react";
import {
  GithubLoginButton,
  PersianLoginLibrary,
  type AuthSuccessData,
} from "../../src";

type Message =
  | { kind: "success"; text: string }
  | { kind: "error"; text: string }
  | null;

export default function LoginDemoPage() {
  const [message, setMessage] = useState<Message>(null);

  const handleSuccess = (data: AuthSuccessData) => {
    setMessage({
      kind: "success",
      text: `ورود موفق: ${JSON.stringify(data)}`,
    });
  };

  const handleError = (error: string) => {
    setMessage({ kind: "error", text: error });
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            دموی persian-auth
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            تمامی روش‌های ورود — شماره تلفن، نام کاربری، ایمیل و گیت‌هاب.
          </p>
        </header>

        {message && (
          <div
            role="status"
            className={
              message.kind === "success"
                ? "mx-auto w-full max-w-md rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800"
                : "mx-auto w-full max-w-md rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800"
            }
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <section>
            <h2 className="mb-3 text-center text-lg font-medium text-zinc-800 dark:text-zinc-200">
              ورود با شماره تلفن
            </h2>
            <PersianLoginLibrary
              type="phone"
              onAuthSuccess={handleSuccess}
              onAuthError={handleError}
            />
          </section>

          <section>
            <h2 className="mb-3 text-center text-lg font-medium text-zinc-800 dark:text-zinc-200">
              ورود با ایمیل
            </h2>
            <PersianLoginLibrary
              type="email"
              onAuthSuccess={handleSuccess}
              onAuthError={handleError}
            />
          </section>

          <section>
            <h2 className="mb-3 text-center text-lg font-medium text-zinc-800 dark:text-zinc-200">
              ثبت‌نام با نام کاربری
            </h2>
            <PersianLoginLibrary
              type="username"
              mode="signup"
              onAuthSuccess={handleSuccess}
              onAuthError={handleError}
            />
          </section>

          <section>
            <h2 className="mb-3 text-center text-lg font-medium text-zinc-800 dark:text-zinc-200">
              ورود با گیت‌هاب
            </h2>
            <div className="persian-login-container">
              <GithubLoginButton
                clientId={process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? "demo-client-id"}
                redirectUri={
                  typeof window !== "undefined"
                    ? `${window.location.origin}/Login`
                    : "http://localhost:3000/Login"
                }
                onAuthSuccess={handleSuccess}
                onError={handleError}
              />
              <p className="instructions" style={{ marginTop: 12 }}>
                برای استفاده‌ی واقعی باید متغیر محیطی
                <code> NEXT_PUBLIC_GITHUB_CLIENT_ID </code>
                را تنظیم و تبادل توکن را روی سرور انجام دهید.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
