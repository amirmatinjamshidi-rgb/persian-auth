"use client";
import React from "react";
import { PersianLoginForm } from "./PersianLoginForm";
import type { PersianLoginLibraryProps } from "../types";

/**
 * High-level wrapper that mirrors the original API:
 *   - `onAuthSuccess` (required)
 *   - `onAuthError`   (optional)
 *
 * Internally renders `PersianLoginForm`, which owns the state via
 * `usePersianLoginForm`.
 */
export const PersianLoginLibrary: React.FC<PersianLoginLibraryProps> = ({
  type,
  mode,
  onAuthSuccess,
  onAuthError,
  className,
  classNames,
}) => {
  return (
    <div
      className={`mx-auto w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 text-zinc-100 shadow-lg ${className ?? ""} ${classNames?.container ?? ""}`.trim()}
      data-pa-container="true"
    >
      <PersianLoginForm
        type={type}
        mode={mode}
        onAuthSuccess={onAuthSuccess}
        onError={onAuthError}
        classNames={classNames}
      />
    </div>
  );
};

export default PersianLoginLibrary;
