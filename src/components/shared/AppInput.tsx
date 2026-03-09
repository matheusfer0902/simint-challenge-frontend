"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AppInputVariant = "form" | "search";

export interface AppInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  id?: string;
  label?: string;
  error?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
  onChange?: (value: string) => void;
  /**
   * "form"   → auth-style: labeled, poke-red focus, border-2, error state, shake animation.
   * "search" → slim search bar: no label/error, slate border, lighter focus ring.
   * @default "form"
   */
  variant?: AppInputVariant;
}

export function AppInput({
  id,
  label,
  error,
  icon,
  suffix,
  onChange,
  variant = "form",
  className,
  value,
  ...rest
}: AppInputProps) {
  const errorId = id ? `${id}-error` : undefined;
  const hasError = Boolean(error);

  const inputCls =
    variant === "form"
      ? cn(
          "w-full rounded-xl border-2 bg-poke-gray/30 py-3 text-sm text-poke-dark-gray",
          "placeholder:text-poke-dark-gray/30 outline-none transition-all duration-200",
          "disabled:cursor-not-allowed disabled:opacity-50",
          icon ? "pl-10" : "pl-4",
          suffix ? "pr-10" : "pr-4",
          hasError
            ? "border-poke-red/60 bg-poke-red/5 focus:border-poke-red focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)] animate-shake"
            : "border-poke-gray/60 focus:border-poke-red focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)] focus:bg-white",
          className
        )
      : cn(
          "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm text-slate-700",
          "placeholder:text-slate-400 outline-none transition-all duration-200",
          "focus:border-poke-red/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          icon ? "pl-10" : "pl-4",
          suffix ? "pr-10" : "pr-4",
          className
        );

  const iconCls =
    variant === "form"
      ? "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-poke-dark-gray/40 transition-colors group-focus-within:text-poke-red"
      : "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400";

  return (
    <div className={variant === "form" ? "space-y-1.5" : ""}>
      {label && variant === "form" && (
        <label
          htmlFor={id}
          className="block font-pixel text-[10px] uppercase tracking-wider text-poke-dark-gray/70"
        >
          {label}
        </label>
      )}

      <div className="group relative">
        {icon && <span className={iconCls}>{icon}</span>}

        <input
          id={id}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError && errorId ? errorId : undefined}
          value={onChange !== undefined ? (value ?? "") : value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          readOnly={value !== undefined && onChange === undefined}
          className={inputCls}
          {...rest}
        />

        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{suffix}</span>
        )}
      </div>

      {hasError && errorId && (
        <p id={errorId} role="alert" className="text-xs text-poke-red">
          {error}
        </p>
      )}
    </div>
  );
}
