"use client";

import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { useLoginHandler } from "./useHandler";

export function LoginPage() {
  const {
    values,
    errors,
    globalError,
    isPending,
    handleChange,
    handleSubmit,
    showPassword,
    setShowPassword,
  } = useLoginHandler();

  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Access the system and manage your Pokémon."
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
          label="Email"
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
          label="Password"
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
              aria-label={showPassword ? "Hide password" : "Show password"}
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
            Forgot password?
          </Link>
        </div>

        <AuthButton
          isPending={isPending}
          label="Sign In"
          icon={<ArrowRight className="h-4 w-4" />}
        />
      </form>

      <p className="mt-6 text-center text-sm text-poke-dark-gray/60">
        Don't have an account?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-poke-red transition-colors hover:text-poke-dark-red underline underline-offset-2"
        >
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}
