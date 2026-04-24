import { ExampleShell } from "../_components/ExampleShell";
import { PersianMethodExamples } from "../_components/PersianMethodExamples";
import { emailPasswordPageSource } from "../_components/exampleSnippets";
import type { PersianLoginClassNames } from "@/src";

const normalFormStyles: PersianLoginClassNames = {
  inputByField: {
    email:
      "rounded-xl border border-emerald-400/40 bg-zinc-900 px-4 py-2.5 text-emerald-100 focus:border-emerald-300 focus:ring-emerald-400/30",
    password:
      "rounded-xl border border-emerald-400/40 bg-zinc-900 px-4 py-2.5 text-emerald-100 focus:border-emerald-300 focus:ring-emerald-400/30",
  },
  submitButton:
    "rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300",
};

const failFormStyles: PersianLoginClassNames = {
  inputByField: {
    email:
      "rounded-xl border border-rose-400/40 bg-zinc-900 px-4 py-2.5 text-rose-100 focus:border-rose-300 focus:ring-rose-400/30",
    password:
      "rounded-xl border border-rose-400/40 bg-zinc-900 px-4 py-2.5 text-rose-100 focus:border-rose-300 focus:ring-rose-400/30",
  },
  submitButton:
    "rounded-xl bg-rose-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-rose-300",
  inputErrorByField: {
    email: "border-rose-500 ring-2 ring-rose-500/25",
    password: "border-rose-500 ring-2 ring-rose-500/25",
  },
};

export default function EmailPasswordExamplePage() {
  return (
    <ExampleShell
      title="Login / EmailPassword"
      description="Two examples below: successful email login and always-failing error demo."
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
}
