export interface TypeStyle {
  gradient: string;
  badge: string;
  glow: string;
}

export const TYPE_STYLES: Record<string, TypeStyle> = {
  grass: {
    gradient: "from-emerald-400 to-green-500",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-300",
    glow: "rgba(52,211,153,0.35)",
  },
  poison: {
    gradient: "from-fuchsia-400 to-purple-500",
    badge: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300",
    glow: "rgba(192,38,211,0.25)",
  },
  fire: {
    gradient: "from-orange-400 to-red-500",
    badge: "bg-orange-100 text-orange-700 border-orange-300",
    glow: "rgba(251,146,60,0.35)",
  },
  water: {
    gradient: "from-blue-400 to-cyan-500",
    badge: "bg-blue-100 text-blue-700 border-blue-300",
    glow: "rgba(96,165,250,0.35)",
  },
  electric: {
    gradient: "from-yellow-300 to-amber-400",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-300",
    glow: "rgba(251,191,36,0.45)",
  },
  psychic: {
    gradient: "from-pink-400 to-rose-500",
    badge: "bg-pink-100 text-pink-700 border-pink-300",
    glow: "rgba(244,114,182,0.35)",
  },
  ghost: {
    gradient: "from-indigo-500 to-violet-700",
    badge: "bg-indigo-100 text-indigo-700 border-indigo-300",
    glow: "rgba(99,102,241,0.35)",
  },
  normal: {
    gradient: "from-slate-300 to-slate-500",
    badge: "bg-slate-100 text-slate-700 border-slate-300",
    glow: "rgba(148,163,184,0.25)",
  },
  dragon: {
    gradient: "from-violet-500 to-indigo-700",
    badge: "bg-violet-100 text-violet-700 border-violet-300",
    glow: "rgba(139,92,246,0.35)",
  },
  ice: {
    gradient: "from-cyan-300 to-blue-400",
    badge: "bg-cyan-100 text-cyan-700 border-cyan-300",
    glow: "rgba(34,211,238,0.35)",
  },
  steel: {
    gradient: "from-slate-400 to-zinc-600",
    badge: "bg-zinc-100 text-zinc-700 border-zinc-300",
    glow: "rgba(113,113,122,0.25)",
  },
  fighting: {
    gradient: "from-red-400 to-orange-600",
    badge: "bg-red-100 text-red-700 border-red-300",
    glow: "rgba(248,113,113,0.35)",
  },
};

export const getDetailTypeStyle = (t: string): TypeStyle =>
  TYPE_STYLES[t.toLowerCase()] ?? TYPE_STYLES.normal;
