import type { TrainPokemon, TypeColors } from "./types";

export const TYPE_COLORS: Record<string, TypeColors> = {
  electric: { gradient: "from-yellow-400 to-amber-500", glow: "rgba(245,158,11,0.55)", accent: "#f59e0b", badge: "bg-yellow-100 text-yellow-800" },
  fire: { gradient: "from-orange-500 to-red-500", glow: "rgba(249,115,22,0.5)", accent: "#f97316", badge: "bg-orange-100 text-orange-800" },
  grass: { gradient: "from-emerald-500 to-green-600", glow: "rgba(16,185,129,0.5)", accent: "#10b981", badge: "bg-emerald-100 text-emerald-800" },
  water: { gradient: "from-blue-500 to-cyan-500", glow: "rgba(59,130,246,0.5)", accent: "#3b82f6", badge: "bg-blue-100 text-blue-800" },
  ghost: { gradient: "from-violet-600 to-indigo-700", glow: "rgba(124,58,237,0.55)", accent: "#7c3aed", badge: "bg-violet-100 text-violet-800" },
  dragon: { gradient: "from-violet-500 to-purple-700", glow: "rgba(109,40,217,0.5)", accent: "#6d28d9", badge: "bg-purple-100 text-purple-800" },
  poison: { gradient: "from-fuchsia-500 to-purple-600", glow: "rgba(192,38,211,0.45)", accent: "#c026d3", badge: "bg-fuchsia-100 text-fuchsia-800" },
  normal: { gradient: "from-slate-400 to-zinc-600", glow: "rgba(100,116,139,0.35)", accent: "#64748b", badge: "bg-slate-100 text-slate-700" },
  flying: { gradient: "from-sky-400 to-blue-500", glow: "rgba(14,165,233,0.45)", accent: "#0ea5e9", badge: "bg-sky-100 text-sky-800" },
  psychic: { gradient: "from-pink-500 to-rose-600", glow: "rgba(236,72,153,0.5)", accent: "#ec4899", badge: "bg-pink-100 text-pink-800" },
  ice: { gradient: "from-cyan-400 to-blue-500", glow: "rgba(6,182,212,0.45)", accent: "#06b6d4", badge: "bg-cyan-100 text-cyan-800" },
};

export function getTypeColors(t: string): TypeColors {
  return TYPE_COLORS[t.toLowerCase()] ?? TYPE_COLORS.normal;
}

export const DEFAULT_TRAIN_POKEMON: TrainPokemon = {
  id: 0,
  name: "",
  type: "normal",
  level: 1,
  hp: 0,
  maxHp: 1,
  attack: 0,
  defense: 0,
  speed: 0,
  xp: 0,
  xpToNext: 1000,
  sprite: "",
};
