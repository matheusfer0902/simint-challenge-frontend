"use client";

import type { ReactNode } from "react";

export interface SectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export function Section({ icon, title, children }: SectionProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <div className="text-slate-400">{icon}</div>
        <h3 className="font-pixel text-[7px] uppercase tracking-widest text-slate-500">{title}</h3>
      </div>
      {children}
    </div>
  );
}
