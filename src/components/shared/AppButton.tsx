"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AppButtonVariant = "primary" | "secondary" | "ghost" | "icon";
export type AppButtonSize = "sm" | "md" | "lg";

export interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * @default "primary"
   */
  variant?: AppButtonVariant;
  /**
   * @default "md"
   */
  size?: AppButtonSize;
  loading?: boolean;
  loadingIndicator?: ReactNode;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

const variantCls: Record<AppButtonVariant, string> = {
  primary: cn(
    "bg-gradient-to-r from-poke-red to-rose-600 text-white",
    "shadow-lg shadow-poke-red/30 hover:shadow-xl hover:shadow-poke-red/40 hover:scale-[1.01]"
  ),
  secondary: cn(
    "border-2 border-slate-200 bg-white text-slate-700",
    "hover:border-poke-red/30 hover:text-poke-red"
  ),
  ghost: "text-poke-dark-gray hover:text-poke-red hover:bg-poke-red/10",
  icon: "rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700",
};

const sizeCls: Record<AppButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-sm",
};

export function AppButton({
  variant = "primary",
  size = "md",
  loading = false,
  loadingIndicator,
  icon,
  trailingIcon,
  fullWidth = false,
  className,
  children,
  disabled,
  ...rest
}: AppButtonProps) {
  const hasShimmer = variant === "primary";

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "group relative overflow-hidden rounded-xl font-medium",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-poke-red focus-visible:ring-offset-2",
        "active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none",
        variantCls[variant],
        variant !== "icon" && sizeCls[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {hasShimmer && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full"
        />
      )}

      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          loadingIndicator ?? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
          )
        ) : (
          <>
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
            {trailingIcon && (
              <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-1">
                {trailingIcon}
              </span>
            )}
          </>
        )}
      </span>
    </button>
  );
}
