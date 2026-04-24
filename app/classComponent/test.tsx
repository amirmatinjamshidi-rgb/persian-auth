"use client";
import { PersianLoginClassNames } from "@/src";
import { PersianLoginLibrary } from "@/src";
const signInTheme: PersianLoginClassNames = {
  container:
    "max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl",
  formRoot: "gap-5",
  form: "gap-4",
  formGroup: "gap-2",
  label: "text-sm font-semibold text-zinc-700",
  input:
    "h-12 rounded-xl border border-zinc-300 bg-white px-4 text-base text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15",
  inputByField: {
    email: "h-14 text-lg",
    password: "h-14 text-lg tracking-wide",
  },
  inputError: "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
  inputErrorByField: {
    email: "bg-rose-50",
    password: "bg-rose-50",
  },
  errorText: "text-xs font-medium text-rose-600",
  submitButton:
    "h-14 rounded-xl bg-indigo-600 text-base font-bold text-white transition hover:bg-indigo-500",
};

export default function SignInPage() {
  return (
    <PersianLoginLibrary
      type="email"
      mode="login"
      classNames={signInTheme}
      onAuthSuccess={(data) => console.log("success", data)}
      onAuthError={(error) => console.error("error", error)}
    />
  );
}
