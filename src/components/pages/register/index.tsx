"use client";

import Link from "next/link";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  AlertCircle,
  ArrowRight,
  Sword,
  FlaskConical,
} from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { useRegisterHandler, strengthColors } from "./useHandler";

export function RegisterPage() {
  const {
    values,
    errors,
    globalError,
    isPending,
    handleChange,
    handleSubmit,
    showPassword,
    setShowPassword,
    strength,
  } = useRegisterHandler();

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join thousands of trainers and researchers."
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
            Account type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { value: "trainer", label: "Trainer", Icon: Sword },
                { value: "researcher", label: "Researcher", Icon: FlaskConical },
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
          id="username"
          type="text"
          label="Username"
          placeholder="Ash Ketchum"
          value={values.username}
          onChange={(v) => handleChange("username", v)}
          error={errors.username}
          icon={<User className="h-4 w-4" />}
          autoComplete="username"
          disabled={isPending}
        />

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

        <div className="space-y-1.5">
          <AuthInput
            id="password"
            type={showPassword ? "text" : "password"}
            label="Password"
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
          {values.password.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength.level
                        ? strengthColors[strength.level]
                        : "bg-poke-gray"
                    }`}
                  />
                ))}
              </div>
              {strength.label && (
                <p
                  className={`text-xs ${strengthColors[strength.level].replace("bg-", "text-")}`}
                >
                  Strength: {strength.label}
                </p>
              )}
            </div>
          )}
        </div>

        <AuthInput
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          label="Confirm password"
          placeholder="••••••••"
          value={values.confirmPassword}
          onChange={(v) => handleChange("confirmPassword", v)}
          error={errors.confirmPassword}
          icon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
          disabled={isPending}
        />

        <AuthButton
          isPending={isPending}
          label="Create account"
          icon={<ArrowRight className="h-4 w-4" />}
        />
      </form>

      <p className="mt-6 text-center text-sm text-poke-dark-gray/60">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-poke-red transition-colors hover:text-poke-dark-red underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
