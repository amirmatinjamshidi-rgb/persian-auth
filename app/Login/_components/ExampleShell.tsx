import Link from "next/link";
import type { ReactNode } from "react";
import { SourceCodePanel } from "./SourceCodePanel";

interface ExampleShellProps {
  title: string;
  description: string;
  sourceCode: string;
  children: ReactNode;
}

export function ExampleShell({ title, description, sourceCode, children }: ExampleShellProps) {
  return (
    <main className="min-h-screen bg-[#0e0b0b] px-4 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-2xl bg-[#141416] p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/Login"
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
          >
            Back to Login Index
          </Link>
        </div>

        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
          <p className="mx-auto max-w-2xl text-sm text-zinc-400 sm:text-base">{description}</p>
        </header>

        {children}

        <SourceCodePanel title="Page usage source" code={sourceCode} />
      </div>
    </main>
  );
}
