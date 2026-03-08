import type { PokemonDetail } from "./types";

const spriteUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const BULBASAUR_DETAIL: PokemonDetail = {
  id: 1,
  dexNumber: "#001",
  name: "Bulbasaur",
  types: ["grass", "poison"],
  level: 30,
  height: "0.7 m",
  weight: "6.9 kg",
  region: "Kanto",
  ability: "Overgrow",
  category: "Seed Pokémon",
  generation: "Generation I",
  description:
    "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon. It can go for days without eating a single morsel.",
  flavourText:
    "For some time after its birth, it grows by gaining nourishment from the seed on its back.",
  stats: { hp: 45, attack: 49, defense: 49, spAtk: 65, spDef: 65, speed: 45 },
  moves: [
    { name: "Razor Leaf", type: "grass", power: 55, pp: 25 },
    { name: "Vine Whip", type: "grass", power: 45, pp: 25 },
    { name: "Sleep Powder", type: "grass", power: "—", pp: 15 },
    { name: "Poison Powder", type: "poison", power: "—", pp: 35 },
    { name: "Tackle", type: "normal", power: 40, pp: 35 },
    { name: "Leech Seed", type: "grass", power: "—", pp: 10 },
  ],
  evolution: [
    { id: 1, name: "Bulbasaur", level: 1, sprite: spriteUrl(1) },
    { id: 2, name: "Ivysaur", level: 16, sprite: spriteUrl(2) },
    { id: 3, name: "Venusaur", level: 32, sprite: spriteUrl(3) },
  ],
  sprite: spriteUrl(1),
  shiny: false,
};

export const POKEMON_DETAIL_REGISTRY: Record<number, PokemonDetail> = {
  1: BULBASAUR_DETAIL,
  25: {
    ...BULBASAUR_DETAIL,
    id: 25,
    dexNumber: "#025",
    name: "Pikachu",
    types: ["electric"],
    level: 32,
    category: "Mouse Pokémon",
    ability: "Static",
    height: "0.4 m",
    weight: "6.0 kg",
    description:
      "When several of these Pokémon gather, their electricity could build and cause lightning storms.",
    flavourText: "It keeps its tail raised to monitor its surroundings.",
    stats: { hp: 35, attack: 55, defense: 30, spAtk: 50, spDef: 40, speed: 90 },
    moves: [
      { name: "Thunderbolt", type: "electric", power: 90, pp: 15 },
      { name: "Quick Attack", type: "normal", power: 40, pp: 30 },
      { name: "Iron Tail", type: "steel", power: 100, pp: 15 },
      { name: "Thunder Wave", type: "electric", power: "—", pp: 20 },
    ],
    evolution: [
      { id: 172, name: "Pichu", level: 1, sprite: spriteUrl(172) },
      { id: 25, name: "Pikachu", level: 1, sprite: spriteUrl(25) },
      { id: 26, name: "Raichu", level: 1, sprite: spriteUrl(26) },
    ],
    sprite: spriteUrl(25),
    shiny: false,
  },
};

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
