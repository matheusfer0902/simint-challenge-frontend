"use client";

import { HealPokeballSVG } from "./HealPokeballSVG";

export interface MachineSlotProps {
  index: number;
  isLoaded: boolean;
  isActive: boolean;
  isLit: boolean;
}

export function MachineSlot({ index, isLoaded, isActive, isLit }: MachineSlotProps) {
  const baseRing = isActive
    ? "animate-slotGlow border-yellow-400 shadow-xl"
    : isLit
      ? "border-emerald-400 shadow-lg shadow-emerald-400/40"
      : "border-slate-600";

  const innerBg = isActive
    ? "bg-yellow-400/25"
    : isLit
      ? "bg-emerald-400/20"
      : isLoaded
        ? "bg-slate-700"
        : "bg-slate-900";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border-4 transition-all duration-300 ${baseRing} ${innerBg}`}
      >
        {isLoaded && (
          <div
            className={`h-9 w-9 transition-all duration-200 ${isActive ? "scale-110 drop-shadow-lg" : "scale-100"}`}
          >
            <HealPokeballSVG state={isLit ? "green" : isActive ? "yellow" : "red"} />
          </div>
        )}
        {!isLoaded && (
          <div className="h-7 w-7 rounded-full border-2 border-slate-600 opacity-30" />
        )}
        {isActive && (
          <div className="pointer-events-none absolute inset-0 animate-ping rounded-full border-4 border-yellow-400/40" />
        )}
      </div>
      <div className="flex h-4 w-4 items-center justify-center rounded-full text-[7px]">
        {isLit ? (
          <span className="font-pixel text-emerald-400">✓</span>
        ) : (
          <span className="font-pixel text-slate-600">{String(index + 1).padStart(2, "0")}</span>
        )}
      </div>
    </div>
  );
}
