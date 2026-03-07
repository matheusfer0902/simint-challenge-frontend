"use client";

import type { ReactNode } from "react";
import { Pokeball } from "@/components/landing/Pokeball";

interface AuthButtonProps {
  isPending: boolean;
  label: string;
  icon?: ReactNode;
}

export function AuthButton({ isPending, label, icon }: AuthButtonProps) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={`
        group relative w-full overflow-hidden rounded-xl
        bg-gradient-to-r from-poke-red to-poke-dark-red
        px-6 py-3.5 text-sm font-medium text-white
        shadow-lg shadow-poke-red/30
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-poke-red focus-visible:ring-offset-2
        active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none
        hover:shadow-xl hover:shadow-poke-red/40 hover:scale-[1.01]
      `}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full"
      />

      <span className="relative flex items-center justify-center gap-2">
        {isPending ? (
          <>
            <span className="h-4 w-4 animate-spin">
              <Pokeball size={16} animate={false} />
            </span>
            <span>Aguarde...</span>
          </>
        ) : (
          <>
            <span>{label}</span>
            {icon && (
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                {icon}
              </span>
            )}
          </>
        )}
      </span>
    </button>
  );
}