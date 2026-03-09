"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, CheckCircle2, Sparkles, Zap } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useHealHandler, type HealPokemon, type HealState, type PokeStatus } from "./useHandler";

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, { gradient: string; badge: string; glow: string }> = {
  electric: { gradient: "from-yellow-400 to-amber-500", badge: "bg-yellow-100 text-yellow-800", glow: "rgba(245,158,11,0.5)" },
  fire: { gradient: "from-orange-500 to-red-500", badge: "bg-orange-100 text-orange-800", glow: "rgba(249,115,22,0.5)" },
  grass: { gradient: "from-emerald-500 to-green-600", badge: "bg-emerald-100 text-emerald-800", glow: "rgba(16,185,129,0.5)" },
  water: { gradient: "from-blue-500 to-cyan-500", badge: "bg-blue-100 text-blue-800", glow: "rgba(59,130,246,0.5)" },
  ghost: { gradient: "from-violet-600 to-indigo-700", badge: "bg-violet-100 text-violet-800", glow: "rgba(124,58,237,0.5)" },
  dragon: { gradient: "from-violet-500 to-purple-700", badge: "bg-purple-100 text-purple-800", glow: "rgba(109,40,217,0.5)" },
  normal: { gradient: "from-slate-400 to-zinc-600", badge: "bg-slate-100 text-slate-700", glow: "rgba(100,116,139,0.3)" },
  poison: { gradient: "from-fuchsia-500 to-purple-600", badge: "bg-fuchsia-100 text-fuchsia-800", glow: "rgba(192,38,211,0.45)" },
};
const getTC = (t: string) => TYPE_COLORS[t.toLowerCase()] ?? TYPE_COLORS.normal;

const STATUS_CFG: Record<PokeStatus, { label: string; color: string; bg: string }> = {
  healthy: { label: "Saudável", color: "text-emerald-700", bg: "bg-emerald-100" },
  fainted: { label: "Desmaiado", color: "text-slate-500", bg: "bg-slate-100" },
  poisoned: { label: "Envenenado", color: "text-fuchsia-700", bg: "bg-fuchsia-100" },
  burned: { label: "Queimado", color: "text-orange-700", bg: "bg-orange-100" },
  frozen: { label: "Congelado", color: "text-cyan-700", bg: "bg-cyan-100" },
  paralyzed: { label: "Paralisado", color: "text-yellow-700", bg: "bg-yellow-100" },
};

function hpBarColor(pct: number) {
  if (pct <= 0) return "#94a3b8";
  if (pct < 0.25) return "#ef4444";
  if (pct < 0.5) return "#f59e0b";
  return "#22c55e";
}

// ─────────────────────────────────────────────────────────────────────────────
// HEALING MACHINE
// ─────────────────────────────────────────────────────────────────────────────

function PokeballSVG({ state: s = "red" }: { state?: "red" | "yellow" | "green" }) {
  const topColor = s === "green" ? "#22c55e" : s === "yellow" ? "#fbbf24" : "#ef4444";
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow">
      <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill={topColor} stroke="#000" strokeWidth="3" />
      <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#fff" stroke="#000" strokeWidth="3" />
      <rect x="5" y="47" width="90" height="6" fill="#000" />
      <circle cx="50" cy="50" r="14" fill="#000" />
      <circle cx="50" cy="50" r="10" fill="#fff" />
      <circle cx="50" cy="50" r="6" fill={s === "red" ? "#000" : topColor} />
      <circle cx="50" cy="50" r="3" fill="#fff" />
    </svg>
  );
}

