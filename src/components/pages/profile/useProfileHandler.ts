"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import { userService, type UpdateMeDto } from "@/lib/api/user.service";
import { HttpError } from "@/lib/api/http-client";

export type ProfileFormValues = {
  username: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
};

const initialValues: ProfileFormValues = {
  username: "",
  email: "",
  role: "",
  password: "",
  confirmPassword: "",
};

function validate(values: ProfileFormValues, canEditRole: boolean): Partial<Record<keyof ProfileFormValues, string>> {
  const errors: Partial<Record<keyof ProfileFormValues, string>> = {};
  if (!values.username || values.username.trim().length < 3)
    errors.username = "Username deve ter pelo menos 3 caracteres.";
  if (values.username.length > 100) errors.username = "Username deve ter no máximo 100 caracteres.";

  if (!values.email) errors.email = "Email é obrigatório.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Email inválido.";

  if (canEditRole && !values.role) errors.role = "Selecione um tipo de conta.";
  if (canEditRole && values.role && !["trainer", "researcher"].includes(values.role))
    errors.role = "Role deve ser trainer ou researcher.";

  if (values.password) {
    if (values.password.length < 8)
      errors.password = "Senha deve ter no mínimo 8 caracteres.";
    else if (!/[A-Z]/.test(values.password) || !/[a-z]/.test(values.password))
      errors.password = "Senha deve ter pelo menos uma maiúscula e uma minúscula.";
    else if (!/[.,@\-_]/.test(values.password))
      errors.password = "Senha deve ter pelo menos um caractere especial (. , @ - _).";
    if (values.password !== values.confirmPassword)
      errors.confirmPassword = "As senhas não coincidem.";
  } else if (values.confirmPassword) {
    errors.confirmPassword = "Confirme a senha.";
  }

  return errors;
}

export function useProfileHandler() {
  const { user, refreshUser } = useAuth();
  const [values, setValues] = useState<ProfileFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormValues, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const canEditRole = user?.role === "trainer" || user?.role === "researcher";

  useEffect(() => {
    if (user) {
      setValues({
        username: user.username,
        email: user.email,
        role: user.role,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = useCallback((field: keyof ProfileFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setGlobalError(null);
    setSuccess(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const validationErrors = validate(values, canEditRole);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsPending(true);
      setGlobalError(null);
      try {
        const payload: UpdateMeDto = {
          username: values.username.trim(),
          email: values.email.trim(),
        };
        if (canEditRole && values.role) payload.role = values.role as "trainer" | "researcher";
        if (values.password) payload.password = values.password;

        await userService.updateMe(payload);
        await refreshUser();
        setSuccess(true);
        setValues((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } catch (error) {
        if (error instanceof HttpError) {
          if (error.apiError.errors) {
            const fieldErrors: Partial<Record<keyof ProfileFormValues, string>> = {};
            for (const [key, messages] of Object.entries(error.apiError.errors)) {
              if (key in initialValues) (fieldErrors as Record<string, string>)[key] = messages[0];
            }
            setErrors(fieldErrors);
          } else {
            setGlobalError(error.apiError.message);
          }
        } else {
          setGlobalError("Ocorreu um erro. Tente novamente.");
        }
      } finally {
        setIsPending(false);
      }
    },
    [values, canEditRole, refreshUser]
  );

  return {
    values,
    errors,
    globalError,
    isPending,
    success,
    canEditRole,
    handleChange,
    handleSubmit,
  };
}
