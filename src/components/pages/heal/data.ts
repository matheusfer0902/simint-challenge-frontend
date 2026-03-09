import type { PokeStatus, TypeColors, StatusConfig } from "./types";

export const TYPE_COLORS: Record<string, TypeColors> = {
  electric: { gradient: "from-yellow-400 to-amber-500", badge: "bg-yellow-100 text-yellow-800", glow: "rgba(245,158,11,0.5)" },
  fire: { gradient: "from-orange-500 to-red-500", badge: "bg-orange-100 text-orange-800", glow: "rgba(249,115,22,0.5)" },
  grass: { gradient: "from-emerald-500 to-green-600", badge: "bg-emerald-100 text-emerald-800", glow: "rgba(16,185,129,0.5)" },
  water: { gradient: "from-blue-500 to-cyan-500", badge: "bg-blue-100 text-blue-800", glow: "rgba(59,130,246,0.5)" },
  ghost: { gradient: "from-violet-600 to-indigo-700", badge: "bg-violet-100 text-violet-800", glow: "rgba(124,58,237,0.5)" },
  dragon: { gradient: "from-violet-500 to-purple-700", badge: "bg-purple-100 text-purple-800", glow: "rgba(109,40,217,0.5)" },
  normal: { gradient: "from-slate-400 to-zinc-600", badge: "bg-slate-100 text-slate-700", glow: "rgba(100,116,139,0.3)" },
  poison: { gradient: "from-fuchsia-500 to-purple-600", badge: "bg-fuchsia-100 text-fuchsia-800", glow: "rgba(192,38,211,0.45)" },
};

export function getTypeColors(t: string): TypeColors {
  return TYPE_COLORS[t.toLowerCase()] ?? TYPE_COLORS.normal;
}

export const STATUS_CFG: Record<PokeStatus, StatusConfig> = {
  healthy: { label: "Healthy", color: "text-emerald-700", bg: "bg-emerald-100" },
  fainted: { label: "Fainted", color: "text-slate-500", bg: "bg-slate-100" },
  poisoned: { label: "Poisoned", color: "text-fuchsia-700", bg: "bg-fuchsia-100" },
  burned: { label: "Burned", color: "text-orange-700", bg: "bg-orange-100" },
  frozen: { label: "Frozen", color: "text-cyan-700", bg: "bg-cyan-100" },
  paralyzed: { label: "Paralyzed", color: "text-yellow-700", bg: "bg-yellow-100" },
};

export function hpBarColor(pct: number): string {
  if (pct <= 0) return "#94a3b8";
  if (pct < 0.25) return "#ef4444";
  if (pct < 0.5) return "#f59e0b";
  return "#22c55e";
}

export const MAX_TRAY = 6;
