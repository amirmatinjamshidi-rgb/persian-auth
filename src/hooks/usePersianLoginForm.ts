"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import type {
  AuthErrorHandler,
  AuthSuccessHandler,
  FieldName,
  FormMode,
  LoginType,
  PersianAuthEndpoints,
  PersianFormValues,
} from "../types";

export interface UsePersianLoginFormOptions {
  type: LoginType;
  mode?: FormMode;
  onAuthSuccess?: AuthSuccessHandler;
  onError?: AuthErrorHandler;
  /**
   * Declarative backend URLs — consumed by the internal HTTP client in Part 6.
   *
   * **Today:** accepted for API stability but ignored; keep using `requestOtp`,
   * `verifyOtp`, and `submitCredentials`. After Part 6, omit those callbacks when
   * you only need default JSON `POST` behaviour, or pass both — precedence is
   * documented in that release.
   */
  endpoints?: PersianAuthEndpoints;
  /**
   * Replace with a real call to your backend. Should resolve on success
   * and reject/throw on failure. Defaults to a simulated 1s delay.
   */
  requestOtp?: (phoneNumber: string) => Promise<void>;
  verifyOtp?: (phoneNumber: string, code: string) => Promise<void>;
  submitCredentials?: (
    data: Pick<PersianFormValues, "username" | "email" | "password">,
    mode: FormMode,
  ) => Promise<void>;
}

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

const phoneSchema = z.string().regex(/^09\d{9}$/, "شماره تلفن نادرست است");
const usernameSchema = z
  .string()
  .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد")
  .max(20, "نام کاربری حداکثر ۲۰ کاراکتر است");
const emailSchema = z.string().email("ایمیل نادرست است");
const passwordSchema = z.string().min(5, "رمز عبور باید حداقل پنج کاراکتر باشد");

function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "");

  let normalized = cleaned;
  if (normalized.startsWith("0098")) {
    normalized = `0${normalized.slice(4)}`;
  } else if (normalized.startsWith("98")) {
    normalized = `0${normalized.slice(2)}`;
  } else if (normalized.startsWith("9")) {
    normalized = `0${normalized}`;
  }

  const limited = normalized.slice(0, 11);
  if (limited.length <= 4) return limited;
  if (limited.length <= 7) return `${limited.slice(0, 4)} ${limited.slice(4)}`;
  return `${limited.slice(0, 4)} ${limited.slice(4, 7)} ${limited.slice(7)}`;
}

