<div align="center">

# 🔐 persian-auth

### Persian (Farsi) authentication React components — without React Query

Phone + OTP · Username / Password · Email · GitHub OAuth  
RTL-ready · Fully typed · Framework-agnostic

<p>
  <a href="https://www.npmjs.com/package/persian-auth"><img src="https://img.shields.io/npm/v/persian-auth?style=flat-square&color=22d3ee&label=npm" alt="npm"></a>
  <a href="https://www.npmjs.com/package/persian-auth"><img src="https://img.shields.io/npm/dm/persian-auth?style=flat-square&color=06b6d4" alt="downloads"></a>
  <a href="https://bundlephobia.com/package/persian-auth"><img src="https://img.shields.io/bundlephobia/minzip/persian-auth?style=flat-square&label=min%2Bgzip&color=10b981" alt="bundle size"></a>
  <a href="https://www.npmjs.com/package/persian-auth"><img src="https://img.shields.io/npm/types/persian-auth?style=flat-square&color=3178c6" alt="types"></a>
  <img src="https://img.shields.io/badge/React-18%20%7C%2019-61dafb?style=flat-square&logo=react" alt="react">
  <img src="https://img.shields.io/badge/RTL-ready-f97316?style=flat-square" alt="rtl">
  <a href="#-license"><img src="https://img.shields.io/npm/l/persian-auth?style=flat-square&color=64748b" alt="license"></a>
</p>

</div>

---

## ✨ Features

|     |     |
| --- | --- |
| 📱 **Phone + OTP** | Built-in countdown, resend, validation |
| 🔑 **Email / Username** | Sign in & sign up modes out of the box |
| 🐙 **GitHub OAuth** | CSRF-safe `state`, redirect handler included |
| 🌐 **RTL-first** | Persian copy and layout shipped by default |
| 📦 **ESM + CJS** | Full TypeScript types, tree-shakable |
| ⚡ **Zero deps** | No React Query, no global cache, no setup |

---

## 🚀 30-second example

```tsx
import { PersianLoginLibrary } from "persian-auth";
import "persian-auth/styles.css";

export default function Login() {
  return (
    <PersianLoginLibrary
      type="phone"
      onAuthSuccess={(data) => console.log("logged in:", data)}
      onAuthError={(err) => console.error(err)}
    />
  );
}
```

---

## 🤔 Why no React Query?

`persian-auth` is designed for authentication flows, not general server-state caching.

Most auth screens only need a small set of async actions:

- request an OTP
- verify an OTP
- submit username/password or email/password credentials
- start an OAuth redirect
- receive a typed success or error result

This library owns those **auth-specific loading and error states** for you. You don't need to wrap login screens in `useMutation`, configure a `QueryClient`, or pull in a server-state cache just to build a login page.

> If you already use React Query in your app, that's fine — `persian-auth` doesn't fight it. It just doesn't require it.

---

## 💡 Auth Actions, in one sentence

> An **auth action** is a focused async operation used by an authentication UI — request OTP, verify OTP, submit credentials, start OAuth, log out.

Unlike a data-fetching library, `persian-auth` intentionally does **not** manage query keys, cache invalidation, stale times, pagination, or background refetching. It only handles the state needed for authentication flows.

---

## 📖 Table of contents

