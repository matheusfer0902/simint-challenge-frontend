"use client";

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Pencil, Sword, FlaskConical } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppInput } from "@/components/shared/AppInput";
import { AppButton } from "@/components/shared/AppButton";
import { useProfileHandler } from "./useProfileHandler";
import { useState } from "react";

function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

export function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    values,
    errors,
    globalError,
    isPending,
    success,
    canEditRole,
    handleChange,
    handleSubmit,
  } = useProfileHandler();

  return (
    <AppLayout>
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-poke-red transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao dashboard
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-poke-red/10">
              <Pencil className="h-6 w-6 text-poke-red" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Meus dados</h1>
              <p className="text-sm text-slate-500">Atualize seu perfil. Deixe a senha em branco para não alterar.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {globalError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {globalError}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Dados atualizados com sucesso.
              </div>
            )}

            {canEditRole ? (
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">
                  Tipo de conta
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
                        disabled={isPending}
                        className={`
                          flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium
                          transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-poke-red/50
                          ${
                            active
                              ? "border-poke-red bg-poke-red/10 text-poke-red"
                              : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300"
                          }
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        {label}
                      </button>
                    );
                  })}
                </div>
                {errors.role && <p className="mt-1.5 text-xs text-red-600">{errors.role}</p>}
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">
                  Tipo de conta
                </label>
                <p className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700">
                  {formatRole(values.role)}
                </p>
              </div>
            )}

            <AppInput
              id="username"
              label="Username"
              placeholder="seu_usuario"
              value={values.username}
              onChange={(v) => handleChange("username", v)}
              error={errors.username}
              variant="form"
              disabled={isPending}
              autoComplete="username"
            />

            <AppInput
              id="email"
              type="email"
              label="Email"
              placeholder="email@exemplo.com"
              value={values.email}
              onChange={(v) => handleChange("email", v)}
              error={errors.email}
              variant="form"
              disabled={isPending}
              autoComplete="email"
            />

            <div className="space-y-1">
              <p className="text-xs text-slate-500">Deixe em branco para não alterar a senha.</p>
              <AppInput
                id="password"
                type={showPassword ? "text" : "password"}
                label="Nova senha"
                placeholder="••••••••"
                value={values.password}
                onChange={(v) => handleChange("password", v)}
                error={errors.password}
                variant="form"
                disabled={isPending}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <AppInput
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                label="Confirmar nova senha"
                placeholder="••••••••"
                value={values.confirmPassword}
                onChange={(v) => handleChange("confirmPassword", v)}
                error={errors.confirmPassword}
                variant="form"
                disabled={isPending}
              />
            </div>

            <AppButton
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Salvando…" : "Salvar alterações"}
            </AppButton>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