function MachineSlot({
  index,
  isLoaded,
  isActive,
  isLit,
}: {
  index: number;
  isLoaded: boolean;
  isActive: boolean;
  isLit: boolean;
}) {
  const baseRing = isActive
    ? "border-yellow-400 shadow-xl animate-slotGlow"
    : isLit
      ? "border-emerald-400 shadow-lg shadow-emerald-400/40"
      : "border-slate-600";

  const innerBg = isActive ? "bg-yellow-400/25" : isLit ? "bg-emerald-400/20" : isLoaded ? "bg-slate-700" : "bg-slate-900";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`relative flex h-14 w-14 items-center justify-center rounded-full border-4 transition-all duration-300 ${baseRing} ${innerBg}`}>
        {isLoaded && (
          <div className={`h-9 w-9 transition-all duration-200 ${isActive ? "scale-110 drop-shadow-lg" : "scale-100"}`}>
            <PokeballSVG state={isLit ? "green" : isActive ? "yellow" : "red"} />
          </div>
        )}
        {!isLoaded && <div className="h-7 w-7 rounded-full border-2 border-slate-600 opacity-30" />}
        {isActive && <div className="pointer-events-none absolute inset-0 animate-ping rounded-full border-4 border-yellow-400/40" />}
      </div>
      <div className="flex h-4 w-4 items-center justify-center rounded-full text-[7px]">
        {isLit ? (
          <span className="text-emerald-400 font-pixel">✓</span>
        ) : (
          <span className="font-pixel text-slate-600">{String(index + 1).padStart(2, "0")}</span>
        )}
      </div>
    </div>
  );
}

function HealMachine({ state, tray }: { state: HealState; tray: HealPokemon[] }) {
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
                on ? (i === 2 ? "bg-emerald-400 shadow shadow-emerald-400/60" : "bg-yellow-400 shadow shadow-yellow-400/60 animate-pulse") : "bg-slate-600"
              }`}
            />
          ))}
        </div>
        <div className="rounded-xl bg-slate-900/60 px-4 py-1.5">
          <span className="font-pixel text-[8px] uppercase tracking-widest text-slate-400">
            {state.phase === "idle"
              ? "EM ESPERA"
              : state.phase === "loading"
                ? "CARREGANDO"
                : state.phase === "sequencing"
                  ? "CURANDO..."
                  : state.phase === "filling"
                    ? "RESTAURANDO"
                    : "CONCLUÍDO ✓"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className={`h-4 w-4 ${running ? "text-yellow-400 animate-pulse" : done ? "text-emerald-400" : "text-slate-600"}`} />
          <span className="font-pixel text-[8px] text-slate-500">{slotCount}/6</span>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="mb-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-2 shadow-lg shadow-red-500/25">
            <Heart className="h-4 w-4 text-white" />
            <span className="font-pixel text-[10px] tracking-widest text-white">POKÉMON HEALING SYSTEM</span>
            <Heart className="h-4 w-4 text-white" />
          </div>
          <p className="mt-1.5 text-[9px] text-slate-500">Modelo RX-9 · Joy Edition · Kanto</p>
        </div>

        <div className="rounded-2xl bg-slate-950/50 p-5">
          <p className="mb-4 text-center font-pixel text-[8px] uppercase tracking-widest text-slate-500">Bandeja de Recuperação</p>
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
                state.litSlots[i] ? "bg-emerald-400 shadow shadow-emerald-400/60" : state.activeSlot === i ? "bg-yellow-400 animate-pulse" : loadedSlots[i] ? "bg-red-500" : "bg-slate-700"
              }`}
            />
          ))}
        </div>
        <p className="text-[8px] text-slate-600 font-pixel">NURSE JOY TECH™</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT CARD
// ─────────────────────────────────────────────────────────────────────────────

