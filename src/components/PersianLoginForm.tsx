"use client";
import React from "react";
import {
  usePersianLoginForm,
  type UsePersianLoginFormOptions,
} from "../hooks/usePersianLoginForm";
import type { PersianInputSlot, PersianLoginFormProps } from "../types";

export type PersianLoginFormAdvancedProps = PersianLoginFormProps &
  Pick<UsePersianLoginFormOptions, "requestOtp" | "verifyOtp" | "submitCredentials">;

function cx(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

const defaults = {
  formRoot: "flex flex-col gap-4",
  form: "flex flex-col gap-3",
  formGroup: "flex flex-col gap-1.5",
  label: "text-sm font-medium text-zinc-200",
  input:
    "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20",
  inputError: "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
  errorText: "text-xs text-rose-300",
  submitButton:
    "inline-flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60",
  verificationStep: "flex flex-col gap-3",
  verificationTitle: "text-base font-semibold text-zinc-100",
  instructions: "text-sm text-zinc-400",
  otpContainer: "flex justify-center gap-2",
  otpInput:
    "h-11 w-10 rounded-lg border border-zinc-700 bg-zinc-900 text-center text-lg text-zinc-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20",
  resendButton:
    "rounded-lg border border-cyan-500/40 px-3 py-2 text-xs text-cyan-300 transition hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60",
  actions: "mt-1 flex gap-2",
  primaryActionButton:
    "flex-1 rounded-lg bg-cyan-500 px-3 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60",
  secondaryActionButton:
    "flex-1 rounded-lg bg-zinc-700 px-3 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-600",
  generalError: "rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200",
};

interface TextFieldOptions {
  slot: Exclude<PersianInputSlot, "otp">;
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  dir?: "ltr" | "rtl" | "auto";
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
}

export const PersianLoginForm: React.FC<PersianLoginFormAdvancedProps> = ({
  type,
  mode = "login",
  onAuthSuccess,
  onError,
  className,
  classNames,
  endpoints,
  requestOtp,
  verifyOtp,
  submitCredentials,
}) => {
  const form = usePersianLoginForm({
    type,
    mode,
    onAuthSuccess,
    onError,
    endpoints,
    requestOtp,
    verifyOtp,
    submitCredentials,
  });

  const submitLabel =
    type === "phone" ? "ارسال کد تأیید" : mode === "signup" ? "ثبت نام" : "ورود";

  const getInputClass = (slot: PersianInputSlot, hasError: boolean): string =>
    cx(
      defaults.input,
      hasError && defaults.inputError,
      classNames?.input,
      classNames?.inputByField?.[slot],
      hasError && classNames?.inputError,
      hasError && classNames?.inputErrorByField?.[slot],
    );

  const renderTextField = ({
    slot,
    id,
    label,
    value,
    error,
    onChange,
    type: inputType = "text",
    autoComplete,
    dir,
    inputMode,
    placeholder,
  }: TextFieldOptions) => (
    <div className={cx(defaults.formGroup, classNames?.formGroup)} data-pa-group={slot}>
      <label htmlFor={id} className={cx(defaults.label, classNames?.label)} data-pa-label={slot}>
        {label}
      </label>
      <input
        id={id}
        type={inputType}
        autoComplete={autoComplete}
        dir={dir}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={getInputClass(slot, Boolean(error))}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        data-pa-input={slot}
      />
      {error && (
        <span
          id={`${id}-error`}
          className={cx(defaults.errorText, classNames?.errorText)}
          role="alert"
          data-pa-error={slot}
        >
          {error}
        </span>
      )}
    </div>
  );

  return (
    <div
      className={cx(defaults.formRoot, className, classNames?.formRoot)}
      data-pa-form-root="true"
    >
      {form.step === "form" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.submit();
          }}
          noValidate
          className={cx(defaults.form, classNames?.form)}
          data-pa-form="true"
        >
          {type === "phone" && (
            renderTextField({
              slot: "phone",
              id: "pa-phone",
              label: "شماره تلفن",
              value: form.values.phoneNumber,
              error: form.errors.phoneNumber,
              onChange: (value) => form.setField("phoneNumber", value),
              type: "tel",
              inputMode: "tel",
              autoComplete: "tel",
              dir: "ltr",
              placeholder: "+98 912 345 6789",
            })
          )}

          {type === "username" && (
            renderTextField({
              slot: "username",
              id: "pa-username",
              label: "نام کاربری",
              value: form.values.username,
              error: form.errors.username,
              onChange: (value) => form.setField("username", value),
              autoComplete: "username",
            })
          )}

          {type === "email" && (
            renderTextField({
              slot: "email",
              id: "pa-email",
              label: "ایمیل",
              value: form.values.email,
              error: form.errors.email,
              onChange: (value) => form.setField("email", value),
              type: "email",
              autoComplete: "email",
              dir: "ltr",
            })
          )}

          {(type === "username" || type === "email") && (
            <>
              {renderTextField({
                slot: "password",
                id: "pa-password",
                label: "رمز عبور",
                value: form.values.password,
                error: form.errors.password,
                onChange: (value) => form.setField("password", value),
                type: "password",
                autoComplete: mode === "signup" ? "new-password" : "current-password",
              })}

              {mode === "signup" && (
                renderTextField({
                  slot: "confirmPassword",
                  id: "pa-confirm",
                  label: "تکرار رمز عبور",
                  value: form.values.confirmPassword,
                  error: form.errors.confirmPassword,
                  onChange: (value) => form.setField("confirmPassword", value),
                  type: "password",
                  autoComplete: "new-password",
                })
              )}
            </>
          )}

          <button
            type="submit"
            disabled={form.isSubmitting}
            className={cx(defaults.submitButton, classNames?.submitButton)}
            data-pa-button="submit"
          >
            {form.isSubmitting ? "در حال پردازش..." : submitLabel}
          </button>
        </form>
      ) : (
        <div
          className={cx(defaults.verificationStep, classNames?.verificationStep)}
          data-pa-verification="true"
        >
          <h3 className={defaults.verificationTitle}>کد تأیید را وارد کنید</h3>
          <p className={cx(defaults.instructions, classNames?.instructions)}>
            کد تأیید به شماره <span dir="ltr">{form.values.phoneNumber}</span> ارسال شد.
          </p>

          <div className={cx(defaults.otpContainer, classNames?.otpContainer)} dir="ltr">
            {Array.from({ length: form.otpLength }).map((_, index) => (
              <input
                key={index}
                ref={form.registerOtpRef(index)}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={form.otp[index]}
                onChange={(e) => form.setOtpValue(index, e.target.value)}
                onKeyDown={(e) => form.handleOtpKeyDown(index, e)}
                className={cx(
                  defaults.otpInput,
                  form.errors.otp && defaults.inputError,
                  classNames?.input,
                  classNames?.inputByField?.otp,
                  classNames?.otpInput,
                  form.errors.otp && classNames?.inputError,
                  form.errors.otp && classNames?.inputErrorByField?.otp,
                  form.errors.otp && classNames?.otpInputError,
                )}
                aria-label={`رقم ${index + 1} از کد تأیید`}
                data-pa-otp-input={index + 1}
              />
            ))}
          </div>
          {form.errors.otp && (
            <span
              className={cx(defaults.errorText, classNames?.errorText)}
              role="alert"
              data-pa-error="otp"
            >
              {form.errors.otp}
            </span>
          )}

          <button
            type="button"
            disabled={form.resendTimer > 0}
            onClick={() => void form.resend()}
            className={cx(defaults.resendButton, classNames?.resendButton)}
            data-pa-button="resend"
          >
            {form.resendTimer > 0
              ? `ارسال مجدد بعد از ${form.resendTimer} ثانیه`
              : "ارسال مجدد کد"}
          </button>

          <div className={cx(defaults.actions, classNames?.actions)}>
            <button
              type="button"
              onClick={() => void form.submitOtp()}
              disabled={form.isSubmitting || !form.canSubmitOtp}
              className={cx(defaults.primaryActionButton, classNames?.primaryActionButton)}
              data-pa-button="verifyOtp"
            >
              {form.isSubmitting ? "در حال بررسی..." : "تأیید کد"}
            </button>
            <button
              type="button"
              onClick={form.backToForm}
              className={cx(defaults.secondaryActionButton, classNames?.secondaryActionButton)}
              data-pa-button="back"
            >
              بازگشت
            </button>
          </div>
        </div>
      )}

      {form.errors.general && (
        <div className={cx(defaults.generalError, classNames?.generalError)} role="alert">
          {form.errors.general}
        </div>
      )}
    </div>
  );
};

export default PersianLoginForm;
