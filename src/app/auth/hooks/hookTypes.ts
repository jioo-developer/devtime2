import { UseFormClearErrors, UseFormSetError } from "react-hook-form";
import { AuthFormData } from "../Client";

export interface CheckDuplicateResponse {
  success: boolean;
  available: boolean;
  message: string;
}

export interface UseChecValidationlParams {
  setError: UseFormSetError<AuthFormData>;
  clearErrors: UseFormClearErrors<AuthFormData>;
  setSuccessMessage: (message: string) => void;
}
