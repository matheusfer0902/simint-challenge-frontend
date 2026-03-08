/** Gradientes por tipo (para slots de Pokémon) */
export const TYPE_GRADIENT: Record<string, string> = {
  electric: "from-yellow-300 to-amber-400",
  fire: "from-orange-400 to-red-500",
  water: "from-blue-400 to-cyan-500",
  grass: "from-emerald-400 to-green-500",
  psychic: "from-pink-400 to-rose-500",
  ghost: "from-indigo-500 to-violet-700",
  normal: "from-slate-300 to-slate-500",
  dragon: "from-violet-500 to-indigo-700",
  ice: "from-cyan-300 to-blue-400",
  poison: "from-fuchsia-400 to-purple-500",
  steel: "from-slate-400 to-zinc-600",
  fighting: "from-red-400 to-orange-600",
  flying: "from-sky-300 to-blue-400",
  rock: "from-stone-400 to-stone-600",
};

export const TYPE_BADGE: Record<string, string> = {
  electric: "bg-yellow-100 text-yellow-700",
  fire: "bg-orange-100 text-orange-700",
  water: "bg-blue-100 text-blue-700",
  grass: "bg-emerald-100 text-emerald-700",
  psychic: "bg-pink-100 text-pink-700",
  ghost: "bg-indigo-100 text-indigo-700",
  normal: "bg-slate-100 text-slate-700",
  dragon: "bg-violet-100 text-violet-700",
  poison: "bg-fuchsia-100 text-fuchsia-700",
  fighting: "bg-red-100 text-red-700",
  ice: "bg-cyan-100 text-cyan-700",
  steel: "bg-zinc-100 text-zinc-700",
  flying: "bg-sky-100 text-sky-700",
  rock: "bg-stone-100 text-stone-700",
};

/** Estilo do badge de grade (S, A, B, C) */
export const RANK_STYLE: Record<string, string> = {
  S: "from-yellow-400 to-orange-400",
  A: "from-poke-red to-rose-600",
  B: "from-blue-400 to-blue-600",
  C: "from-slate-400 to-slate-500",
};

export const getTypeGradient = (t: string) =>
  TYPE_GRADIENT[t.toLowerCase()] ?? TYPE_GRADIENT.normal;
export const getTypeBadge = (t: string) =>
  TYPE_BADGE[t.toLowerCase()] ?? TYPE_BADGE.normal;