- [Install](#-install)
- [Quick start](#-quick-start)
- [Wiring up a real backend](#-wiring-up-a-real-backend)
- [GitHub OAuth](#-github-oauth)
- [Public API](#-public-api)
- [Repository layout](#%EF%B8%8F-repository-layout)
- [Scripts](#%EF%B8%8F-scripts)
- [License](#-license)

---

## 📦 Install

```bash
npm install persian-auth zod
# or
pnpm add persian-auth zod
# or
yarn add persian-auth zod
```

`react` and `react-dom` are peer dependencies (>= 18).

---

## 🚀 Quick start

```tsx
import {
  PersianLoginLibrary,
  GithubLoginButton,
  type AuthSuccessData,
} from "persian-auth";
import "persian-auth/styles.css"; // optional default styling

export function LoginPage() {
  const handleSuccess = (data: AuthSuccessData) => {
    console.log("logged in:", data);
  };
  const handleError = (err: string) => console.error(err);

  return (
    <>
      <PersianLoginLibrary
        type="phone"
        onAuthSuccess={handleSuccess}
        onAuthError={handleError}
      />
      <PersianLoginLibrary
        type="email"
        onAuthSuccess={handleSuccess}
        onAuthError={handleError}
      />
      <PersianLoginLibrary
        type="username"
        mode="signup"
        onAuthSuccess={handleSuccess}
        onAuthError={handleError}
      />
      <GithubLoginButton
        clientId={process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!}
        redirectUri="https://example.com/login"
        onAuthSuccess={handleSuccess}
        onError={handleError}
      />
    </>
  );
}
```

> **Note on prop names** — the high-level `PersianLoginLibrary` exposes `onAuthError`,
> while the lower-level `PersianLoginForm` and `GithubLoginButton` use `onError`.

Wrap your app in an RTL container so layout renders correctly:

```tsx
<html lang="fa" dir="rtl">
  …
</html>
```

---

## 🔌 Wiring up a real backend

By default the form simulates API calls with an 800 ms delay. Pass your own async functions to talk to a real backend — no `useMutation` needed, the library tracks loading and errors for you.

<details>
<summary><b>👉 Show full backend wiring example</b></summary>

```tsx
<PersianLoginForm
  type="phone"
  onAuthSuccess={handleSuccess}
  onError={handleError}
  requestOtp={async (phoneNumber) => {
    await fetch("/api/otp/request", {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    });
  }}
  verifyOtp={async (phoneNumber, code) => {
    const res = await fetch("/api/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phoneNumber, code }),
    });
    if (!res.ok) throw new Error("کد تأیید اشتباه است");
  }}
  submitCredentials={async ({ username, email, password }, mode) => {
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) throw new Error("خطا در احراز هویت");
  }}
/>
```

Anything thrown becomes a typed error in `onError`. Anything resolved triggers `onAuthSuccess` with a typed payload.

</details>

---

## 🐙 GitHub OAuth

`GithubLoginButton` performs the redirect half of the standard authorization-code flow:

1. On click, it redirects the browser to `https://github.com/login/oauth/authorize` with `client_id`, `redirect_uri`, `scope`, and a CSRF `state` (persisted in `sessionStorage`).
2. GitHub redirects back to your `redirectUri` with `?code=…&state=…`.
3. The button, when rendered on that return page, reads the `code`, validates `state`, and calls `onAuthSuccess({ type: "github", provider: "github", githubCode })`.
4. **Your server must exchange the code for a token** — this requires the client secret and cannot be done in the browser.

<details>
<summary><b>👉 Show typical server-side exchange</b></summary>

```ts
// Next.js Route Handler example: app/api/github/callback/route.ts
const res = await fetch("https://github.com/login/oauth/access_token", {
  method: "POST",
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  body: JSON.stringify({
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
    redirect_uri: process.env.GITHUB_REDIRECT_URI,
  }),
});
```

</details>

---

## 📚 Public API

| Export                                        | Kind      | Purpose                                                                            |
| --------------------------------------------- | --------- | ---------------------------------------------------------------------------------- |
| `PersianLoginLibrary`                         | component | High-level wrapper with `onAuthSuccess` / `onAuthError`.                           |
| `PersianLoginForm`                            | component | Lower-level form. Accepts custom `requestOtp` / `verifyOtp` / `submitCredentials`. |
| `GithubLoginButton`                           | component | OAuth kick-off + automatic callback handler.                                       |
| `usePersianLoginForm`                         | hook      | Headless form state and handlers for custom UI.                                    |
| `LoginType`, `FormMode`, `AuthSuccessData`, … | types     | See [`src/types.ts`](src/types.ts).                                                |

---

## 🗂️ Repository layout

```
src/                 # library source (shipped)
  index.ts           # public API
  components/        # PersianLoginForm, PersianLoginLibrary, GithubLoginButton
  hooks/             # usePersianLoginForm
  types.ts           # shared public types
  styles.css         # optional default styling (opt-in)
app/                 # Next.js demo / showcase (not shipped)
dist/                # build output (git-ignored)
```

---

## 🛠️ Scripts

```bash
npm run dev         # start the Next.js demo at http://localhost:3000
npm run build       # production build of the demo app
npm run typecheck   # tsc --noEmit across the whole repo
npm run build:lib   # bundle src/ into dist/ (ESM + CJS + .d.ts) via tsup
```

---

## 📄 License

MIT

---

<div align="center">

If `persian-auth` saved you time, please consider giving it a ⭐ on [GitHub](https://github.com/amirmatinjamshidi-rgb/persian-auth) — it really helps.

Made with ❤️ in Iran by [Amir Matin Jamshidi](https://github.com/amirmatinjamshidi-rgb)

</div>
