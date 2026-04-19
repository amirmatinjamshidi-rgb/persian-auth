import { useState, useCallback } from "react";

interface UsePersianLoginFormProps {
  type: "phone" | "username";
  onAuthSuccess?: (
    data: string | boolean | number | undefined | symbol,
  ) => void;
  onError?: (error: string) => void;
}

export const usePersianLoginForm = ({
  type,
  onAuthSuccess,
  onError,
}: UsePersianLoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Phone function
  const formatPhoneNumber = useCallback((value: string): string => {
    if (!value.startsWith("+")) return value;

    const cleaned = value.replace(/[^\d+]/g, "").replace(/^\+/, "");

    if (cleaned.length === 10) {
      return `+98 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }

    const formatted = cleaned.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
    return `+98 ${formatted}`;
  }, []);

  // Validation function
  const validateForm = useCallback(
    (formData: any): boolean => {
      setErrors({});

      if (type === "phone") {
        const phoneRegex = /^(\+98|0)9\d{9}$/;
        if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
          setErrors({ phoneNumber: "شماره تلفن نادرست است" });
          return false;
        }
      } else {
        if (!formData.username || formData.username.length < 3) {
          setErrors({ username: "نام کاربری باید حداقل 3 کاراکتر باشد" });
          return false;
        }

        if (!formData.password || formData.password.length < 8) {
          setErrors({ password: "رمز عبور باید حداقل 8 کاراکتر باشد" });
          return false;
        }
      }

      return true;
    },
    [type],
  );

  // Submit handler
  const submitForm = useCallback(
    async (formData: any, isSignUp?: boolean) => {
      setIsLoading(true);

      try {
        // Simulate API call with react-query or axios in real implementation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (validateForm(formData)) {
          onAuthSuccess?.(formData);
        } else {
          throw new Error("خطا در اعتبارسنجی فرم");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "خطای نامشخص";
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [onAuthSuccess, onError, validateForm],
  );

  return {
    isLoading,
    errors,
    formatPhoneNumber,
    submitForm,
  };
};
