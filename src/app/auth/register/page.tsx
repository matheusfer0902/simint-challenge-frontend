"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, User, AlertCircle, ArrowRight, Sword, FlaskConical } from "lucide-react";
import { useAuth } from "@/contexts/auth.context";
import { useAuthForm } from "@/lib/hooks/use-auth-form";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import type { RegisterDto } from "@/lib/api/auth.service";

type RegisterFields = Record<keyof RegisterDto | "confirmPassword", string>;

function passwordStrength(password: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (password.length === 0) return { level: 0, label: "" };
  if (password.length < 6) return { level: 1, label: "Fraca" };
  if (password.length < 10 || !/[A-Z]/.test(password) || !/\d/.test(password))
    return { level: 2, label: "Média" };
  return { level: 3, label: "Forte" };
}

const strengthColors: Record<number, string> = {
  0: "bg-poke-gray",
  1: "bg-poke-red",
  2: "bg-poke-yellow",
  3: "bg-green-500",
};

function validate(values: RegisterFields): Partial<RegisterFields> {
  const errors: Partial<RegisterFields> = {};
  if (!values.name || values.name.trim().length < 2)
    errors.name = "Nome deve ter pelo menos 2 caracteres.";
  if (!values.email) errors.email = "E-mail é obrigatório.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Formato de e-mail inválido.";
  if (!values.password) errors.password = "Senha é obrigatória.";
  else if (values.password.length < 6)
    errors.password = "Mínimo de 6 caracteres.";
  if (values.confirmPassword !== values.password)
    errors.confirmPassword = "As senhas não coincidem.";
  if (!values.role) errors.role = "Selecione um tipo de conta.";
  return errors;
}

export default function RegisterPage() {
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
      initialValues: { name: "", email: "", password: "", confirmPassword: "", role: "" },
      validate,
      onSubmit,
    });

  const strength = passwordStrength(values.password);

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Junte-se a milhares de treinadores e pesquisadores."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {globalError && (
          <div className="flex items-center gap-3 rounded-xl border-2 border-poke-red/30 bg-poke-red/10 px-4 py-3 animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0 text-poke-red" />
            <p className="text-sm text-poke-red">{globalError}</p>
          </div>
        )}

        <div>
          <label className="mb-2 block font-pixel text-[10px] text-poke-dark-gray/70 uppercase tracking-wider">
            Tipo de conta
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { value: "trainer", label: "Treinador", Icon: Sword },
                { value: "researcher", label: "Pesquisador", Icon: FlaskConical },
              ] as const
            ).map(({ value, label, Icon }) => {
              const active = values.role === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChange("role", value)}
                  className={`
                    relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-xs font-medium
                    transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-poke-red/50
                    ${
                      active
                        ? "border-poke-red bg-poke-red/10 text-poke-red shadow-md shadow-poke-red/20 scale-[1.02]"
                        : "border-poke-gray/60 bg-white text-poke-dark-gray/70 hover:border-poke-red/40 hover:bg-poke-red/5"
                    }
                  `}
                >
                  <Icon className={`h-6 w-6 transition-transform ${active ? "scale-110" : ""}`} />
                  {label}
                  {active && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-poke-red animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
          {errors.role && (
            <p className="mt-1.5 text-xs text-poke-red">{errors.role}</p>
          )}
        </div>

        <AuthInput
          id="name"
          type="text"
          label="Nome completo"
          placeholder="Ash Ketchum"
          value={values.name}
          onChange={(v) => handleChange("name", v)}
          error={errors.name}
          icon={<User className="h-4 w-4" />}
          autoComplete="name"
          disabled={isPending}
        />

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

        <div className="space-y-1.5">
          <AuthInput
            id="password"
            type={showPassword ? "text" : "password"}
            label="Senha"
            placeholder="••••••••"
            value={values.password}
            onChange={(v) => handleChange("password", v)}
            error={errors.password}
            icon={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            disabled={isPending}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-poke-dark-gray/40 transition-colors hover:text-poke-red focus:outline-none"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {values.password.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength.level ? strengthColors[strength.level] : "bg-poke-gray"
                    }`}
                  />
                ))}
              </div>
              {strength.label && (
                <p className={`text-xs ${strengthColors[strength.level].replace("bg-", "text-")}`}>
                  Força: {strength.label}
                </p>
              )}
            </div>
          )}
        </div>

        <AuthInput
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          label="Confirmar senha"
          placeholder="••••••••"
          value={values.confirmPassword}
          onChange={(v) => handleChange("confirmPassword", v)}
          error={errors.confirmPassword}
          icon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
          disabled={isPending}
        />

        <AuthButton isPending={isPending} label="Criar conta" icon={<ArrowRight className="h-4 w-4" />} />
      </form>

      <p className="mt-6 text-center text-sm text-poke-dark-gray/60">
        Já tem conta?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-poke-red transition-colors hover:text-poke-dark-red underline underline-offset-2"
        >
          Fazer login
        </Link>
      </p>
    </AuthLayout>
  );
}