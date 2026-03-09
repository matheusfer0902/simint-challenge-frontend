"use client";

import type { ReactNode } from "react";

export interface FieldProps {
  label: string;
  children: ReactNode;
}

export function Field({ label, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block font-pixel text-[8px] uppercase tracking-widest text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}
