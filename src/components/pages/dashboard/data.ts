import type { BattleCardData, UserCardData } from "./types";
import { avatarBg } from "@/lib/utils/avatar";

export { avatarBg };

export const sprite = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const RANK_COLORS: Record<string, string> = {
  S: "from-yellow-400 to-orange-400",
  A: "from-poke-red to-rose-600",
  B: "from-blue-400 to-blue-600",
  C: "from-slate-400 to-slate-500",
};

export const TYPE_COLORS: Record<string, string> = {
  electric: "bg-yellow-400/20 text-yellow-600 border-yellow-400/30",
  fire: "bg-red-400/20 text-red-600 border-red-400/30",
  water: "bg-blue-400/20 text-blue-600 border-blue-400/30",
  grass: "bg-green-400/20 text-green-600 border-green-400/30",
  psychic: "bg-purple-400/20 text-purple-600 border-purple-400/30",
  ghost: "bg-indigo-400/20 text-indigo-600 border-indigo-400/30",
  dragon: "bg-violet-400/20 text-violet-600 border-violet-400/30",
  fighting: "bg-orange-400/20 text-orange-600 border-orange-400/30",
  ice: "bg-cyan-400/20 text-cyan-600 border-cyan-400/30",
  normal: "bg-slate-300/30 text-slate-600 border-slate-300/40",
  poison: "bg-fuchsia-400/20 text-fuchsia-600 border-fuchsia-400/30",
  flying: "bg-sky-300/20 text-sky-600 border-sky-300/30",
};

export const BATTLE_CARDS: BattleCardData[] = [
  {
    id: 1,
    teamName: "Red Tempest",
    owner: { name: "Brock K.", avatar: avatarBg("Brock"), level: 58, region: "Pewter City" },
    rank: "S",
    wins: 142,
    pokemon: [
      { id: 25, name: "Pikachu", sprite: sprite(25), type: "electric" },
      { id: 6, name: "Charizard", sprite: sprite(6), type: "fire" },
      { id: 4, name: "Charmander", sprite: sprite(4), type: "fire" },
      { id: 7, name: "Squirtle", sprite: sprite(7), type: "water" },
      { id: 54, name: "Psyduck", sprite: sprite(54), type: "water" },
      { id: 94, name: "Gengar", sprite: sprite(94), type: "ghost" },
    ],
  },
  {
    id: 2,
    teamName: "Steel Dragons",
    owner: { name: "Gary O.", avatar: avatarBg("Gary"), level: 71, region: "Pallet Town" },
    rank: "A",
    wins: 89,
    pokemon: [
      { id: 149, name: "Dragonite", sprite: sprite(149), type: "dragon" },
      { id: 130, name: "Gyarados", sprite: sprite(130), type: "water" },
      { id: 143, name: "Snorlax", sprite: sprite(143), type: "normal" },
      { id: 59, name: "Arcanine", sprite: sprite(59), type: "fire" },
      { id: 131, name: "Lapras", sprite: sprite(131), type: "ice" },
      { id: 65, name: "Alakazam", sprite: sprite(65), type: "psychic" },
    ],
  },
  {
    id: 3,
    teamName: "Sea Guardians",
    owner: { name: "Misty W.", avatar: avatarBg("Misty"), level: 42, region: "Cerulean City" },
    rank: "A",
    wins: 63,
    pokemon: [
      { id: 121, name: "Starmie", sprite: sprite(121), type: "water" },
      { id: 120, name: "Staryu", sprite: sprite(120), type: "water" },
      { id: 116, name: "Horsea", sprite: sprite(116), type: "water" },
      { id: 118, name: "Goldeen", sprite: sprite(118), type: "water" },
      { id: 54, name: "Psyduck", sprite: sprite(54), type: "water" },
      { id: 117, name: "Seadra", sprite: sprite(117), type: "water" },
    ],
  },
  {
    id: 4,
    teamName: "Psychic Force",
    owner: { name: "Sabrina M.", avatar: avatarBg("Sabrina"), level: 85, region: "Saffron City" },
    rank: "S",
    wins: 201,
    pokemon: [
      { id: 150, name: "Mewtwo", sprite: sprite(150), type: "psychic" },
      { id: 65, name: "Alakazam", sprite: sprite(65), type: "psychic" },
      { id: 64, name: "Kadabra", sprite: sprite(64), type: "psychic" },
      { id: 103, name: "Exeggutor", sprite: sprite(103), type: "psychic" },
      { id: 96, name: "Drowzee", sprite: sprite(96), type: "psychic" },
      { id: 97, name: "Hypno", sprite: sprite(97), type: "psychic" },
    ],
  },
  {
    id: 5,
    teamName: "Night Shadows",
    owner: { name: "Agatha V.", avatar: avatarBg("Agatha"), level: 77, region: "Viridian City" },
    rank: "B",
    wins: 44,
    pokemon: [
      { id: 94, name: "Gengar", sprite: sprite(94), type: "ghost" },
      { id: 93, name: "Haunter", sprite: sprite(93), type: "ghost" },
      { id: 92, name: "Gastly", sprite: sprite(92), type: "ghost" },
      { id: 200, name: "Misdreavus", sprite: sprite(200), type: "ghost" },
      { id: 109, name: "Koffing", sprite: sprite(109), type: "poison" },
      { id: 110, name: "Weezing", sprite: sprite(110), type: "poison" },
    ],
  },
];

export const USER_CARDS: UserCardData[] = [
  {
    id: 1,
    name: "Misty W.",
    avatar: avatarBg("Misty"),
    title: "Water Trainer",
    level: 42,
    region: "Kanto",
    badges: 8,
    isFollowing: false,
  },
  {
    id: 2,
    name: "Gary O.",
    avatar: avatarBg("Gary"),
    title: "Legendary Rival",
    level: 71,
    region: "Pallet Town",
    badges: 10,
    isFollowing: true,
  },
  {
    id: 3,
    name: "Prof. Oak",
    avatar: avatarBg("Oak"),
    title: "Pokémon Researcher",
    level: 99,
    region: "Pallet Town",
    badges: 0,
    isFollowing: false,
  },
  {
    id: 4,
    name: "Sabrina M.",
    avatar: avatarBg("Sabrina"),
    title: "Psychic Gym Leader",
    level: 85,
    region: "Saffron City",
    badges: 10,
    isFollowing: false,
  },
  {
    id: 5,
    name: "Erika N.",
    avatar: avatarBg("Erika"),
    title: "Grass Gym Leader",
    level: 39,
    region: "Celadon City",
    badges: 6,
    isFollowing: true,
  },
  {
    id: 6,
    name: "Lt. Surge",
    avatar: avatarBg("Surge"),
    title: "Electric Lieutenant",
    level: 55,
    region: "Vermilion City",
    badges: 8,
    isFollowing: false,
  },
];

