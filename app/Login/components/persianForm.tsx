"use client";
import React, { useState, useEffect, useCallback } from "react";
import { z } from "zod";

type LoginType = "phone" | "email" | "username";

interface LoginFormProps {
  type: LoginType;
  onLoginSuccess?: (data: any) => void;
  onSignUpSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

const PersianLoginForm: React.FC<LoginFormProps> = ({
  type,
  onLoginSuccess,
  onSignUpSuccess,
  onError,
}) => {
  const [loginStep, setLoginStep] = useState<"form" | "verification">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // For phone verification
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(0);

  // For username/password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation schemas
  const phoneSchema = z.string().regex(/^(\+98|0)9\d{9}$/);
  const usernameSchema = z.string().min(3).max(20);
  const passwordSchema = z.string().min(8);

  // Phone number formatting
  const formatPhoneNumber = useCallback((value: string): string => {
    if (!value.startsWith("+")) return value;

    // Remove all non-digit characters except + at the beginning
    const cleaned = value.replace(/[^\d+]/g, "").replace(/^\+/, "");

    if (cleaned.length === 10) {
      return `+98 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }

    // For other formats
    const formatted = cleaned.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
    return `+98 ${formatted}`;
  }, []);

  // Handle phone number input with formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith("+") && value.length > 0) {
      setPhoneNumber(formatPhoneNumber(value));
    } else {
      setPhoneNumber(value);
    }

    // Clear error when user starts typing
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    }
  };

  // OTP handling
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);

    // Auto move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }

    // Handle arrow keys for navigation
    if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Validate and submit phone verification
  const validateAndSubmitPhone = async () => {
    setIsSubmitting(true);

    try {
      // Validate phone number format
      if (!phoneSchema.safeParse(phoneNumber).success) {
        setErrors({ phoneNumber: "شماره تلفن نادرست است" });
        return;
      }

      // Simulate API call - in real implementation use react-query or axios
      const response: any = await new Promise((resolve) =>
        setTimeout(() => resolve({ success: true }), 1000),
      );

      if (response.success) {
        setLoginStep("verification");
        startResendTimer();
      } else {
        throw new Error("خطا در ارسال کد تأیید");
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "خطای نامشخص");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Send OTP code
  const sendOtp = async () => {
    try {
      if (!otpValues.some((v) => v === "")) {
        const otpCode = otpValues.join("");

        // Simulate verification API call
        const response: any = await new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 1000),
        );

        if (response.success) {
          onLoginSuccess?.({ phoneNumber });
        } else {
          throw new Error("کد تأیید اشتباه است");
        }
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "خطای نامشخص");
    }
  };

  // Username/password validation and submission
  const validateAndSubmitCredentials = async () => {
    setIsSubmitting(true);

    try {
      if (type === "username") {
        // Validate username
        const userValidation = usernameSchema.safeParse(username);
        if (!userValidation.success) {
          setErrors({
            username:
              "نام کاربری باید حداقل 3 کاراکتر و حداکثر 20 کاراکتر باشد",
          });
          return;
        }

        // Validate password
        const passValidation = passwordSchema.safeParse(password);
        if (!passValidation.success) {
          setErrors({ password: "رمز عبور باید حداقل 8 کاراکتر باشد" });
          return;
        }

        // Check passwords match for sign up
        if (password !== confirmPassword && onSignUpSuccess) {
          setErrors({ confirmPassword: "رمزهای عبور مطابقت ندارند" });
          return;
        }
      }

      // Simulate API call - replace with react-query in real implementation
      const response: any = await new Promise((resolve) =>
        setTimeout(() => resolve({ success: true }), 1000),
      );

      if (response.success) {
        if (onSignUpSuccess && !onLoginSuccess) {
          onSignUpSuccess({ username });
        } else {
          onLoginSuccess?.({ username });
        }
      } else {
        throw new Error("خطا در احراز هویت");
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "خطای نامشخص");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Timer for resend OTP
  const startResendTimer = () => {
    setResendTimer(60);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }

    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Reset form
  const resetForm = () => {
    setLoginStep("form");
    setErrors({});
    setPhoneNumber("");
    setOtpValues(Array(6).fill(""));
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  // Render the appropriate form based on type and step
  return (
    <div className="persian-login-form">
      {loginStep === "form" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (type === "phone") validateAndSubmitPhone();
            else validateAndSubmitCredentials();
          }}
        >
          {type === "phone" && (
            <div className="form-group">
              <label htmlFor="phone">شماره تلفن</label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="+98 912 345 6789"
                className={`form-input ${errors.phoneNumber ? "error" : ""}`}
              />
              {errors.phoneNumber && (
                <span className="error-text">{errors.phoneNumber}</span>
              )}
            </div>
          )}

          {(type === "username" || type === "email") && (
            <>
              <div className="form-group">
                <label htmlFor="username">نام کاربری</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username)
                      setErrors((prev) => ({ ...prev, username: "" }));
                  }}
                  className={`form-input ${errors.username ? "error" : ""}`}
                />
                {errors.username && (
                  <span className="error-text">{errors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">رمز عبور</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className={`form-input ${errors.password ? "error" : ""}`}
                />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              {type === "username" && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">تکرار رمز عبور</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                    className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                  />
                  {errors.confirmPassword && (
                    <span className="error-text">{errors.confirmPassword}</span>
                  )}
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn primary-btn"
          >
            {isSubmitting
              ? "در حال پردازش..."
              : type === "phone"
                ? "ارسال کد تأیید"
                : "ورود"}
          </button>
        </form>
      ) : (
        <div className="verification-step">
          <h3>کد تأیید را وارد کنید</h3>

          <p className="instructions">
            کد تأیید به شماره {phoneNumber} ارسال شده است
          </p>

          <div className="otp-inputs-container">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="tel"
                maxLength={1}
                value={otpValues[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`otp-input ${errors.otp ? "error" : ""}`}
              />
            ))}
          </div>

          <button
            type="button"
            disabled={resendTimer > 0}
            onClick={() => {
              // Simulate resend functionality
              startResendTimer();
            }}
            className="resend-btn"
          >
            {resendTimer > 0
              ? `ارسال مجدد بعد از ${resendTimer} ثانیه`
              : "ارسال مجدد کد"}
          </button>

          <div className="actions">
            <button
              type="button"
              onClick={() => {
                const otpCode = otpValues.join("");
                if (otpCode.length === 6) {
                  sendOtp();
                }
              }}
              disabled={isSubmitting || !otpValues.every((v) => v !== "")}
              className="btn primary-btn"
            >
              تأیید کد
            </button>

            <button
              type="button"
              onClick={() => setLoginStep("form")}
              className="btn secondary-btn"
            >
              بازگشت به فرم ورود
            </button>
          </div>
        </div>
      )}

      {errors.general && <div className="error-message">{errors.general}</div>}
    </div>
  );
};

export default PersianLoginForm;
