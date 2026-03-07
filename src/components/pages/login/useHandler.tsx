"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import { useAuthForm } from "@/lib/hooks/use-auth-form";
import type { LoginDto } from "@/lib/api/auth.service";

export type LoginFields = Record<keyof LoginDto, string>;

function validate(values: LoginFields): Partial<LoginFields> {
  const errors: Partial<LoginFields> = {};
  if (!values.email) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Invalid email format.";
  if (!values.password) errors.password = "Password is required.";
  else if (values.password.length < 6)
    errors.password = "Minimum 6 characters.";
  return errors;
}

export function useLoginHandler() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = useCallback(
    async (values: LoginFields) => {
      await login({ email: values.email, password: values.password });
    },
    [login]
  );

  const { values, errors, globalError, isPending, handleChange, handleSubmit } =
    useAuthForm<LoginFields>({
      initialValues: { email: "", password: "" },
      validate,
      onSubmit,
    });

  return {
    values,
    errors,
    globalError,
    isPending,
    handleChange,
    handleSubmit,
    showPassword,
    setShowPassword,
  };
}
