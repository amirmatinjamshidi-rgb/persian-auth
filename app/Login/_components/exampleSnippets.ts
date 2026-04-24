export const phoneNumberPageSource = `import { ExampleShell } from "../_components/ExampleShell";
import { PersianMethodExamples } from "../_components/PersianMethodExamples";

export default function PhoneNumberExamplePage() {
  return (
    <ExampleShell
      title="Phone Number + OTP"
      description="Two demos: normal success flow and forced-error flow."
      sourceCode={phoneNumberPageSource}
    >
      <PersianMethodExamples type="phone" mode="login" />
    </ExampleShell>
  );
}`;

export const userPasswordPageSource = `import { ExampleShell } from "../_components/ExampleShell";
import { PersianMethodExamples } from "../_components/PersianMethodExamples";

export default function UserPasswordExamplePage() {
  return (
    <ExampleShell
      title="Username + Password (Login)"
      description="Compare successful login behavior with forced failure behavior."
      sourceCode={userPasswordPageSource}
    >
      <PersianMethodExamples type="username" mode="login" />
    </ExampleShell>
  );
}`;

export const emailPasswordPageSource = `import { ExampleShell } from "../_components/ExampleShell";
import { PersianMethodExamples } from "../_components/PersianMethodExamples";
import type { PersianLoginClassNames } from "@/src";

const normalFormStyles: PersianLoginClassNames = {
  inputByField: {
    email: "rounded-xl border border-emerald-400/40 ...",
    password: "rounded-xl border border-emerald-400/40 ...",
  },
};

const failFormStyles: PersianLoginClassNames = {
  inputByField: {
    email: "rounded-xl border border-rose-400/40 ...",
    password: "rounded-xl border border-rose-400/40 ...",
  },
  inputErrorByField: {
    email: "border-rose-500 ring-2 ring-rose-500/25",
    password: "border-rose-500 ring-2 ring-rose-500/25",
  },
};

export default function EmailPasswordExamplePage() {
  return (
    <ExampleShell
      title="Email + Password"
      description="Two grids: one normal, one always throwing an error."
      sourceCode={emailPasswordPageSource}
    >
      <PersianMethodExamples
        type="email"
        mode="login"
        normalClassNames={normalFormStyles}
        failClassNames={failFormStyles}
      />
    </ExampleShell>
  );
}`;

export const userSignupPageSource = `import { ExampleShell } from "../_components/ExampleShell";
import { PersianMethodExamples } from "../_components/PersianMethodExamples";

export default function UserSignupExamplePage() {
  return (
    <ExampleShell
      title="Username + Password (Signup)"
      description="One real signup demo and one always-failing demo."
      sourceCode={userSignupPageSource}
    >
      <PersianMethodExamples type="username" mode="signup" />
    </ExampleShell>
  );
}`;

export const githubPageSource = `import { ExampleShell } from "../_components/ExampleShell";
import { GithubMethodExamples } from "../_components/GithubMethodExamples";

export default function GitHubExamplePage() {
  return (
    <ExampleShell
      title="GitHub OAuth"
      description="One real OAuth starter button and one forced-failure demo."
      sourceCode={githubPageSource}
    >
      <GithubMethodExamples />
    </ExampleShell>
  );
}`;
