# persian-auth

Persian (Farsi) authentication React components — phone + OTP, username/password, email, and GitHub OAuth. RTL-ready, typed, zero UI framework coupling.

- Shipped as both ESM and CJS with type definitions.
- Works in any React 18/19 app (Next.js, Vite, CRA, Remix, …).
- All Persian copy is built-in; errors are surfaced as typed callbacks.
- Validation with [`zod`](https://zod.dev).

---

## Repository layout

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

## Scripts

```bash
npm run dev         # start the Next.js demo at http://localhost:3000
npm run build       # production build of the demo app
npm run typecheck   # tsc --noEmit across the whole repo
npm run build:lib   # bundle src/ into dist/ (ESM + CJS + .d.ts) via tsup
```

## Using the library in a consumer app

```tsx
import {
  PersianLoginLibrary,
  GithubLoginButton,
  type AuthSuccessData,
} from "persian-auth";
import "persian-auth/styles.css"; // optional default styling

export function LoginPage() {
  const onAuthSuccess = (data: AuthSuccessData) => {
    console.log("logged in:", data);
  };
  const onAuthError = (err: string) => console.error(err);

  return (
    <>
      <PersianLoginLibrary
        type="phone"
        onAuthSuccess={onAuthSuccess}
        onAuthError={onAuthError}
      />
      <PersianLoginLibrary
        type="email"
        onAuthSuccess={onAuthSuccess}
        onAuthError={onAuthError}
      />
      <PersianLoginLibrary
        type="username"
        mode="signup"
        onAuthSuccess={onAuthSuccess}
        onAuthError={onAuthError}
      />
      <GithubLoginButton
        clientId={process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!}
        redirectUri="https://example.com/login"
        onAuthSuccess={onAuthSuccess}
        onError={onAuthError}
      />
    </>
  );
}
```

Wrap your app in an RTL container for correct layout:

```tsx
<html lang="fa" dir="rtl">…</html>
```

## Wiring up a real backend

By default the form simulates API calls with an 800 ms delay. Supply your own functions to talk to a real backend:

```tsx
<PersianLoginForm
  type="phone"
  onAuthSuccess={onAuthSuccess}
  onError={onAuthError}
  requestOtp={async (phoneNumber) => {
    await fetch("/api/otp/request", { method: "POST", body: JSON.stringify({ phoneNumber }) });
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

## GitHub OAuth

`GithubLoginButton` performs the redirect half of the standard authorization-code flow:

1. On click it redirects the browser to `https://github.com/login/oauth/authorize`, passing `client_id`, `redirect_uri`, `scope`, and a CSRF `state` (persisted in `sessionStorage`).
2. GitHub redirects back to your `redirectUri` with `?code=…&state=…`.
3. The button, if rendered on that return page, reads the `code`, validates `state`, and calls `onAuthSuccess({ type: "github", provider: "github", githubCode })`.
4. **Your server must exchange the code for a token** (this requires the client secret and therefore can't be done in the browser).

Typical server-side exchange:

```ts
// Next.js Route Handler example (app/api/github/callback/route.ts)
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

## Publishing as an npm package

The package is currently `"private": true` so it can't be published accidentally. When you're ready:

1. Remove `"private": true` from `package.json`.
2. Pick a final `name` (`persian-auth` may already be taken on npm — check first).
3. `npm run build:lib` — outputs `dist/` with ESM, CJS, and `.d.ts`.
4. `npm publish --access public`.

## Public API

| Export                       | Kind      | Purpose                                          |
| ---------------------------- | --------- | ------------------------------------------------ |
| `PersianLoginLibrary`        | component | Wrapper with `onAuthSuccess` / `onAuthError`.    |
| `PersianLoginForm`           | component | Low-level form; also exposes `requestOtp` etc.   |
| `GithubLoginButton`          | component | OAuth kick-off + callback handler.               |
| `usePersianLoginForm`        | hook      | All form state & handlers if you want your own UI.|
| `LoginType`, `FormMode`, …   | types     | Public types (see `src/types.ts`).               |

## Development

```bash
npm install
npm run dev           # http://localhost:3000 – live demo
npm run typecheck
npm run build:lib     # sanity-check library bundle
```
