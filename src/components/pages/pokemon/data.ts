import type { LucideIcon } from "lucide-react";
import {
  Leaf,
  Moon,
  Flame,
  Droplets,
  Zap,
  Wind,
  Ghost,
  Mountain,
  Bug,
  Star,
  Swords,
  Shield,
  Heart,
  Globe,
  Plus,
} from "lucide-react";
import type { FilterOption, PageTab } from "./types";

export interface TypeMeta {
  gradient: string;
  light: string;
  badge: string;
  icon: LucideIcon;
}

export const TYPE_META: Record<string, TypeMeta> = {
  grass:    { gradient: "from-emerald-400 to-green-500",   light: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: Leaf },
  poison:   { gradient: "from-fuchsia-400 to-purple-500",  light: "bg-fuchsia-50", badge: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200", icon: Moon },
  fire:     { gradient: "from-orange-400 to-red-500",      light: "bg-orange-50",  badge: "bg-orange-100 text-orange-700 border-orange-200",    icon: Flame },
  water:    { gradient: "from-blue-400 to-cyan-500",       light: "bg-blue-50",    badge: "bg-blue-100 text-blue-700 border-blue-200",          icon: Droplets },
  electric: { gradient: "from-yellow-300 to-amber-400",    light: "bg-yellow-50",  badge: "bg-yellow-100 text-yellow-700 border-yellow-200",    icon: Zap },
  psychic:  { gradient: "from-pink-400 to-rose-500",       light: "bg-pink-50",    badge: "bg-pink-100 text-pink-700 border-pink-200",          icon: Star },
  ghost:    { gradient: "from-indigo-400 to-violet-600",   light: "bg-indigo-50",  badge: "bg-indigo-100 text-indigo-700 border-indigo-200",    icon: Ghost },
  rock:     { gradient: "from-stone-400 to-stone-600",     light: "bg-stone-50",   badge: "bg-stone-100 text-stone-700 border-stone-200",       icon: Mountain },
  ground:   { gradient: "from-amber-400 to-yellow-600",    light: "bg-amber-50",   badge: "bg-amber-100 text-amber-700 border-amber-200",       icon: Mountain },
  flying:   { gradient: "from-sky-300 to-blue-400",        light: "bg-sky-50",     badge: "bg-sky-100 text-sky-700 border-sky-200",             icon: Wind },
  bug:      { gradient: "from-lime-400 to-green-500",      light: "bg-lime-50",    badge: "bg-lime-100 text-lime-700 border-lime-200",          icon: Bug },
  dragon:   { gradient: "from-violet-500 to-indigo-700",   light: "bg-violet-50",  badge: "bg-violet-100 text-violet-700 border-violet-200",    icon: Flame },
  normal:   { gradient: "from-slate-300 to-slate-500",     light: "bg-slate-50",   badge: "bg-slate-100 text-slate-700 border-slate-200",       icon: Star },
  ice:      { gradient: "from-cyan-300 to-blue-400",       light: "bg-cyan-50",    badge: "bg-cyan-100 text-cyan-700 border-cyan-200",          icon: Droplets },
  fighting: { gradient: "from-red-400 to-orange-600",      light: "bg-red-50",     badge: "bg-red-100 text-red-700 border-red-200",             icon: Swords },
  steel:    { gradient: "from-slate-400 to-zinc-600",      light: "bg-zinc-50",    badge: "bg-zinc-100 text-zinc-700 border-zinc-200",          icon: Shield },
  dark:     { gradient: "from-gray-600 to-gray-800",       light: "bg-gray-50",    badge: "bg-gray-100 text-gray-700 border-gray-200",          icon: Moon },
  fairy:    { gradient: "from-pink-300 to-rose-400",       light: "bg-pink-50",    badge: "bg-pink-100 text-pink-700 border-pink-200",          icon: Star },
};

export const TYPES_LIST = Object.keys(TYPE_META);

export const fallbackMeta = TYPE_META.normal;

export const getMeta = (type: string): TypeMeta =>
  TYPE_META[type.toLowerCase()] ?? fallbackMeta;

export const FILTER_OPTIONS: { id: FilterOption; label: string }[] = [
  { id: "all",      label: "All" },
  { id: "created",  label: "Created by Me" },
  { id: "captured", label: "Captured" },
];

export const TABS: { id: PageTab; label: string; icon: LucideIcon }[] = [
  { id: "your-pokemon", label: "YOUR POKÉMON", icon: Heart },
  { id: "wild-area",    label: "WILD AREA",    icon: Globe },
  { id: "new-pokemon",  label: "NEW POKÉMON",  icon: Plus },
];
