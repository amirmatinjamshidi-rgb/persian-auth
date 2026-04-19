import React from "react";
import PersianLoginForm from "./persianForm";

interface LoginFormData {
  username?: string;
  password?: string;
  phoneNumber?: string;
  otpCode?: string;
}
type LoginType = "phone" | "email" | "username";
interface LoginFormProps {
  type: LoginType;
  onLoginSuccess?: (data: any) => void;
  onSignUpSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}
export interface PersiaLoginLibraryProps extends LoginFormProps {
  type: any;
  onAuthSuccess: (data: LoginFormData) => void;
  onAuthError?: (error: string) => void;
  className?: string;
}

const PersianLoginLibrary: React.FC<PersiaLoginLibraryProps> = ({
  type,
  onAuthSuccess,
  onAuthError,
  className,
}) => {
  const handleLoginSuccess = (data: any) => {
    if (type === "phone") {
      onAuthSuccess({
        phoneNumber: data.phoneNumber,
        otpCode: undefined, // Not applicable for phone login flow
      });
    } else {
      onAuthSuccess({
        username: data.username,
        password: undefined,
        otpCode: undefined,
      });
    }
  };

  const handleSignUpSuccess = (data: any) => {
    if (type === "phone") {
      onAuthSuccess({
        phoneNumber: data.phoneNumber,
        otpCode: undefined, // Not applicable for phone signup flow
      });
    } else {
      onAuthSuccess({
        username: data.username,
        password: undefined,
        otpCode: undefined,
      });
    }
  };

  return (
    <div className={`persian-login-container ${className || ""}`}>
      <PersianLoginForm
        type={type}
        onLoginSuccess={handleLoginSuccess}
        onSignUpSuccess={handleSignUpSuccess}
        onError={(error) => {
          if (onAuthError) {
            onAuthError(error);
          }
        }}
      />
    </div>
  );
};

export default PersianLoginLibrary;
