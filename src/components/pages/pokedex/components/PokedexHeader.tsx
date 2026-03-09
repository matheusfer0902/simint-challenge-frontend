"use client";

import { PokeballSVG } from "./PokeballSVG";

export function PokedexHeader() {
  return (
    <header className="relative overflow-hidden border-b border-slate-200/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 60%,rgba(239,68,68,0.18) 0%,transparent 50%), radial-gradient(circle at 82% 40%,rgba(59,130,246,0.12) 0%,transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(60deg,transparent,transparent 28px,rgba(255,255,255,1) 28px,rgba(255,255,255,1) 29px)",
        }}
      />
      <PokeballSVG className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 opacity-[0.05]" />

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-0.5 font-pixel text-[7px] uppercase tracking-widest text-red-400">
                Researcher Lab
              </span>
            </div>
            <h1 className="font-pixel text-3xl leading-tight text-white sm:text-4xl">
              GLOBAL POKÉDEX
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Research Archive — National Database
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
