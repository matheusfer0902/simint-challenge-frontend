"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import type { HealPokemon } from "../types";
import { getTypeColors, STATUS_CFG, hpBarColor } from "../data";

export interface PatientCardProps {
  pokemon: HealPokemon;
  currentHp: number;
  slotIndex: number;
  activeSlot: number;
  isLit: boolean;
  isHealing: boolean;
  isInTray: boolean;
  onClick: () => void;
}

export function PatientCard({
  pokemon,
  currentHp,
  slotIndex,
  activeSlot,
  isLit,
  isHealing,
  isInTray,
  onClick,
}: PatientCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const tc = getTypeColors(pokemon.type);
  const sc = STATUS_CFG[pokemon.status];
  const pct = currentHp / pokemon.maxHp;
  const barColor = isLit ? "#22c55e" : hpBarColor(pct);
  const isActive = activeSlot === slotIndex;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all duration-400
      ${isActive ? "scale-[1.04] border-yellow-400 shadow-yellow-400/30" : isLit ? "border-emerald-300 shadow-emerald-200/40" : isInTray ? "border-red-400 ring-2 ring-red-400/40 shadow-red-200/30" : "border-slate-200/80"}
      hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-400/50`}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${tc.gradient}`} />

      <div className="absolute right-1.5 top-2.5">
        {isLit ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <span className={`rounded-full px-1.5 py-0.5 text-[7px] font-bold uppercase ${sc.bg} ${sc.color}`}>
            {sc.label}
          </span>
        )}
      </div>

      <div className="p-3">
        <div
          className="relative mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${tc.glow.replace("0.5", "0.12")}, transparent)`,
          }}
        >
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse rounded-xl bg-slate-100" />
          )}
          {isActive && (
            <div
              className="absolute inset-0 animate-pulse rounded-xl"
              style={{ boxShadow: `inset 0 0 14px ${tc.glow}` }}
            />
          )}
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            onLoad={() => setImgLoaded(true)}
            className={`relative z-10 h-12 w-12 object-contain drop-shadow transition-all duration-500
              ${imgLoaded ? "opacity-100" : "opacity-0"}
              ${isActive ? "animate-healFloat" : ""}
              ${pokemon.status === "fainted" && !isLit ? "grayscale opacity-50" : ""}
            `}
          />
          {isActive && (
            <Sparkles className="absolute right-0.5 top-0.5 h-4 w-4 animate-spin text-yellow-400 opacity-80" />
          )}
        </div>

        <p className="truncate text-center font-pixel text-[8px] text-slate-700">{pokemon.name}</p>
        <p className="text-center text-[9px] text-slate-400">Lv.{pokemon.level}</p>

        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-[7px] uppercase tracking-wider text-slate-400">HP</span>
            <span className="font-pixel text-[8px] text-slate-600">
              {currentHp}/{pokemon.maxHp}
            </span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-slate-100 shadow-inner">
            <div
              className="relative h-full min-w-0 rounded-full transition-all"
              style={{
                width:
                  pokemon.maxHp > 0
                    ? `${Math.max((currentHp / pokemon.maxHp) * 100, currentHp === 0 ? 4 : 0)}%`
                    : "0%",
                background: barColor,
                transitionDuration: isHealing ? "0.5s" : "0.2s",
                boxShadow: isLit ? "0 0 8px #22c55e88" : undefined,
              }}
            >
              {isLit && (
                <div
                  className="absolute inset-0 animate-shimmerHp rounded-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
