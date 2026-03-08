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
import type { PokemonData, PageTab } from "./types";

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
  flying:   { gradient: "from-sky-300 to-blue-400",        light: "bg-sky-50",     badge: "bg-sky-100 text-sky-700 border-sky-200",             icon: Wind },
  bug:      { gradient: "from-lime-400 to-green-500",      light: "bg-lime-50",    badge: "bg-lime-100 text-lime-700 border-lime-200",          icon: Bug },
  dragon:   { gradient: "from-violet-500 to-indigo-700",   light: "bg-violet-50",  badge: "bg-violet-100 text-violet-700 border-violet-200",    icon: Flame },
  normal:   { gradient: "from-slate-300 to-slate-500",     light: "bg-slate-50",   badge: "bg-slate-100 text-slate-700 border-slate-200",       icon: Star },
  ice:      { gradient: "from-cyan-300 to-blue-400",       light: "bg-cyan-50",    badge: "bg-cyan-100 text-cyan-700 border-cyan-200",          icon: Droplets },
  fighting: { gradient: "from-red-400 to-orange-600",      light: "bg-red-50",     badge: "bg-red-100 text-red-700 border-red-200",             icon: Swords },
  steel:    { gradient: "from-slate-400 to-zinc-600",      light: "bg-zinc-50",    badge: "bg-zinc-100 text-zinc-700 border-zinc-200",          icon: Shield },
};

export const TYPES_LIST = Object.keys(TYPE_META);

export const fallbackMeta = TYPE_META.normal;

export const getMeta = (type: string): TypeMeta =>
  TYPE_META[type.toLowerCase()] ?? fallbackMeta;

const sprite = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const YOUR_POKEMON: PokemonData[] = [
  { id: 1,   dexNumber: "#001", name: "Bulbasaur",  types: ["grass", "poison"],  level: 30, stats: { hp: 45,  attack: 49,  defense: 49, speed: 45  }, tag: "created",  sprite: sprite(1),   region: "Kanto" },
  { id: 2,   dexNumber: "#025", name: "Pikachu",    types: ["electric"],         level: 32, stats: { hp: 35,  attack: 55,  defense: 30, speed: 90  }, tag: "captured", sprite: sprite(25),  region: "Kanto" },
  { id: 3,   dexNumber: "#026", name: "Raichu",     types: ["electric"],         level: 31, stats: { hp: 60,  attack: 90,  defense: 55, speed: 110 }, tag: "captured", sprite: sprite(26),  region: "Kanto" },
  { id: 4,   dexNumber: "#007", name: "Squirtle",   types: ["water"],            level: 30, stats: { hp: 44,  attack: 48,  defense: 65, speed: 43  }, tag: "captured", sprite: sprite(7),   region: "Kanto" },
  { id: 5,   dexNumber: "#006", name: "Charizard",  types: ["fire", "flying"],   level: 37, stats: { hp: 78,  attack: 84,  defense: 78, speed: 100 }, tag: "captured", sprite: sprite(6),   region: "Kanto" },
  { id: 6,   dexNumber: "#004", name: "Charmander", types: ["fire"],             level: 37, stats: { hp: 39,  attack: 52,  defense: 43, speed: 65  }, tag: "created",  sprite: sprite(4),   region: "Kanto" },
  { id: 7,   dexNumber: "#131", name: "Lapras",     types: ["water", "ice"],     level: 40, stats: { hp: 130, attack: 85,  defense: 80, speed: 60  }, tag: "captured", sprite: sprite(131), region: "Kanto" },
  { id: 8,   dexNumber: "#094", name: "Gengar",     types: ["ghost", "poison"],  level: 36, stats: { hp: 60,  attack: 65,  defense: 60, speed: 110 }, tag: "created",  sprite: sprite(94),  region: "Kanto" },
  { id: 9,   dexNumber: "#143", name: "Snorlax",    types: ["normal"],           level: 50, stats: { hp: 160, attack: 110, defense: 65, speed: 30  }, tag: "captured", sprite: sprite(143), region: "Kanto" },
  { id: 10,  dexNumber: "#149", name: "Dragonite",  types: ["dragon", "flying"], level: 55, stats: { hp: 91,  attack: 134, defense: 95, speed: 80  }, tag: "created",  sprite: sprite(149), region: "Kanto" },
  { id: 11,  dexNumber: "#150", name: "Mewtwo",     types: ["psychic"],          level: 70, stats: { hp: 106, attack: 110, defense: 90, speed: 130 }, tag: "captured", sprite: sprite(150), region: "Kanto", shiny: true },
  { id: 12,  dexNumber: "#059", name: "Arcanine",   types: ["fire"],             level: 42, stats: { hp: 90,  attack: 110, defense: 80, speed: 95  }, tag: "captured", sprite: sprite(59),  region: "Kanto" },
];

export const WILD_POKEMON: PokemonData[] = [
  { id: 101, dexNumber: "#037", name: "Vulpix",    types: ["fire"],           level: 18, stats: { hp: 38, attack: 41, defense: 40, speed: 65 }, tag: "wild", sprite: sprite(37),  region: "Mt. Moon" },
  { id: 102, dexNumber: "#052", name: "Meowth",    types: ["normal"],         level: 12, stats: { hp: 40, attack: 45, defense: 35, speed: 90 }, tag: "wild", sprite: sprite(52),  region: "Lavender Town" },
  { id: 103, dexNumber: "#063", name: "Abra",      types: ["psychic"],        level: 16, stats: { hp: 25, attack: 20, defense: 15, speed: 90 }, tag: "wild", sprite: sprite(63),  region: "Saffron City" },
  { id: 104, dexNumber: "#074", name: "Geodude",   types: ["rock"],           level: 14, stats: { hp: 40, attack: 80, defense: 100, speed: 20 }, tag: "wild", sprite: sprite(74),  region: "Mt. Moon" },
  { id: 105, dexNumber: "#058", name: "Growlithe", types: ["fire"],           level: 20, stats: { hp: 55, attack: 70, defense: 45, speed: 60 }, tag: "wild", sprite: sprite(58),  region: "Cinnabar Island" },
  { id: 106, dexNumber: "#016", name: "Pidgey",    types: ["normal", "flying"], level: 8, stats: { hp: 40, attack: 45, defense: 40, speed: 56 }, tag: "wild", sprite: sprite(16),  region: "Route 1" },
  { id: 107, dexNumber: "#129", name: "Magikarp",  types: ["water"],          level: 5,  stats: { hp: 20, attack: 10, defense: 55, speed: 80 }, tag: "wild", sprite: sprite(129), region: "Cerulean Lake" },
  { id: 108, dexNumber: "#041", name: "Zubat",     types: ["poison", "flying"], level: 15, stats: { hp: 40, attack: 45, defense: 35, speed: 55 }, tag: "wild", sprite: sprite(41),  region: "Mt. Moon" },
];

export const FILTER_OPTIONS: { id: import("./types").FilterOption; label: string }[] = [
  { id: "all",      label: "All" },
  { id: "created",  label: "Created by Me" },
  { id: "captured", label: "Captured" },
];

export const TABS: { id: PageTab; label: string; icon: LucideIcon }[] = [
  { id: "your-pokemon", label: "YOUR POKÉMON", icon: Heart },
  { id: "wild-area",    label: "WILD AREA",    icon: Globe },
  { id: "new-pokemon",  label: "NEW POKÉMON",  icon: Plus },
];
