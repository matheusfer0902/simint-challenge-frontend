

export const TYPE_META: Record<
  string,
  {
    gradient: string;
    light: string;
    badge: string;
    glow: string;
    accent: string;
  }
> = {
  fire: { gradient: "from-orange-500 to-red-600", light: "from-orange-50 to-red-50", badge: "bg-orange-100 text-orange-700 border-orange-200", glow: "rgba(249,115,22,0.45)", accent: "#f97316" },
  water: { gradient: "from-blue-500 to-cyan-500", light: "from-blue-50 to-cyan-50", badge: "bg-blue-100 text-blue-700 border-blue-200", glow: "rgba(59,130,246,0.45)", accent: "#3b82f6" },
  grass: { gradient: "from-emerald-500 to-green-600", light: "from-emerald-50 to-green-50", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", glow: "rgba(16,185,129,0.45)", accent: "#10b981" },
  electric: { gradient: "from-yellow-400 to-amber-500", light: "from-yellow-50 to-amber-50", badge: "bg-yellow-100 text-yellow-700 border-yellow-200", glow: "rgba(245,158,11,0.5)", accent: "#f59e0b" },
  psychic: { gradient: "from-pink-500 to-rose-600", light: "from-pink-50 to-rose-50", badge: "bg-pink-100 text-pink-700 border-pink-200", glow: "rgba(236,72,153,0.45)", accent: "#ec4899" },
  ghost: { gradient: "from-violet-600 to-indigo-700", light: "from-violet-50 to-indigo-50", badge: "bg-violet-100 text-violet-700 border-violet-200", glow: "rgba(124,58,237,0.45)", accent: "#7c3aed" },
  dragon: { gradient: "from-violet-500 to-purple-700", light: "from-violet-50 to-purple-50", badge: "bg-purple-100 text-purple-700 border-purple-200", glow: "rgba(109,40,217,0.45)", accent: "#6d28d9" },
  ice: { gradient: "from-cyan-400 to-blue-500", light: "from-cyan-50 to-blue-50", badge: "bg-cyan-100 text-cyan-700 border-cyan-200", glow: "rgba(6,182,212,0.45)", accent: "#06b6d4" },
  normal: { gradient: "from-slate-400 to-zinc-600", light: "from-slate-50 to-zinc-50", badge: "bg-slate-100 text-slate-700 border-slate-200", glow: "rgba(100,116,139,0.35)", accent: "#64748b" },
  fighting: { gradient: "from-red-600 to-orange-700", light: "from-red-50 to-orange-50", badge: "bg-red-100 text-red-700 border-red-200", glow: "rgba(220,38,38,0.45)", accent: "#dc2626" },
  poison: { gradient: "from-fuchsia-500 to-purple-600", light: "from-fuchsia-50 to-purple-50", badge: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200", glow: "rgba(192,38,211,0.45)", accent: "#c026d3" },
  steel: { gradient: "from-slate-400 to-zinc-500", light: "from-slate-50 to-zinc-50", badge: "bg-zinc-100 text-zinc-700 border-zinc-200", glow: "rgba(113,113,122,0.35)", accent: "#71717a" },
  flying: { gradient: "from-sky-400 to-blue-500", light: "from-sky-50 to-blue-50", badge: "bg-sky-100 text-sky-700 border-sky-200", glow: "rgba(14,165,233,0.45)", accent: "#0ea5e9" },
  rock: { gradient: "from-stone-500 to-stone-700", light: "from-stone-50 to-zinc-50", badge: "bg-stone-100 text-stone-700 border-stone-200", glow: "rgba(120,113,108,0.35)", accent: "#78716c" },
  ground: { gradient: "from-amber-600 to-yellow-700", light: "from-amber-50 to-yellow-50", badge: "bg-amber-100 text-amber-700 border-amber-200", glow: "rgba(217,119,6,0.45)", accent: "#d97706" },
  bug: { gradient: "from-lime-500 to-green-600", light: "from-lime-50 to-green-50", badge: "bg-lime-100 text-lime-700 border-lime-200", glow: "rgba(101,163,13,0.45)", accent: "#65a30d" },
  dark: { gradient: "from-gray-700 to-slate-900", light: "from-gray-50 to-slate-100", badge: "bg-gray-100 text-gray-700 border-gray-300", glow: "rgba(55,65,81,0.5)", accent: "#374151" },
};

export const getType = (t: string) => TYPE_META[t.toLowerCase()] ?? TYPE_META.normal;

export const RANK_META: Record<string, { bg: string; text: string; label: string }> = {
  S: { bg: "bg-gradient-to-br from-yellow-400 to-amber-500", text: "text-white", label: "S" },
  A: { bg: "bg-gradient-to-br from-red-500 to-rose-600", text: "text-white", label: "A" },
  B: { bg: "bg-gradient-to-br from-blue-500 to-blue-600", text: "text-white", label: "B" },
  C: { bg: "bg-gradient-to-br from-slate-400 to-slate-500", text: "text-white", label: "C" },
};

export const ROLE_META: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800 border-purple-200",
  moderator: "bg-amber-100 text-amber-800 border-amber-200",
  researcher: "bg-blue-100 text-blue-800 border-blue-200",
  trainer: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export const STATUS_META: Record<string, { dot: string; text: string; bg: string }> = {
  active: { dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50" },
  banned: { dot: "bg-red-500 shadow-sm shadow-red-500/60", text: "text-red-700", bg: "bg-red-50" },
  inactive: { dot: "bg-slate-400", text: "text-slate-500", bg: "bg-slate-50" },
};

export const POKE_STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  healthy: { label: "Healthy", color: "text-emerald-700", bg: "bg-emerald-100" },
  fainted: { label: "Fainted", color: "text-slate-500", bg: "bg-slate-100" },
  poisoned: { label: "Poisoned", color: "text-fuchsia-700", bg: "bg-fuchsia-100" },
  burned: { label: "Burned", color: "text-orange-700", bg: "bg-orange-100" },
  frozen: { label: "Frozen", color: "text-cyan-700", bg: "bg-cyan-100" },
  paralyzed: { label: "Paralyzed", color: "text-yellow-700", bg: "bg-yellow-100" },
};

export const sp = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc`;