function normalizePhoneNumber(value: string): string {
  const digitsOnly = value.replace(/\D/g, "");
  if (digitsOnly.startsWith("0098")) return `0${digitsOnly.slice(4, 14)}`.slice(0, 11);
  if (digitsOnly.startsWith("98")) return `0${digitsOnly.slice(2, 12)}`.slice(0, 11);
  if (digitsOnly.startsWith("9")) return `0${digitsOnly.slice(0, 10)}`.slice(0, 11);
  return digitsOnly.slice(0, 11);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const defaultRequestOtp = () => sleep(800);
const defaultVerifyOtp = () => sleep(800);
const defaultSubmitCredentials = () => sleep(800);

export function usePersianLoginForm(options: UsePersianLoginFormOptions) {
  const {
    type,
    mode = "login",
    onAuthSuccess,
    onError,
    requestOtp = defaultRequestOtp,
    verifyOtp = defaultVerifyOtp,
    submitCredentials = defaultSubmitCredentials,
  } = options;

  // `options.endpoints` is deliberately unused until Part 6 wires `authFetch`.

  const [step, setStep] = useState<"form" | "verification">("form");
  const [values, setValues] = useState<PersianFormValues>({
    phoneNumber: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [errors, setErrors] = useState<Partial<Record<FieldName | "otp" | "general", string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  const setField = useCallback((name: FieldName, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: name === "phoneNumber" ? formatPhoneNumber(value) : value,
    }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  const setOtpValue = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    setOtp((prev) => {
      const next = [...prev];
      next[index] = value.slice(-1);
      return next;
    });
    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleOtpKeyDown = useCallback(
    (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace" && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      } else if (event.key === "ArrowLeft" && index > 0) {
        otpRefs.current[index - 1]?.focus();
      } else if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const registerOtpRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      otpRefs.current[index] = el;
    },
    [],
  );

  const validateCredentials = useCallback((): boolean => {
    const nextErrors: Partial<Record<FieldName, string>> = {};

    if (type === "username") {
      const result = usernameSchema.safeParse(values.username);
      if (!result.success) nextErrors.username = result.error.issues[0]?.message;
    } else if (type === "email") {
      const result = emailSchema.safeParse(values.email);
      if (!result.success) nextErrors.email = result.error.issues[0]?.message;
    }

    const pwd = passwordSchema.safeParse(values.password);
    if (!pwd.success) nextErrors.password = pwd.error.issues[0]?.message;

    if (mode === "signup" && values.password !== values.confirmPassword) {
      nextErrors.confirmPassword = "رمزهای عبور مطابقت ندارند";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [type, mode, values]);

  const submitPhone = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const normalizedPhone = normalizePhoneNumber(values.phoneNumber);
      const result = phoneSchema.safeParse(normalizedPhone);
      if (!result.success) {
        setErrors({ phoneNumber: result.error.issues[0]?.message });
        return;
      }
      await requestOtp(normalizedPhone);
      setStep("verification");
      setResendTimer(RESEND_SECONDS);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "خطا در ارسال کد تأیید");
    } finally {
      setIsSubmitting(false);
    }
  }, [values.phoneNumber, requestOtp, onError]);

  const submitOtp = useCallback(async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setErrors({ otp: "کد تأیید باید ۶ رقم باشد" });
      return;
    }
    setIsSubmitting(true);
    try {
      const normalizedPhone = normalizePhoneNumber(values.phoneNumber);
      await verifyOtp(normalizedPhone, code);
      onAuthSuccess?.({
        type: "phone",
        phoneNumber: normalizedPhone,
        otpCode: code,
      });
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "کد تأیید اشتباه است");
    } finally {
      setIsSubmitting(false);
    }
  }, [otp, values.phoneNumber, verifyOtp, onAuthSuccess, onError]);

  const submit = useCallback(async () => {
    if (type === "phone") {
      await submitPhone();
      return;
    }
    if (!validateCredentials()) return;

    setIsSubmitting(true);
    try {
      await submitCredentials(
        { username: values.username, email: values.email, password: values.password },
        mode,
      );
      onAuthSuccess?.({
        type,
        username: type === "username" ? values.username : undefined,
        email: type === "email" ? values.email : undefined,
      });
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "خطا در احراز هویت");
    } finally {
      setIsSubmitting(false);
    }
  }, [type, mode, values, submitPhone, submitCredentials, validateCredentials, onAuthSuccess, onError]);

  const resend = useCallback(async () => {
    if (resendTimer > 0) return;
    try {
      await requestOtp(normalizePhoneNumber(values.phoneNumber));
      setResendTimer(RESEND_SECONDS);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "خطا در ارسال مجدد");
    }
  }, [resendTimer, requestOtp, values.phoneNumber, onError]);

  const backToForm = useCallback(() => {
    setStep("form");
    setOtp(Array(OTP_LENGTH).fill(""));
    setErrors({});
  }, []);

  const canSubmitOtp = useMemo(() => otp.every((v) => v !== ""), [otp]);

  return {
    step,
    values,
    otp,
    errors,
    isSubmitting,
    resendTimer,
    canSubmitOtp,
    otpLength: OTP_LENGTH,
    setField,
    setOtpValue,
    handleOtpKeyDown,
    registerOtpRef,
    submit,
    submitOtp,
    resend,
    backToForm,
    formatPhoneNumber,
  };
}
