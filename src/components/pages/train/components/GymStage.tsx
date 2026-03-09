"use client";

import { useState } from "react";
import { Zap, Heart, Shield, Swords, Candy, TrendingUp } from "lucide-react";
import type { TrainPokemon, TrainState } from "../types";
import { getTypeColors } from "../data";
import { ParticleCanvas } from "./ParticleCanvas";
import { LevelUpOverlay } from "./LevelUpOverlay";
import { Shimmer } from "./Shimmer";
import { Spinner } from "./Spinner";

export interface GymStageProps {
  pokemon: TrainPokemon;
  state: TrainState;
  onTrain: () => void;
}

export function GymStage({ pokemon, state, onTrain }: GymStageProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const tc = getTypeColors(pokemon.type);
  const isBusy = state.phase !== "idle";

  const spriteClass =
    state.phase === "bouncing"
      ? "animate-pokeBounce"
      : state.phase === "level-up"
        ? "animate-levelPop"
        : state.phase === "celebrating"
          ? "animate-levelPop"
          : "animate-pokeBreath";

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-500"
            style={{
              background: tc.glow,
              opacity: state.phase === "bouncing" ? 0.7 : 0.25,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 1px,transparent 4px)",
            }}
          />
          <div className="absolute bottom-3 left-5 select-none text-5xl opacity-[0.06]">🏋️</div>
          <div className="absolute bottom-3 right-5 select-none text-5xl opacity-[0.06]">⚡</div>
        </div>

        <div className="absolute inset-0">
          <ParticleCanvas trigger={state.particles} accent={tc.accent} />
        </div>

        <div className="relative flex items-center justify-center py-14 sm:py-16">
          {!imgLoaded && (
            <div className="h-48 w-48 animate-pulse rounded-full bg-white/5" />
          )}
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            key={pokemon.id}
            onLoad={() => setImgLoaded(true)}
            className={`relative z-10 select-none object-contain drop-shadow-2xl transition-[opacity] duration-500
              ${imgLoaded ? "opacity-100" : "absolute opacity-0"}
              ${spriteClass}
            `}
            style={{ width: 200, height: 200 }}
          />
          {state.xpGained > 0 && state.phase === "idle" && (
            <div className="pointer-events-none absolute right-8 top-8 animate-floatAway">
              <span
                className="rounded-xl px-3 py-1.5 font-pixel text-[10px] text-slate-900 shadow-lg"
                style={{ background: tc.accent }}
              >
                +{state.xpGained} EXP ✦
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3">
          <div className="flex items-center gap-2">
            {[pokemon.type, pokemon.secondType].filter(Boolean).map((t) => (
              <span
                key={t}
                className={`rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${getTypeColors(t!).badge}`}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
            <Zap className="h-3 w-3 text-yellow-400" />
            <span className="font-pixel text-[9px] text-white/80">LVL {state.level}</span>
          </div>
        </div>

        <LevelUpOverlay level={state.level} isActive={state.phase === "level-up"} />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-pixel text-xl text-slate-800">{pokemon.name.toUpperCase()}</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              #{String(pokemon.id).padStart(3, "0")} · {pokemon.type}
            </p>
          </div>
          <div
            className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${tc.accent}dd, ${tc.accent})` }}
          >
            <span className="font-pixel text-xl leading-none">{state.level}</span>
            <span className="mt-0.5 font-pixel text-[7px] leading-none text-white/70">LVL</span>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-around rounded-xl bg-slate-50 py-3">
          {[
            {
              icon: <Heart className="h-3.5 w-3.5" />,
              label: "HP",
              value: pokemon.hp,
              color: "bg-emerald-100 text-emerald-600",
            },
            {
              icon: <Swords className="h-3.5 w-3.5" />,
              label: "ATK",
              value: pokemon.attack,
              color: "bg-red-100 text-red-600",
            },
            {
              icon: <Shield className="h-3.5 w-3.5" />,
              label: "DEF",
              value: pokemon.defense,
              color: "bg-blue-100 text-blue-600",
            },
            {
              icon: <Zap className="h-3.5 w-3.5" />,
              label: "SPD",
              value: pokemon.speed,
              color: "bg-yellow-100 text-yellow-600",
            },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${color}`}>
                {icon}
              </div>
              <span className="font-pixel text-[7px] uppercase text-slate-400">{label}</span>
              <span className="font-pixel text-[11px] text-slate-700">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            onClick={onTrain}
            disabled={isBusy}
            className={`group relative w-full overflow-hidden rounded-2xl py-4 font-pixel text-[11px] tracking-widest text-white shadow-xl transition-all duration-200 focus:outline-none
              active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60
              ${isBusy ? "bg-slate-600" : `bg-gradient-to-r ${tc.gradient} hover:scale-[1.01] hover:shadow-2xl`}`}
            style={{ boxShadow: isBusy ? undefined : `0 8px 32px ${tc.glow}` }}
          >
            <Shimmer />
            <span className="relative flex items-center justify-center gap-2.5">
              {state.phase === "bouncing" || state.phase === "xp-fill" ? (
                <>
                  <Spinner /> TRAINING...
                </>
              ) : (
                <>
                  <Candy className="h-4 w-4" /> GIVE RARE CANDY{" "}
                  <TrendingUp className="h-4 w-4" />
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
