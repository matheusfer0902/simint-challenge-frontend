import type { TypeMeta } from "./types";

export const TYPE_META: Record<string, TypeMeta> = {
  fire:     { gradient:"from-orange-500 to-red-500",     badge:"bg-orange-100 text-orange-700 border-orange-200",   glow:"rgba(249,115,22,0.45)",  accent:"#f97316", icon:"🔥" },
  water:    { gradient:"from-blue-500 to-cyan-500",      badge:"bg-blue-100 text-blue-700 border-blue-200",         glow:"rgba(59,130,246,0.4)",   accent:"#3b82f6", icon:"💧" },
  grass:    { gradient:"from-emerald-500 to-green-600",  badge:"bg-emerald-100 text-emerald-700 border-emerald-200",glow:"rgba(16,185,129,0.4)",   accent:"#10b981", icon:"🌿" },
  electric: { gradient:"from-yellow-400 to-amber-500",  badge:"bg-yellow-100 text-yellow-700 border-yellow-200",   glow:"rgba(245,158,11,0.5)",   accent:"#f59e0b", icon:"⚡" },
  psychic:  { gradient:"from-pink-500 to-rose-600",     badge:"bg-pink-100 text-pink-700 border-pink-200",         glow:"rgba(236,72,153,0.4)",   accent:"#ec4899", icon:"🔮" },
  ghost:    { gradient:"from-violet-600 to-indigo-700", badge:"bg-violet-100 text-violet-700 border-violet-200",   glow:"rgba(124,58,237,0.4)",   accent:"#7c3aed", icon:"👻" },
  dragon:   { gradient:"from-violet-500 to-purple-700", badge:"bg-purple-100 text-purple-700 border-purple-200",   glow:"rgba(109,40,217,0.4)",   accent:"#6d28d9", icon:"🐉" },
  dark:     { gradient:"from-gray-700 to-slate-900",    badge:"bg-gray-200 text-gray-800 border-gray-300",         glow:"rgba(55,65,81,0.45)",    accent:"#374151", icon:"🌑" },
  steel:    { gradient:"from-slate-400 to-zinc-600",    badge:"bg-zinc-100 text-zinc-700 border-zinc-300",         glow:"rgba(113,113,122,0.35)", accent:"#71717a", icon:"⚙️" },
  ice:      { gradient:"from-cyan-400 to-blue-400",     badge:"bg-cyan-100 text-cyan-700 border-cyan-200",         glow:"rgba(6,182,212,0.4)",    accent:"#06b6d4", icon:"❄️" },
  normal:   { gradient:"from-slate-300 to-slate-500",   badge:"bg-slate-100 text-slate-700 border-slate-200",      glow:"rgba(148,163,184,0.3)",  accent:"#94a3b8", icon:"⭕" },
  fighting: { gradient:"from-red-600 to-orange-700",   badge:"bg-red-100 text-red-700 border-red-200",            glow:"rgba(220,38,38,0.4)",    accent:"#dc2626", icon:"👊" },
  poison:   { gradient:"from-fuchsia-500 to-purple-600",badge:"bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",glow:"rgba(192,38,211,0.4)",   accent:"#c026d3", icon:"☠️" },
  ground:   { gradient:"from-amber-600 to-yellow-700",  badge:"bg-amber-100 text-amber-700 border-amber-200",      glow:"rgba(217,119,6,0.4)",    accent:"#d97706", icon:"🌍" },
  flying:   { gradient:"from-sky-400 to-blue-500",      badge:"bg-sky-100 text-sky-700 border-sky-200",            glow:"rgba(14,165,233,0.4)",   accent:"#0ea5e9", icon:"🦅" },
  rock:     { gradient:"from-stone-500 to-stone-700",   badge:"bg-stone-100 text-stone-700 border-stone-200",      glow:"rgba(120,113,108,0.35)", accent:"#78716c", icon:"🪨" },
  bug:      { gradient:"from-lime-500 to-green-600",    badge:"bg-lime-100 text-lime-700 border-lime-200",         glow:"rgba(101,163,13,0.4)",   accent:"#65a30d", icon:"🐛" },
  fairy:    { gradient:"from-pink-300 to-rose-400",     badge:"bg-pink-100 text-pink-600 border-pink-200",         glow:"rgba(244,114,182,0.4)",  accent:"#f472b6", icon:"✨" },
};

export function getTypeMeta(slug: string): TypeMeta {
  return TYPE_META[slug] ?? TYPE_META.normal;
}

export const TYPE_SLUG_TO_NAME: Record<string, string> = {
  fire:"Fogo", water:"Água", grass:"Planta", electric:"Elétrico", psychic:"Psíquico", ghost:"Fantasma",
  dragon:"Dragão", dark:"Sombrio", steel:"Aço", ice:"Gelo", normal:"Normal", fighting:"Lutador",
  poison:"Veneno", ground:"Terra", flying:"Voador", rock:"Pedra", bug:"Inseto", fairy:"Fada",
};

export const TYPE_FILTER_OPTIONS = Object.entries(TYPE_SLUG_TO_NAME).map(([slug, name]) => ({ slug, name }));

export const MAX_STAT = 160;
export const DETAIL_STAT_MAX = 200;

import type { PokedexFilters } from "./types";

export const INIT_FILTERS: PokedexFilters = {
  search: "",
  type: "",
  captured: "all",
};
