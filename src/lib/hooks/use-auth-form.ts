"use client";

import { useState, useTransition, useCallback } from "react";
import { HttpError } from "@/lib/api/http-client";

type FieldErrors<T> = Partial<Record<keyof T, string>>;

interface UseAuthFormOptions<T> {
  initialValues: T;
  validate: (values: T) => FieldErrors<T>;
  onSubmit: (values: T) => Promise<void>;
}

interface UseAuthFormReturn<T> {
  values: T;
  errors: FieldErrors<T>;
  globalError: string | null;
  isPending: boolean;
  isSuccess: boolean;
  handleChange: (field: keyof T, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function useAuthForm<T extends Record<string, string>>({
  initialValues,
  validate,
  onSubmit,
}: UseAuthFormOptions<T>): UseAuthFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<T>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleChange = useCallback((field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setGlobalError(null);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      startTransition(async () => {
        try {
          await onSubmit(values);
          setIsSuccess(true);
        } catch (error) {
          if (error instanceof HttpError) {
            if (error.apiError.errors) {
              const fieldErrors: FieldErrors<T> = {};
              for (const [key, messages] of Object.entries(error.apiError.errors)) {
                (fieldErrors as Record<string, string>)[key] = messages[0];
              }
              setErrors(fieldErrors);
            } else {
              setGlobalError(error.apiError.message);
            }
          } else {
            setGlobalError("An unexpected error occurred. Try again.");
          }
        }
      });
    },
    [values, validate, onSubmit]
  );

  return { values, errors, globalError, isPending, isSuccess, handleChange, handleSubmit };
}