"use client";

import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, children, className = "" }: SectionProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="h-3 w-1 rounded-full bg-poke-red" />
        <h3 className="font-pixel text-[10px] uppercase tracking-widest text-slate-600">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}
