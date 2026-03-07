"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import { useAuthForm } from "@/lib/hooks/use-auth-form";
import type { RegisterDto } from "@/lib/api/auth.service";

export type RegisterFields = Record<keyof RegisterDto | "confirmPassword", string>;

export const strengthColors: Record<number, string> = {
  0: "bg-poke-gray",
  1: "bg-poke-red",
  2: "bg-poke-yellow",
  3: "bg-green-500",
};

export function passwordStrength(password: string): {
  level: 0 | 1 | 2 | 3;
  label: string;
} {
  if (password.length === 0) return { level: 0, label: "" };
  if (password.length < 6) return { level: 1, label: "Weak" };
  if (password.length < 10 || !/[A-Z]/.test(password) || !/\d/.test(password))
    return { level: 2, label: "Medium" };
  return { level: 3, label: "Strong" };
}

function validate(values: RegisterFields): Partial<RegisterFields> {
  const errors: Partial<RegisterFields> = {};
  if (!values.name || values.name.trim().length < 2)
    errors.name = "Name must have at least 2 characters.";
  if (!values.email) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Invalid email format.";
  if (!values.password) errors.password = "Password is required.";
  else if (values.password.length < 6)
    errors.password = "Minimum 6 characters.";
  if (values.confirmPassword !== values.password)
    errors.confirmPassword = "Passwords do not match.";
  if (!values.role) errors.role = "Select an account type.";
  return errors;
}

export function useRegisterHandler() {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = useCallback(
    async (values: RegisterFields) => {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role as "trainer" | "researcher",
      });
    },
    [register]
  );

  const { values, errors, globalError, isPending, handleChange, handleSubmit } =
    useAuthForm<RegisterFields>({
      initialValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      },
      validate,
      onSubmit,
    });

  const strength = passwordStrength(values.password);

  return {
    values,
    errors,
    globalError,
    isPending,
    handleChange,
    handleSubmit,
    showPassword,
    setShowPassword,
    strength,
  };
}