function PatientCard({
  pokemon,
  currentHp,
  slotIndex,
  activeSlot,
  isLit,
  isHealing,
  isInTray,
  onClick,
}: {
  pokemon: HealPokemon;
  currentHp: number;
  slotIndex: number;
  activeSlot: number;
  isLit: boolean;
  isHealing: boolean;
  isInTray: boolean;
  onClick: () => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const tc = getTC(pokemon.type);
  const sc = STATUS_CFG[pokemon.status];
  const pct = currentHp / pokemon.maxHp;
  const barColor = isLit ? "#22c55e" : hpBarColor(pct);
  const isActive = activeSlot === slotIndex;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all duration-400
      ${isActive ? "border-yellow-400 shadow-yellow-400/30 scale-[1.04]" : isLit ? "border-emerald-300 shadow-emerald-200/40" : isInTray ? "border-red-400 ring-2 ring-red-400/40 shadow-red-200/30" : "border-slate-200/80"}
      hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-400/50`}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${tc.gradient}`} />

      <div className="absolute right-1.5 top-2.5">
        {isLit ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <span className={`rounded-full px-1.5 py-0.5 text-[7px] font-bold uppercase ${sc.bg} ${sc.color}`}>{sc.label}</span>
        )}
      </div>

      <div className="p-3">
        <div
          className="relative mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-xl"
          style={{ background: `linear-gradient(135deg, ${tc.glow.replace("0.5", "0.12")}, transparent)` }}
        >
          {!imgLoaded && <div className="absolute inset-0 animate-pulse rounded-xl bg-slate-100" />}
          {isActive && <div className="absolute inset-0 rounded-xl animate-pulse" style={{ boxShadow: `inset 0 0 14px ${tc.glow}` }} />}
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            onLoad={() => setImgLoaded(true)}
            className={`relative z-10 h-12 w-12 object-contain drop-shadow transition-all duration-500
              ${imgLoaded ? "opacity-100" : "opacity-0"}
              ${isActive ? "animate-healFloat" : ""}
              ${pokemon.status === "fainted" && !isLit ? "opacity-50 grayscale" : ""}
            `}
          />
          {isActive && <Sparkles className="absolute right-0.5 top-0.5 h-4 w-4 animate-spin text-yellow-400 opacity-80" />}
        </div>

        <p className="text-center font-pixel text-[8px] text-slate-700 truncate">{pokemon.name}</p>
        <p className="text-center text-[9px] text-slate-400">Lv.{pokemon.level}</p>

        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-[7px] uppercase tracking-wider text-slate-400">HP</span>
            <span className="font-pixel text-[8px] text-slate-600">{currentHp}/{pokemon.maxHp}</span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-slate-100 shadow-inner">
            <div
              className="h-full rounded-full relative transition-all min-w-0"
              style={{
                width: pokemon.maxHp > 0
                  ? `${Math.max((currentHp / pokemon.maxHp) * 100, currentHp === 0 ? 4 : 0)}%`
                  : "0%",
                background: barColor,
                transitionDuration: isHealing ? "0.5s" : "0.2s",
                boxShadow: isLit ? "0 0 8px #22c55e88" : undefined,
              }}
            >
              {isLit && (
                <div
                  className="absolute inset-0 rounded-full animate-shimmerHp"
                  style={{ backgroundImage: "linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUCCESS TOAST
// ─────────────────────────────────────────────────────────────────────────────

function SuccessToast({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 shadow-2xl shadow-emerald-500/40">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <Heart className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-pixel text-[10px] text-white">CURA COMPLETA!</p>
          <p className="mt-0.5 text-xs text-white/80">Seu time está em perfeitas condições! ✨</p>
        </div>
        <CheckCircle2 className="h-6 w-6 text-white/80" />
      </div>
    </div>
  );
}

function Shimmer() {
  return (
    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
  );
}

function Spinner() {
  return <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />;
}

const HEAL_CSS = `
  @keyframes slotGlow {
    0%,100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.6);  }
    50%     { box-shadow: 0 0 0 14px rgba(251,191,36,0); }
  }
  .animate-slotGlow { animation: slotGlow 0.7s ease-in-out infinite; }

  @keyframes healFloat {
    0%,100% { transform: translateY(0)  scale(1);    }
    50%     { transform: translateY(-6px) scale(1.06); }
  }
  .animate-healFloat { animation: healFloat 1.4s ease-in-out infinite; }

  @keyframes shimmerHp {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
  .animate-shimmerHp { animation: shimmerHp 1.8s ease-in-out infinite; }
`;

const SEARCH_DEBOUNCE_MS = 400;

function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

// ─────────────────────────────────────────────────────────────────────────────
// HEAL PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function HealPage() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);
  const { team, loading, tray, addToTray, removeFromTray, isInTray, trayIndex, state, heal, healError, clearHealError } = useHealHandler(debouncedSearch);

  const handleSearchChange = useCallback((v: string) => {
    setSearchInput(v);
  }, []);

  const isRunning = ["loading", "sequencing", "filling"].includes(state.phase);
  const isDone = state.phase === "done";

  return (
    <AppLayout
      search={searchInput}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar Pokémon..."
    >
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <nav className="mb-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>Dashboard</span>
            <span>›</span>
            <span className="font-semibold text-red-500">Recuperação</span>
          </nav>
          <h1 className="font-pixel text-2xl text-red-500 sm:text-3xl">CENTRO DE RECUPERAÇÃO</h1>
          <p className="mt-1.5 text-sm text-slate-500">Restaure a saúde do seu time completo.</p>
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-red-500/30 via-slate-200 to-transparent" />

        {loading ? (
          <div className="mb-6 flex min-h-[200px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-500/30 border-t-red-500" />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <HealMachine state={state} tray={tray} />
            </div>

            {healError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {healError}
                <button type="button" onClick={clearHealError} className="ml-2 underline">Fechar</button>
              </div>
            )}

            <button
              onClick={heal}
              disabled={isRunning || tray.length === 0}
              className={`group relative mb-6 w-full overflow-hidden rounded-2xl py-5 font-pixel text-[11px] tracking-widest text-white shadow-xl transition-all duration-200 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70
                ${isDone ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/25 hover:shadow-xl" : isRunning ? "bg-slate-600" : "bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/30 hover:scale-[1.01] hover:shadow-2xl"}`}
            >
              <Shimmer />
              <span className="relative flex items-center justify-center gap-3">
                {isRunning ? (
                  <>
                    <Spinner /> CURANDO TIME...
                  </>
                ) : isDone ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" /> POKEMONS CURADOS! CURAR NOVAMENTE?
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5" /> CURAR POKEMONS <Sparkles className="h-5 w-5" />
                  </>
                )}
              </span>
            </button>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-3.5 w-1 rounded-full bg-red-500" />
                <h2 className="font-pixel text-[9px] uppercase tracking-widest text-slate-500">STATUS DOS POKEMONS</h2>
              </div>
              <p className="mb-3 text-[10px] text-slate-500">Clique em um Pokémon para colocá-lo na bandeja de recuperação (máx. 6).</p>
              {team.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 opacity-25">
                    <svg viewBox="0 0 100 100" className="mx-auto h-16 w-16">
                      <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="#ef4444" />
                      <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#e2e8f0" />
                      <rect x="5" y="47" width="90" height="6" fill="#94a3b8" />
                      <circle cx="50" cy="50" r="14" fill="#94a3b8" />
                      <circle cx="50" cy="50" r="10" fill="#f1f5f9" />
                      <circle cx="50" cy="50" r="6" fill="#cbd5e1" />
                    </svg>
                  </div>
                  <p className="font-pixel text-[10px] text-slate-500">
                    {debouncedSearch.trim() ? "Nenhum Pokémon encontrado." : "Você ainda não tem Pokémon."}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {debouncedSearch.trim() ? "Tente ajustar o termo de busca." : "Capture ou crie Pokémon na área de Pokémon."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {team.map((p, i) => {
                    const idx = trayIndex(p);
                    const useDisplayHp = idx >= 0 && (state.phase === "filling" || state.phase === "done");
                    const currentHp = useDisplayHp ? (state.displayHp[idx] ?? p.hp) : p.hp;
                    return (
                      <PatientCard
                        key={p.id}
                        pokemon={p}
                        currentHp={currentHp}
                        slotIndex={idx >= 0 ? idx : i}
                        activeSlot={state.activeSlot}
                        isLit={idx >= 0 && state.litSlots[idx]}
                        isHealing={state.phase === "filling"}
                        isInTray={isInTray(p)}
                        onClick={() => (isInTray(p) ? removeFromTray(p) : addToTray(p))}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <SuccessToast visible={state.showToast} />
      <style>{HEAL_CSS}</style>
    </AppLayout>
  );
}
