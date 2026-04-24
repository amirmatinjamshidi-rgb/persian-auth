import { ExampleShell } from "../_components/ExampleShell";
import { GithubMethodExamples } from "../_components/GithubMethodExamples";
import { githubPageSource } from "../_components/exampleSnippets";

export default function GitHubExamplePage() {
  return (
    <ExampleShell
      title="Login / GitHub"
      description="Two examples below: real OAuth starter and forced error thrower."
      sourceCode={githubPageSource}
    >
      <GithubMethodExamples />
    </ExampleShell>
  );
}
