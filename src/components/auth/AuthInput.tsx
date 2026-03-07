"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

interface AuthInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  id: string;
  label: string;
  error?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
  onChange: (value: string) => void;
}

export function AuthInput({
  id,
  label,
  error,
  icon,
  suffix,
  onChange,
  className = "",
  ...rest
}: AuthInputProps) {
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block font-pixel text-[10px] uppercase tracking-wider text-poke-dark-gray/70"
      >
        {label}
      </label>

      <div className="group relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-poke-dark-gray/40 transition-colors group-focus-within:text-poke-red">
            {icon}
          </span>
        )}

        <input
          id={id}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full rounded-xl border-2 bg-poke-gray/30 py-3 text-sm text-poke-dark-gray
            placeholder:text-poke-dark-gray/30
            outline-none
            transition-all duration-200
            ${icon ? "pl-10" : "pl-4"}
            ${suffix ? "pr-10" : "pr-4"}
            ${
              hasError
                ? "border-poke-red/60 bg-poke-red/5 focus:border-poke-red focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)] animate-shake"
                : "border-poke-gray/60 focus:border-poke-red focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)] focus:bg-white"
            }
            disabled:cursor-not-allowed disabled:opacity-50
            ${className}
          `}
          {...rest}
        />

        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {suffix}
          </span>
        )}
      </div>

      {hasError && (
        <p id={errorId} role="alert" className="text-xs text-poke-red">
          {error}
        </p>
      )}
    </div>
  );
}