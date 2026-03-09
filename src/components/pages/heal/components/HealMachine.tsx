"use client";

import { Heart, Zap } from "lucide-react";
import type { HealPokemon, HealState } from "../types";
import { MachineSlot } from "./MachineSlot";

export interface HealMachineProps {
  state: HealState;
  tray: HealPokemon[];
}

export function HealMachine({ state, tray }: HealMachineProps) {
  const running = state.phase === "loading" || state.phase === "sequencing";
  const done = state.phase === "done";
  const isIdleOrDone = state.phase === "idle" || state.phase === "done";
  const loadedSlots = isIdleOrDone
    ? Array.from({ length: 6 }, (_, i) => i < tray.length)
    : state.loadedSlots;
  const slotCount = isIdleOrDone ? tray.length : state.litSlots.filter(Boolean).length;

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-slate-700 bg-gradient-to-b from-slate-700 to-slate-900 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-2">
          {[running, running, done || state.litSlots.every(Boolean)].map((on, i) => (
            <div
              key={i}
              className={`h-3.5 w-3.5 rounded-full transition-colors ${
                on
                  ? i === 2
                    ? "bg-emerald-400 shadow shadow-emerald-400/60"
                    : "animate-pulse bg-yellow-400 shadow shadow-yellow-400/60"
                  : "bg-slate-600"
              }`}
            />
          ))}
        </div>
        <div className="rounded-xl bg-slate-900/60 px-4 py-1.5">
          <span className="font-pixel text-[8px] uppercase tracking-widest text-slate-400">
            {state.phase === "idle"
              ? "WAITING"
              : state.phase === "loading"
                ? "LOADING"
                : state.phase === "sequencing"
                  ? "HEALING..."
                  : state.phase === "filling"
                    ? "RESTORING"
                    : "DONE ✓"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap
            className={`h-4 w-4 ${running ? "animate-pulse text-yellow-400" : done ? "text-emerald-400" : "text-slate-600"}`}
          />
          <span className="font-pixel text-[8px] text-slate-500">{slotCount}/6</span>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="mb-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-2 shadow-lg shadow-red-500/25">
            <Heart className="h-4 w-4 text-white" />
            <span className="font-pixel text-[10px] tracking-widest text-white">
              POKÉMON HEALING SYSTEM
            </span>
            <Heart className="h-4 w-4 text-white" />
          </div>
          <p className="mt-1.5 text-[9px] text-slate-500">Modelo RX-9 · Joy Edition · Kanto</p>
        </div>

        <div className="rounded-2xl bg-slate-950/50 p-5">
          <p className="mb-4 text-center font-pixel text-[8px] uppercase tracking-widest text-slate-500">
            Healing Tray
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <MachineSlot
                key={i}
                index={i}
                isLoaded={loadedSlots[i]}
                isActive={state.activeSlot === i}
                isLit={state.litSlots[i]}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-700"
            style={{ width: `${(slotCount / 6) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-3">
        <div className="flex gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all ${
                state.litSlots[i]
                  ? "bg-emerald-400 shadow shadow-emerald-400/60"
                  : state.activeSlot === i
                    ? "animate-pulse bg-yellow-400"
                    : loadedSlots[i]
                      ? "bg-red-500"
                      : "bg-slate-700"
              }`}
            />
          ))}
        </div>
        <p className="font-pixel text-[8px] text-slate-600">NURSE JOY TECH™</p>
      </div>
    </div>
  );
}
