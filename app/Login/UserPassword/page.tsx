import { ExampleShell } from "../_components/ExampleShell";
import { PersianMethodExamples } from "../_components/PersianMethodExamples";
import { userPasswordPageSource } from "../_components/exampleSnippets";

export default function UserPasswordExamplePage() {
  return (
    <ExampleShell
      title="Login / UserPassword"
      description="Two examples below: normal username login and a card that always throws errors."
      sourceCode={userPasswordPageSource}
    >
      <PersianMethodExamples type="username" mode="login" />
    </ExampleShell>
  );
}
