"use client";

import { useState } from "react";

interface SourceCodePanelProps {
  title?: string;
  code: string;
}

export function SourceCodePanel({ title = "Source code", code }: SourceCodePanelProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="rounded-lg border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20"
        >
          {isVisible ? "Hide code" : "Show code"}
        </button>
      </div>

      {isVisible && (
        <pre dir="ltr" className="mt-4 overflow-x-auto rounded-xl border border-zinc-800 bg-black/60 p-4 text-xs leading-6 text-zinc-200 sm:text-sm">
          <code>{code}</code>
        </pre>
      )}
    </section>
  );
}
