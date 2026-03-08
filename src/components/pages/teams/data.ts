import type { Team } from "./types";

const spriteUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const MOCK_TEAMS: Team[] = [
  {
    id: "team-001",
    name: "Crimson Storm",
    description:
      "A balanced team built for speed and raw power. Dominating the Kanto circuit.",
    wins: 142,
    losses: 23,
    rank: "S",
    region: "Kanto",
    createdAt: "2024-01-15",
    shareSlug: "crimson-storm-x7k2",
    isPublic: true,
    pokemon: [
      {
        id: 25,
        name: "Pikachu",
        type: "electric",
        level: 32,
        sprite: spriteUrl(25),
        role: "Lead",
      },
      {
        id: 6,
        name: "Charizard",
        type: "fire",
        level: 37,
        sprite: spriteUrl(6),
        role: "Ace",
      },
      {
        id: 4,
        name: "Charmander",
        type: "fire",
        level: 28,
        sprite: spriteUrl(4),
        role: "Reserve",
      },
      {
        id: 7,
        name: "Squirtle",
        type: "water",
        level: 30,
        sprite: spriteUrl(7),
        role: "Pivot",
      },
      {
        id: 54,
        name: "Psyduck",
        type: "water",
        level: 26,
        sprite: spriteUrl(54),
        role: "Support",
      },
      {
        id: 94,
        name: "Gengar",
        type: "ghost",
        level: 36,
        sprite: spriteUrl(94),
        role: "Closer",
      },
    ],
  },
  {
    id: "team-002",
    name: "Steel Dragons",
    description:
      "Defensive powerhouse. Built around bulk and Dragonite's sweeping capability.",
    wins: 89,
    losses: 34,
    rank: "A",
    region: "Johto",
    createdAt: "2024-02-20",
    shareSlug: "steel-dragons-m3p9",
    isPublic: false,
    pokemon: [
      {
        id: 149,
        name: "Dragonite",
        type: "dragon",
        level: 55,
        sprite: spriteUrl(149),
        role: "Ace",
      },
      {
        id: 130,
        name: "Gyarados",
        type: "water",
        level: 45,
        sprite: spriteUrl(130),
        role: "Lead",
      },
      {
        id: 143,
        name: "Snorlax",
        type: "normal",
        level: 50,
        sprite: spriteUrl(143),
        role: "Tank",
      },
      {
        id: 59,
        name: "Arcanine",
        type: "fire",
        level: 42,
        sprite: spriteUrl(59),
        role: "Speed",
      },
      {
        id: 131,
        name: "Lapras",
        type: "ice",
        level: 40,
        sprite: spriteUrl(131),
        role: "Pivot",
      },
      null,
    ],
  },
  {
    id: "team-003",
    name: "Psy Force",
    description:
      "Pure Psychic dominance. Mewtwo leads while Alakazam handles the speed tier.",
    wins: 201,
    losses: 15,
    rank: "S",
    region: "Saffron",
    createdAt: "2024-03-01",
    shareSlug: "psy-force-q1w8",
    isPublic: true,
    pokemon: [
      {
        id: 150,
        name: "Mewtwo",
        type: "psychic",
        level: 70,
        sprite: spriteUrl(150),
        role: "Ace",
      },
      {
        id: 65,
        name: "Alakazam",
        type: "psychic",
        level: 48,
        sprite: spriteUrl(65),
        role: "Speed",
      },
      {
        id: 64,
        name: "Kadabra",
        type: "psychic",
        level: 38,
        sprite: spriteUrl(64),
        role: "Reserve",
      },
      null,
      null,
      null,
    ],
  },
];

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
