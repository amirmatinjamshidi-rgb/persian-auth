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
}) => {
  return (
    <div className={`persian-login-container ${className ?? ""}`.trim()}>
      <PersianLoginForm
        type={type}
        mode={mode}
        onAuthSuccess={onAuthSuccess}
        onError={onAuthError}
      />
    </div>
  );
};

export default PersianLoginLibrary;
