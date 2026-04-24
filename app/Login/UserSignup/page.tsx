import { ExampleShell } from "../_components/ExampleShell";
import { PersianMethodExamples } from "../_components/PersianMethodExamples";
import { userSignupPageSource } from "../_components/exampleSnippets";

export default function UserSignupExamplePage() {
  return (
    <ExampleShell
      title="Login / UserSignup"
      description="Two examples below: normal signup path and an always-error returner."
      sourceCode={userSignupPageSource}
    >
      <PersianMethodExamples type="username" mode="signup" />
    </ExampleShell>
  );
}
