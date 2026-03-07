"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/auth.context";
import { useAuthForm } from "@/lib/hooks/use-auth-form";
import { Pokeball } from "@/components/landing/Pokeball";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import type { LoginDto } from "@/lib/api/auth.service";

type LoginFields = Record<keyof LoginDto, string>;

function validate(values: LoginFields): Partial<LoginFields> {
  const errors: Partial<LoginFields> = {};
  if (!values.email) errors.email = "E-mail é obrigatório.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Formato de e-mail inválido.";
  if (!values.password) errors.password = "Senha é obrigatória.";
  else if (values.password.length < 6)
    errors.password = "Mínimo de 6 caracteres.";
  return errors;
}

export default function LoginPage() {
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

  return (
    <AuthLayout
      title="Bem-vindo de volta!"
      subtitle="Acesse o sistema e gerencie seus Pokémons."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {globalError && (
          <div className="flex items-center gap-3 rounded-xl border-2 border-poke-red/30 bg-poke-red/10 px-4 py-3 animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0 text-poke-red" />
            <p className="text-sm text-poke-red">{globalError}</p>
          </div>
        )}

        <AuthInput
          id="email"
          type="email"
          label="E-mail"
          placeholder="ash@pokecenter.com"
          value={values.email}
          onChange={(v) => handleChange("email", v)}
          error={errors.email}
          icon={<Mail className="h-4 w-4" />}
          autoComplete="email"
          disabled={isPending}
        />

        <AuthInput
          id="password"
          type={showPassword ? "text" : "password"}
          label="Senha"
          placeholder="••••••••"
          value={values.password}
          onChange={(v) => handleChange("password", v)}
          error={errors.password}
          icon={<Lock className="h-4 w-4" />}
          autoComplete="current-password"
          disabled={isPending}
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-poke-dark-gray/40 transition-colors hover:text-poke-red focus:outline-none"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
        />

        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs text-poke-dark-gray/60 transition-colors hover:text-poke-red"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <AuthButton isPending={isPending} label="Entrar" icon={<ArrowRight className="h-4 w-4" />} />
      </form>

      <p className="mt-6 text-center text-sm text-poke-dark-gray/60">
        Não tem conta?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-poke-red transition-colors hover:text-poke-dark-red underline underline-offset-2"
        >
          Criar conta
        </Link>
      </p>
    </AuthLayout>
  );
}