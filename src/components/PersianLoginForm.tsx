"use client";
import React from "react";
import {
  usePersianLoginForm,
  type UsePersianLoginFormOptions,
} from "../hooks/usePersianLoginForm";
import type { PersianLoginFormProps } from "../types";

export type PersianLoginFormAdvancedProps = PersianLoginFormProps &
  Pick<UsePersianLoginFormOptions, "requestOtp" | "verifyOtp" | "submitCredentials">;

export const PersianLoginForm: React.FC<PersianLoginFormAdvancedProps> = ({
  type,
  mode = "login",
  onAuthSuccess,
  onError,
  className,
  requestOtp,
  verifyOtp,
  submitCredentials,
}) => {
  const form = usePersianLoginForm({
    type,
    mode,
    onAuthSuccess,
    onError,
    requestOtp,
    verifyOtp,
    submitCredentials,
  });

  const submitLabel =
    type === "phone" ? "ارسال کد تأیید" : mode === "signup" ? "ثبت نام" : "ورود";

  return (
    <div className={`persian-login-form ${className ?? ""}`.trim()}>
      {form.step === "form" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.submit();
          }}
          noValidate
        >
          {type === "phone" && (
            <div className="form-group">
              <label htmlFor="pa-phone">شماره تلفن</label>
              <input
                id="pa-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                value={form.values.phoneNumber}
                onChange={(e) => form.setField("phoneNumber", e.target.value)}
                placeholder="+98 912 345 6789"
                className={`form-input ${form.errors.phoneNumber ? "error" : ""}`}
                aria-invalid={Boolean(form.errors.phoneNumber)}
                aria-describedby={form.errors.phoneNumber ? "pa-phone-error" : undefined}
              />
              {form.errors.phoneNumber && (
                <span id="pa-phone-error" className="error-text" role="alert">
                  {form.errors.phoneNumber}
                </span>
              )}
            </div>
          )}

          {type === "username" && (
            <div className="form-group">
              <label htmlFor="pa-username">نام کاربری</label>
              <input
                id="pa-username"
                type="text"
                autoComplete="username"
                value={form.values.username}
                onChange={(e) => form.setField("username", e.target.value)}
                className={`form-input ${form.errors.username ? "error" : ""}`}
                aria-invalid={Boolean(form.errors.username)}
              />
              {form.errors.username && (
                <span className="error-text" role="alert">
                  {form.errors.username}
                </span>
              )}
            </div>
          )}

          {type === "email" && (
            <div className="form-group">
              <label htmlFor="pa-email">ایمیل</label>
              <input
                id="pa-email"
                type="email"
                autoComplete="email"
                dir="ltr"
                value={form.values.email}
                onChange={(e) => form.setField("email", e.target.value)}
                className={`form-input ${form.errors.email ? "error" : ""}`}
                aria-invalid={Boolean(form.errors.email)}
              />
              {form.errors.email && (
                <span className="error-text" role="alert">
                  {form.errors.email}
                </span>
              )}
            </div>
          )}

          {(type === "username" || type === "email") && (
            <>
              <div className="form-group">
                <label htmlFor="pa-password">رمز عبور</label>
                <input
                  id="pa-password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={form.values.password}
                  onChange={(e) => form.setField("password", e.target.value)}
                  className={`form-input ${form.errors.password ? "error" : ""}`}
                  aria-invalid={Boolean(form.errors.password)}
                />
                {form.errors.password && (
                  <span className="error-text" role="alert">
                    {form.errors.password}
                  </span>
                )}
              </div>

              {mode === "signup" && (
                <div className="form-group">
                  <label htmlFor="pa-confirm">تکرار رمز عبور</label>
                  <input
                    id="pa-confirm"
                    type="password"
                    autoComplete="new-password"
                    value={form.values.confirmPassword}
                    onChange={(e) => form.setField("confirmPassword", e.target.value)}
                    className={`form-input ${form.errors.confirmPassword ? "error" : ""}`}
                    aria-invalid={Boolean(form.errors.confirmPassword)}
                  />
                  {form.errors.confirmPassword && (
                    <span className="error-text" role="alert">
                      {form.errors.confirmPassword}
                    </span>
                  )}
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={form.isSubmitting}
            className="btn primary-btn"
          >
            {form.isSubmitting ? "در حال پردازش..." : submitLabel}
          </button>
        </form>
      ) : (
        <div className="verification-step">
          <h3>کد تأیید را وارد کنید</h3>
          <p className="instructions">
            کد تأیید به شماره <span dir="ltr">{form.values.phoneNumber}</span> ارسال شد.
          </p>

          <div className="otp-inputs-container" dir="ltr">
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
                className={`otp-input ${form.errors.otp ? "error" : ""}`}
                aria-label={`رقم ${index + 1} از کد تأیید`}
              />
            ))}
          </div>
          {form.errors.otp && (
            <span className="error-text" role="alert">
              {form.errors.otp}
            </span>
          )}

          <button
            type="button"
            disabled={form.resendTimer > 0}
            onClick={() => void form.resend()}
            className="resend-btn"
          >
            {form.resendTimer > 0
              ? `ارسال مجدد بعد از ${form.resendTimer} ثانیه`
              : "ارسال مجدد کد"}
          </button>

          <div className="actions">
            <button
              type="button"
              onClick={() => void form.submitOtp()}
              disabled={form.isSubmitting || !form.canSubmitOtp}
              className="btn primary-btn"
            >
              {form.isSubmitting ? "در حال بررسی..." : "تأیید کد"}
            </button>
            <button type="button" onClick={form.backToForm} className="btn secondary-btn">
              بازگشت
            </button>
          </div>
        </div>
      )}

      {form.errors.general && (
        <div className="error-message" role="alert">
          {form.errors.general}
        </div>
      )}
    </div>
  );
};

export default PersianLoginForm;
