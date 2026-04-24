import { ExampleShell } from "../_components/ExampleShell";
import { PersianMethodExamples } from "../_components/PersianMethodExamples";
import { phoneNumberPageSource } from "../_components/exampleSnippets";

export default function PhoneNumberExamplePage() {
  return (
    <ExampleShell
      title="Login / PhoneNumber"
      description="Two examples below: one normal phone + OTP flow, and one forced error returner."
      sourceCode={phoneNumberPageSource}
    >
      <PersianMethodExamples type="phone" mode="login" />
    </ExampleShell>
  );
}
