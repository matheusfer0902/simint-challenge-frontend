"use client";

// ═══════════════════════════════════════════════════════════════════════════════
//  POKE CENTER ─ POKÉDEX GLOBAL
//  Arquivo único auto-contido para Next.js (App Router)
//  Componentes separados na ordem: types → data → atoms → cards → panel → page
// ═══════════════════════════════════════════════════════════════════════════════

import {
  useState, useMemo, useCallback, useEffect, useRef,
  type ReactNode, type ChangeEvent,
} from "react";
import {
  Search, X, ChevronDown, Grid3X3, List, Dna, BookOpen,
  Zap, Globe, CheckCircle2, TrendingUp, SlidersHorizontal,
  Microscope, Lock, HelpCircle, Ruler, Weight, Star,
  BarChart2, Shield,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

// ─────────────────────────────────────────────────────────────────────────────
// ① DATABASE TYPES  ─ espelham as tabelas do banco diretamente
// ─────────────────────────────────────────────────────────────────────────────

/** Tabela: pokemon_types */
export interface PokeType {
  id:   number;
  slug: string;   // "fire" | "water" | ...
  name: string;   // "Fogo"  | "Água"  | ...
}

/** Tabela: generations */
export interface Generation {
  id:     number;
  number: number;   // 1 | 2 | ...
  region: string;   // "Kanto" | ...
  label:  string;   // "Gen I" | ...
}

/** Tabela: pokemon_stats  (filho 1:1 de pokemon) */
export interface PokemonStats {
  hp:      number;
  attack:  number;
  defense: number;
  spAtk:   number;
  spDef:   number;
  speed:   number;
}

/**
 * Tabela: capture_records  (join N:M user ↔ pokemon)
 * No front-end mockamos direto no objeto.
 * Na integração real virá de:
 *   SELECT * FROM capture_records WHERE user_id = $userId AND pokemon_id = p.id
 */
export type CaptureStatus = "captured" | "unknown";

/** Tabela: pokemon  (com relações hidratadas) */
export interface Pokemon {
  id:            number;      // PK — número nacional da Pokédex
  slug:          string;
  name:          string;
  nameJa:        string;
  types:         PokeType[];  // M:N → pokemon_type_map
  generation:    Generation;  // FK → generations
  height:        number;      // metros
  weight:        number;      // kg
  category:      string;
  ability:       string;
  hiddenAbility: string;
  description:   string;      // entrada da Pokédex
  stats:         PokemonStats;
  captureRate:   number;      // 1-255
  baseExp:       number;
  sprite:        string;      // URL
  captureStatus: CaptureStatus;
}

// ─────────────────────────────────────────────────────────────────────────────
// ② DESIGN TOKENS POR TIPO
// ─────────────────────────────────────────────────────────────────────────────

interface TypeMeta {
  gradient: string;
  badge:    string;
  glow:     string;
  accent:   string;
  icon:     string;
}

const TYPE_META: Record<string, TypeMeta> = {
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
const getTM = (slug: string): TypeMeta => TYPE_META[slug] ?? TYPE_META.normal;

// ─────────────────────────────────────────────────────────────────────────────
// ③ MOCK DATABASE  (40 Pokémon — 26 capturados, 14 desconhecidos)
// ─────────────────────────────────────────────────────────────────────────────

const G: Generation[] = [
  { id:1, number:1, region:"Kanto",  label:"Gen I"   },
  { id:2, number:2, region:"Johto",  label:"Gen II"  },
  { id:3, number:3, region:"Hoenn",  label:"Gen III" },
  { id:4, number:4, region:"Sinnoh", label:"Gen IV"  },
];

const T = (id:number, slug:string, name:string): PokeType => ({ id, slug, name });
const TYPES = {
  grass:T(1,"grass","Planta"), poison:T(2,"poison","Veneno"), fire:T(3,"fire","Fogo"),
  flying:T(4,"flying","Voador"), water:T(5,"water","Água"), normal:T(7,"normal","Normal"),
  electric:T(8,"electric","Elétrico"), ground:T(9,"ground","Terra"), fairy:T(10,"fairy","Fada"),
  fighting:T(11,"fighting","Lutador"), psychic:T(12,"psychic","Psíquico"), rock:T(13,"rock","Pedra"),
  ice:T(14,"ice","Gelo"), ghost:T(15,"ghost","Fantasma"), dragon:T(16,"dragon","Dragão"),
  steel:T(17,"steel","Aço"), dark:T(18,"dark","Sombrio"), bug:T(6,"bug","Inseto"),
};

const sp = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const POKEDEX: Pokemon[] = [
  // ── GEN I ──────────────────────────────────────────────────────────────────
  { id:1,   slug:"bulbasaur",  name:"Bulbasaur",  nameJa:"フシギダネ", types:[TYPES.grass,TYPES.poison], generation:G[0], height:0.7,  weight:6.9,   category:"Seed Pokémon",        ability:"Overgrow",    hiddenAbility:"Chlorophyll",  description:"Uma semente foi plantada em suas costas ao nascer. A planta brota e cresce com o Pokémon.",          stats:{hp:45,attack:49,defense:49,spAtk:65,spDef:65,speed:45},  captureRate:45,  baseExp:64,  sprite:sp(1),   captureStatus:"captured" },
  { id:2,   slug:"ivysaur",   name:"Ivysaur",    nameJa:"フシギソウ", types:[TYPES.grass,TYPES.poison], generation:G[0], height:1.0,  weight:13.0,  category:"Seed Pokémon",        ability:"Overgrow",    hiddenAbility:"Chlorophyll",  description:"O botão nas costas cresce, tornando difícil ficar em pé nas patas traseiras.",                       stats:{hp:60,attack:62,defense:63,spAtk:80,spDef:80,speed:60},  captureRate:45,  baseExp:142, sprite:sp(2),   captureStatus:"unknown"  },
  { id:3,   slug:"venusaur",  name:"Venusaur",   nameJa:"フシギバナ", types:[TYPES.grass,TYPES.poison], generation:G[0], height:2.0,  weight:100.0, category:"Seed Pokémon",        ability:"Overgrow",    hiddenAbility:"Chlorophyll",  description:"A flor nas costas capta luz solar. O aroma acalma todos ao redor.",                                   stats:{hp:80,attack:82,defense:83,spAtk:100,spDef:100,speed:80},captureRate:45,  baseExp:263, sprite:sp(3),   captureStatus:"unknown"  },
  { id:4,   slug:"charmander",name:"Charmander", nameJa:"ヒトカゲ",  types:[TYPES.fire],               generation:G[0], height:0.6,  weight:8.5,   category:"Lizard Pokémon",      ability:"Blaze",       hiddenAbility:"Solar Power",   description:"A chama na ponta da cauda indica a saúde. Se fraca, o Pokémon está doente.",                          stats:{hp:39,attack:52,defense:43,spAtk:60,spDef:50,speed:65},  captureRate:45,  baseExp:62,  sprite:sp(4),   captureStatus:"captured" },
  { id:5,   slug:"charmeleon",name:"Charmeleon", nameJa:"リザード",  types:[TYPES.fire],               generation:G[0], height:1.1,  weight:19.0,  category:"Flame Pokémon",       ability:"Blaze",       hiddenAbility:"Solar Power",   description:"Bate com a cauda no chão após derrotar um inimigo, tentando se acalmar.",                             stats:{hp:58,attack:64,defense:58,spAtk:80,spDef:65,speed:80},  captureRate:45,  baseExp:142, sprite:sp(5),   captureStatus:"unknown"  },
  { id:6,   slug:"charizard", name:"Charizard",  nameJa:"リザードン",types:[TYPES.fire,TYPES.flying],   generation:G[0], height:1.7,  weight:90.5,  category:"Flame Pokémon",       ability:"Blaze",       hiddenAbility:"Solar Power",   description:"Cospe fogo capaz de derreter geleiras. Provoca incêndios sem intenção.",                               stats:{hp:78,attack:84,defense:78,spAtk:109,spDef:85,speed:100},captureRate:45,  baseExp:267, sprite:sp(6),   captureStatus:"captured" },
  { id:7,   slug:"squirtle",  name:"Squirtle",   nameJa:"ゼニガメ",  types:[TYPES.water],              generation:G[0], height:0.5,  weight:9.0,   category:"Tiny Turtle Pokémon", ability:"Torrent",     hiddenAbility:"Rain Dish",     description:"Ao se retrair em sua concha, dispara jatos de água com grande precisão.",                              stats:{hp:44,attack:48,defense:65,spAtk:50,spDef:64,speed:43},  captureRate:45,  baseExp:63,  sprite:sp(7),   captureStatus:"captured" },
  { id:9,   slug:"blastoise", name:"Blastoise",  nameJa:"カメックス",types:[TYPES.water],              generation:G[0], height:1.6,  weight:85.5,  category:"Shellfish Pokémon",   ability:"Torrent",     hiddenAbility:"Rain Dish",     description:"Os canhões em suas costas disparam balas de água com precisão a 50 metros.",                           stats:{hp:79,attack:83,defense:100,spAtk:85,spDef:105,speed:78},captureRate:45,  baseExp:265, sprite:sp(9),   captureStatus:"captured" },
  { id:25,  slug:"pikachu",   name:"Pikachu",    nameJa:"ピカチュウ",types:[TYPES.electric],           generation:G[0], height:0.4,  weight:6.0,   category:"Mouse Pokémon",       ability:"Static",      hiddenAbility:"Lightning Rod", description:"Quando vários Pikachu se reúnem, sua eletricidade pode provocar tempestades.",                        stats:{hp:35,attack:55,defense:30,spAtk:50,spDef:40,speed:90},  captureRate:190, baseExp:112, sprite:sp(25),  captureStatus:"captured" },
  { id:26,  slug:"raichu",    name:"Raichu",     nameJa:"ライチュウ",types:[TYPES.electric],           generation:G[0], height:0.8,  weight:30.0,  category:"Mouse Pokémon",       ability:"Static",      hiddenAbility:"Lightning Rod", description:"Acumular muita eletricidade o torna agressivo. A cauda serve como aterramento.",                      stats:{hp:60,attack:90,defense:55,spAtk:90,spDef:80,speed:110}, captureRate:75,  baseExp:218, sprite:sp(26),  captureStatus:"unknown"  },
  { id:39,  slug:"jigglypuff",name:"Jigglypuff", nameJa:"プリン",    types:[TYPES.normal,TYPES.fairy], generation:G[0], height:0.5,  weight:5.5,   category:"Balloon Pokémon",     ability:"Cute Charm",  hiddenAbility:"Friend Guard",  description:"Canta cada vez mais alto se os olhos dos oponentes começam a fechar.",                                stats:{hp:115,attack:45,defense:20,spAtk:45,spDef:25,speed:20}, captureRate:170, baseExp:95,  sprite:sp(39),  captureStatus:"captured" },
  { id:52,  slug:"meowth",    name:"Meowth",     nameJa:"ニャース",  types:[TYPES.normal],             generation:G[0], height:0.4,  weight:4.2,   category:"Scratch Cat Pokémon", ability:"Pickup",      hiddenAbility:"Unnerve",       description:"Tem queda por coisas redondas e brilhantes. Vaga à noite para encontrá-las.",                         stats:{hp:40,attack:45,defense:35,spAtk:40,spDef:40,speed:90},  captureRate:255, baseExp:69,  sprite:sp(52),  captureStatus:"captured" },
  { id:63,  slug:"abra",      name:"Abra",       nameJa:"ケーシィ",  types:[TYPES.psychic],            generation:G[0], height:0.9,  weight:19.5,  category:"Psi Pokémon",         ability:"Synchronize", hiddenAbility:"Magic Guard",   description:"Dorme 18 horas. Mesmo dormindo, teletransporta-se para escapar do perigo.",                           stats:{hp:25,attack:20,defense:15,spAtk:105,spDef:55,speed:90}, captureRate:200, baseExp:62,  sprite:sp(63),  captureStatus:"captured" },
  { id:65,  slug:"alakazam",  name:"Alakazam",   nameJa:"フーディン", types:[TYPES.psychic],           generation:G[0], height:1.5,  weight:48.0,  category:"Psi Pokémon",         ability:"Synchronize", hiddenAbility:"Magic Guard",   description:"Seu cérebro supera supercomputadores. Possui memória perfeita desde o nascimento.",                    stats:{hp:55,attack:50,defense:45,spAtk:135,spDef:95,speed:120},captureRate:50,  baseExp:270, sprite:sp(65),  captureStatus:"captured" },
  { id:94,  slug:"gengar",    name:"Gengar",     nameJa:"ゲンガー",  types:[TYPES.ghost,TYPES.poison], generation:G[0], height:1.5,  weight:40.5,  category:"Shadow Pokémon",      ability:"Cursed Body", hiddenAbility:"Cursed Body",   description:"Esconde-se nas sombras. Cria calafrios ao roubar a vitalidade do oponente.",                          stats:{hp:60,attack:65,defense:60,spAtk:130,spDef:75,speed:110},captureRate:45,  baseExp:270, sprite:sp(94),  captureStatus:"captured" },
  { id:130, slug:"gyarados",  name:"Gyarados",   nameJa:"ギャラドス",types:[TYPES.water,TYPES.flying], generation:G[0], height:6.5,  weight:235.0, category:"Atrocious Pokémon",   ability:"Intimidate",  hiddenAbility:"Moxie",         description:"Uma vez enfurecido, nada o detém. Registros mostram vilarejos inteiros destruídos.",                  stats:{hp:95,attack:125,defense:79,spAtk:60,spDef:100,speed:81},captureRate:45,  baseExp:189, sprite:sp(130), captureStatus:"captured" },
  { id:133, slug:"eevee",     name:"Eevee",      nameJa:"イーブイ",  types:[TYPES.normal],             generation:G[0], height:0.3,  weight:6.5,   category:"Evolution Pokémon",   ability:"Run Away",    hiddenAbility:"Adaptability",  description:"Estrutura genética instável permite múltiplas possibilidades evolutivas.",                             stats:{hp:55,attack:55,defense:50,spAtk:45,spDef:65,speed:55},  captureRate:45,  baseExp:65,  sprite:sp(133), captureStatus:"captured" },
  { id:143, slug:"snorlax",   name:"Snorlax",    nameJa:"カビゴン",  types:[TYPES.normal],             generation:G[0], height:2.1,  weight:460.0, category:"Sleeping Pokémon",    ability:"Immunity",    hiddenAbility:"Gluttony",      description:"Preocupa-se apenas em comer e dormir. Pode ingerir qualquer alimento, até mofado.",                   stats:{hp:160,attack:110,defense:65,spAtk:65,spDef:110,speed:30},captureRate:25, baseExp:189, sprite:sp(143), captureStatus:"captured" },
  { id:149, slug:"dragonite", name:"Dragonite",  nameJa:"カイリュー", types:[TYPES.dragon,TYPES.flying],generation:G[0], height:2.2,  weight:210.0, category:"Dragon Pokémon",      ability:"Inner Focus", hiddenAbility:"Multiscale",    description:"Carrega barcos encalhados. Criatura de grande bondade que conhece todos os mares.",                   stats:{hp:91,attack:134,defense:95,spAtk:100,spDef:100,speed:80},captureRate:45, baseExp:270, sprite:sp(149), captureStatus:"captured" },
  { id:150, slug:"mewtwo",    name:"Mewtwo",     nameJa:"ミュウツー", types:[TYPES.psychic],           generation:G[0], height:2.0,  weight:122.0, category:"Genetic Pokémon",     ability:"Pressure",    hiddenAbility:"Unnerve",       description:"Criado por engenharia genética a partir de Mew. Considerado o Pokémon mais agressivo.",              stats:{hp:106,attack:110,defense:90,spAtk:154,spDef:90,speed:130},captureRate:3, baseExp:340, sprite:sp(150), captureStatus:"unknown"  },
  { id:151, slug:"mew",       name:"Mew",        nameJa:"ミュウ",    types:[TYPES.psychic],            generation:G[0], height:0.4,  weight:4.0,   category:"New Species Pokémon", ability:"Synchronize", hiddenAbility:"Synchronize",   description:"Contém o DNA de todos os Pokémon. Visto apenas por pessoas de coração puro.",                         stats:{hp:100,attack:100,defense:100,spAtk:100,spDef:100,speed:100},captureRate:45,baseExp:270,sprite:sp(151), captureStatus:"unknown"  },
  // ── GEN II ────────────────────────────────────────────────────────────────
  { id:152, slug:"chikorita", name:"Chikorita",  nameJa:"チコリータ",types:[TYPES.grass],             generation:G[1], height:0.9,  weight:6.4,   category:"Leaf Pokémon",        ability:"Overgrow",    hiddenAbility:"Leaf Guard",    description:"Agita a folha na cabeça espalhando um aroma doce e calmante.",                                        stats:{hp:45,attack:49,defense:65,spAtk:49,spDef:65,speed:45},  captureRate:45,  baseExp:64,  sprite:sp(152), captureStatus:"captured" },
  { id:155, slug:"cyndaquil", name:"Cyndaquil",  nameJa:"ヒノアラシ",types:[TYPES.fire],              generation:G[1], height:0.5,  weight:7.9,   category:"Fire Mouse Pokémon",  ability:"Blaze",       hiddenAbility:"Flash Fire",    description:"É tímido. Quando em perigo, as chamas em suas costas se intensificam.",                               stats:{hp:39,attack:52,defense:43,spAtk:60,spDef:50,speed:65},  captureRate:45,  baseExp:62,  sprite:sp(155), captureStatus:"captured" },
  { id:158, slug:"totodile",  name:"Totodile",   nameJa:"ワニノコ",  types:[TYPES.water],             generation:G[1], height:0.6,  weight:9.5,   category:"Big Jaw Pokémon",     ability:"Torrent",     hiddenAbility:"Sheer Force",   description:"Mandíbulas poderosas esmagam qualquer coisa. Até seus treinadores devem ter cuidado.",                stats:{hp:50,attack:65,defense:64,spAtk:44,spDef:48,speed:43},  captureRate:45,  baseExp:63,  sprite:sp(158), captureStatus:"captured" },
  { id:175, slug:"togepi",    name:"Togepi",     nameJa:"トゲピー",  types:[TYPES.fairy],             generation:G[1], height:0.3,  weight:1.5,   category:"Spike Ball Pokémon",  ability:"Hustle",      hiddenAbility:"Serene Grace",  description:"A casca é repleta de alegria. Acredita-se que traz felicidade a quem o carrega.",                     stats:{hp:35,attack:20,defense:65,spAtk:40,spDef:65,speed:20},  captureRate:190, baseExp:74,  sprite:sp(175), captureStatus:"captured" },
  { id:197, slug:"umbreon",   name:"Umbreon",    nameJa:"ブラッキー", types:[TYPES.dark],             generation:G[1], height:1.0,  weight:27.0,  category:"Moonlight Pokémon",   ability:"Synchronize", hiddenAbility:"Inner Focus",   description:"Quando agitado, veneno escoa dos anéis. Corre silenciosamente pela escuridão.",                       stats:{hp:95,attack:65,defense:110,spAtk:60,spDef:130,speed:65},captureRate:45,  baseExp:184, sprite:sp(197), captureStatus:"captured" },
  { id:245, slug:"suicune",   name:"Suicune",    nameJa:"スイクン",  types:[TYPES.water],             generation:G[1], height:2.0,  weight:187.0, category:"Aurora Pokémon",      ability:"Pressure",    hiddenAbility:"Inner Focus",   description:"Percorre o mundo purificando água poluída. O vento norte sopra onde Suicune passa.",                  stats:{hp:100,attack:75,defense:115,spAtk:90,spDef:115,speed:85},captureRate:3,  baseExp:270, sprite:sp(245), captureStatus:"unknown"  },
  // ── GEN III ───────────────────────────────────────────────────────────────
  { id:252, slug:"treecko",   name:"Treecko",    nameJa:"キモリ",    types:[TYPES.grass],             generation:G[2], height:0.5,  weight:5.0,   category:"Wood Gecko Pokémon",  ability:"Overgrow",    hiddenAbility:"Unburden",      description:"Ganchos nas patas permitem escalar paredes verticais e tetos.",                                       stats:{hp:40,attack:45,defense:35,spAtk:65,spDef:55,speed:70},  captureRate:45,  baseExp:62,  sprite:sp(252), captureStatus:"captured" },
  { id:255, slug:"torchic",   name:"Torchic",    nameJa:"アチャモ",  types:[TYPES.fire],              generation:G[2], height:0.4,  weight:2.5,   category:"Chick Pokémon",       ability:"Blaze",       hiddenAbility:"Speed Boost",   description:"Bola de fogo interna produz calor de 1000°C. Golpeia com chutes flamejantes.",                        stats:{hp:45,attack:60,defense:40,spAtk:70,spDef:50,speed:45},  captureRate:45,  baseExp:62,  sprite:sp(255), captureStatus:"captured" },
  { id:258, slug:"mudkip",    name:"Mudkip",     nameJa:"ミズゴロウ",types:[TYPES.water],             generation:G[2], height:0.4,  weight:7.6,   category:"Mud Fish Pokémon",    ability:"Torrent",     hiddenAbility:"Damp",          description:"Barbatana na cabeça funciona como radar. Percebe flutuações na água ao redor.",                       stats:{hp:50,attack:70,defense:50,spAtk:50,spDef:50,speed:40},  captureRate:45,  baseExp:62,  sprite:sp(258), captureStatus:"captured" },
  { id:302, slug:"sableye",   name:"Sableye",    nameJa:"ヤミラミ",  types:[TYPES.dark,TYPES.ghost],  generation:G[2], height:0.5,  weight:11.0,  category:"Darkness Pokémon",    ability:"Keen Eye",    hiddenAbility:"Prankster",     description:"Vive em cavernas escuras. Usa garras para escavar pedras preciosas.",                                 stats:{hp:50,attack:75,defense:75,spAtk:65,spDef:65,speed:50},  captureRate:45,  baseExp:133, sprite:sp(302), captureStatus:"unknown"  },
  { id:350, slug:"milotic",   name:"Milotic",    nameJa:"ミロカロス",types:[TYPES.water],             generation:G[2], height:6.2,  weight:162.0, category:"Tender Pokémon",      ability:"Marvel Scale",hiddenAbility:"Competitive",   description:"Considerado o mais belo dos Pokémon. Acalma emoções turbulentas ao redor.",                           stats:{hp:95,attack:60,defense:79,spAtk:100,spDef:125,speed:81},captureRate:60,  baseExp:189, sprite:sp(350), captureStatus:"captured" },
  { id:384, slug:"rayquaza",  name:"Rayquaza",   nameJa:"レックウザ",types:[TYPES.dragon,TYPES.flying],generation:G[2], height:7.0, weight:206.5, category:"Sky High Pokémon",    ability:"Air Lock",    hiddenAbility:"Air Lock",      description:"Vive na camada de ozônio. Alimenta-se de meteoros. Existe há bilhões de anos.",                       stats:{hp:105,attack:150,defense:90,spAtk:150,spDef:90,speed:95},captureRate:45, baseExp:340, sprite:sp(384), captureStatus:"unknown"  },
  // ── GEN IV ────────────────────────────────────────────────────────────────
  { id:448, slug:"lucario",   name:"Lucario",    nameJa:"ルカリオ",  types:[TYPES.fighting,TYPES.steel],generation:G[3], height:1.2, weight:54.0, category:"Aura Pokémon",        ability:"Steadfast",   hiddenAbility:"Justified",     description:"Lê movimentos através de ondas de aura. Sente pensamentos de qualquer ser.",                          stats:{hp:70,attack:110,defense:70,spAtk:115,spDef:70,speed:90}, captureRate:45, baseExp:184, sprite:sp(448), captureStatus:"captured" },
  { id:487, slug:"giratina",  name:"Giratina",   nameJa:"ギラティナ",types:[TYPES.ghost,TYPES.dragon], generation:G[3], height:4.5, weight:750.0,category:"Renegade Pokémon",    ability:"Pressure",    hiddenAbility:"Telepathy",     description:"Banido por violência, vive em dimensão distorcida que reflete nosso mundo.",                          stats:{hp:150,attack:100,defense:120,spAtk:100,spDef:120,speed:90},captureRate:3,baseExp:340, sprite:sp(487), captureStatus:"unknown"  },
  { id:493, slug:"arceus",    name:"Arceus",     nameJa:"アルセウス",types:[TYPES.normal],            generation:G[3], height:3.2,  weight:320.0, category:"Alpha Pokémon",       ability:"Multitype",   hiddenAbility:"Multitype",     description:"Considera-se que moldou o universo com suas 1.000 mãos antes de adormecer.",                         stats:{hp:120,attack:120,defense:120,spAtk:120,spDef:120,speed:120},captureRate:3,baseExp:324,sprite:sp(493), captureStatus:"unknown"  },
];

const ALL_TYPES_LIST: PokeType[] = Object.values(TYPES);
const TOTAL  = POKEDEX.length;
const CAUGHT = POKEDEX.filter(p => p.captureStatus === "captured").length;
const STAT_KEYS = ["hp","attack","defense","spAtk","spDef","speed"] as const;
const STAT_LABEL: Record<string,string> = { hp:"HP", attack:"Ataque", defense:"Def", spAtk:"Sp.Atk", spDef:"Sp.Def", speed:"Vel" };
const MAX_STAT = 160;

// ─────────────────────────────────────────────────────────────────────────────
// ④ HOOKS
// ─────────────────────────────────────────────────────────────────────────────

function useDebounce<T>(val: T, ms = 260): T {
  const [dv, setDv] = useState(val);
  useEffect(() => { const t = setTimeout(() => setDv(val), ms); return () => clearTimeout(t); }, [val, ms]);
  return dv;
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑤ ATOMS
// ─────────────────────────────────────────────────────────────────────────────

/** Badge colorida por tipo */
function TypeBadge({ type }: { type: PokeType }) {
  const m = getTM(type.slug);
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[7px] font-bold uppercase tracking-wide ${m.badge}`}>
      <span className="text-[8px]">{m.icon}</span> {type.name}
    </span>
  );
}

/** SVG Pokeball decorativo */
function PokeballSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M50 5A45 45 0 0 1 95 50L50 50Z" fill="#fff" />
      <path d="M50 95A45 45 0 0 1 5 50L50 50Z" fill="#fff" />
      <rect x="5" y="47" width="90" height="6" fill="#000" />
      <circle cx="50" cy="50" r="14" fill="#000" />
      <circle cx="50" cy="50" r="10" fill="#fff" />
      <circle cx="50" cy="50" r="6"  fill="#000" />
      <circle cx="50" cy="50" r="3"  fill="#fff" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑥ POKEMON CARD  (Capturado ↔ Silhueta)
// ─────────────────────────────────────────────────────────────────────────────

interface CardProps {
  pokemon:  Pokemon;
  index:    number;
  onSelect: (p: Pokemon) => void;
}

export function PokemonCard({ pokemon, index, onSelect }: CardProps) {
  const [loaded, setLoaded] = useState(false);
  const captured = pokemon.captureStatus === "captured";
  const tm = getTM(pokemon.types[0].slug);

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-red-500"
      style={{ animation: `pokedexCardIn .4s ease-out ${Math.min(index * 40, 800)}ms both` }}
      onClick={() => captured && onSelect(pokemon)}
      tabIndex={captured ? 0 : -1}
      onKeyDown={e => { if (captured && (e.key==="Enter"||e.key===" ")) { e.preventDefault(); onSelect(pokemon); } }}
      aria-label={captured ? `${pokemon.name} — analisar` : "Pokémon desconhecido"}
    >
      {captured ? (
        /* ══════════════════ CAPTURED CARD (Vivid) ══════════════════ */
        <>
          {/* Type gradient header */}
          <div className={`relative overflow-hidden bg-gradient-to-br ${tm.gradient} p-4 pb-8`}>
            {/* Pokeball watermark */}
            <PokeballSVG className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 opacity-[0.12]" />

            {/* Number + Gen badge */}
            <div className="relative z-10 flex items-center justify-between mb-1">
              <span className="font-pixel text-[7px] text-white/70">#{String(pokemon.id).padStart(3,"0")}</span>
              <span className="rounded-full bg-white/20 px-1.5 py-0.5 font-pixel text-[6px] text-white/80 uppercase">{pokemon.generation.label}</span>
            </div>

            {/* Sprite */}
            <div className="relative flex h-24 items-center justify-center">
              <div
                className="pointer-events-none absolute inset-0 rounded-full blur-2xl opacity-30"
                style={{ background: `radial-gradient(circle, white 0%, transparent 70%)` }}
              />
              {!loaded && <div className="h-20 w-20 animate-pulse rounded-full bg-white/20" />}
              <img
                src={pokemon.sprite} alt={pokemon.name} loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`relative z-10 h-20 w-20 object-contain drop-shadow-lg transition-all duration-500 group-hover:scale-110 ${loaded ? "opacity-100" : "opacity-0 absolute"}`}
              />
            </div>
          </div>

          {/* Card body */}
          <div className="flex flex-1 flex-col bg-white p-3">
            <h3 className="font-pixel text-[9px] text-slate-800 truncate mb-2">{pokemon.name}</h3>
            <div className="flex flex-wrap gap-1 mb-3">
              {pokemon.types.map(t => <TypeBadge key={t.id} type={t} />)}
            </div>
            <button
              className={`mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${tm.gradient} py-2 font-pixel text-[7px] tracking-wider text-white shadow-sm transition hover:brightness-105 active:scale-[0.97]`}
              onClick={e => { e.stopPropagation(); onSelect(pokemon); }}
              tabIndex={-1}
            >
              <Microscope className="h-3 w-3" /> ANALISAR
            </button>
          </div>

          {/* Captured checkmark */}
          <div className="absolute left-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/90 shadow z-20">
            <span className="font-pixel text-[5px] text-white">✓</span>
          </div>

          {/* Hover type glow ring */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl ring-0 transition-all duration-200 group-hover:ring-2 group-hover:ring-offset-1"
            style={{ "--tw-ring-color": tm.accent } as React.CSSProperties}
          />
        </>
      ) : (
        /* ══════════════════ UNKNOWN CARD (Silhouette) ══════════════════ */
        <>
          <div className="relative flex flex-col items-center overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 p-4 pb-8">
            {/* Diagonal stripe texture — subliminal depth */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 1px,transparent 8px)" }}
            />
            {/* Header */}
            <div className="relative z-10 flex w-full items-center justify-between mb-1">
              <span className="font-pixel text-[7px] text-slate-600">#{String(pokemon.id).padStart(3,"0")}</span>
              <Lock className="h-2.5 w-2.5 text-slate-600" />
            </div>
            {/* Sprite silhouette */}
            <div className="relative flex h-24 items-center justify-center">
              {/* Mystery aura */}
              <div
                className="pointer-events-none absolute inset-0 blur-2xl opacity-[0.15]"
                style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
              />
              {!loaded && <div className="h-20 w-20 animate-pulse rounded-full bg-slate-700" />}

              {/**
               * ── SILHOUETTE CSS TECHNIQUE ──
               * brightness(0)   → todos os pixels não-transparentes → #000000 puro
               * saturate(0)     → garante zero color bleed (fallback para Safari)
               * invert(0.08)    → eleva de preto-carvão para cinza-escuro #141414
               *                   criando profundidade contra o fundo slate-900
               * O canal alpha é PRESERVADO: o contorno exato do Pokémon fica visível
               * sem revelar nenhum detalhe de cor ou forma interna.
               */}
              <img
                src={pokemon.sprite} alt="???" loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`relative z-10 h-20 w-20 object-contain transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0 absolute"}`}
                style={{
                  filter: "brightness(0) saturate(0) invert(0.08)",
                  WebkitFilter: "brightness(0) saturate(0) invert(0.08)",
                }}
              />
              {/* Pulsing ? overlay */}
              <HelpCircle className="absolute h-7 w-7 text-slate-600/40 animate-mystery" />
            </div>
          </div>

          <div className="flex flex-1 flex-col bg-slate-900 p-3">
            {/* Masked name */}
            <div className="mb-2 h-2.5 w-14 animate-pulse rounded-full bg-slate-700" />
            {/* Unknown types */}
            <div className="flex gap-1 mb-3">
              {pokemon.types.map((_,i) => (
                <span key={i} className="flex items-center gap-0.5 rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[7px] font-bold text-slate-500">
                  ❓ ???
                </span>
              ))}
            </div>
            <button disabled className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 py-2 font-pixel text-[7px] tracking-wider text-slate-600 cursor-not-allowed">
              <Lock className="h-2.5 w-2.5" /> NÃO CAPTURADO
            </button>
          </div>
        </>
      )}
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑦ POKEDEX GRID
// ─────────────────────────────────────────────────────────────────────────────

interface GridProps {
  pokemon:  Pokemon[];
  viewMode: "grid" | "list";
  onSelect: (p: Pokemon) => void;
}

function ListRow({ pokemon, idx, onSelect }: { pokemon:Pokemon; idx:number; onSelect:(p:Pokemon)=>void }) {
  const [loaded, setLoaded] = useState(false);
  const c = pokemon.captureStatus === "captured";
  const tm = getTM(pokemon.types[0].slug);
  const bst = (Object.values(pokemon.stats) as number[]).reduce((a,b) => a+b, 0);
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-3 transition-all duration-200 ${c?"border-slate-200/80 bg-white cursor-pointer hover:border-red-200 hover:-translate-y-0.5 hover:shadow-md":"border-slate-700/50 bg-slate-900/50 cursor-default"}`}
      style={{ animation:`pokedexCardIn .3s ease-out ${Math.min(idx*20,500)}ms both` }}
      onClick={() => c && onSelect(pokemon)}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c?`bg-gradient-to-br ${tm.gradient}`:""} ${!c?"bg-slate-800":""}`}>
        {!loaded && <div className="h-8 w-8 animate-pulse rounded-full bg-white/20"/>}
        <img src={pokemon.sprite} alt={c?pokemon.name:"???"} loading="lazy" onLoad={()=>setLoaded(true)}
          className={`h-10 w-10 object-contain transition-opacity duration-300 ${loaded?"opacity-100":"opacity-0 absolute"}`}
          style={!c ? {filter:"brightness(0) saturate(0) invert(0.08)",WebkitFilter:"brightness(0) saturate(0) invert(0.08)"} : undefined}
        />
      </div>
      <div className="min-w-[64px]">
        <p className={`font-pixel text-[7px] ${c?"text-slate-400":"text-slate-600"}`}>#{String(pokemon.id).padStart(3,"0")}</p>
        <p className={`font-semibold text-sm ${c?"text-slate-800":"text-slate-500"}`}>{c?pokemon.name:"???"}</p>
      </div>
      <div className="hidden sm:flex gap-1.5 flex-wrap">
        {c ? pokemon.types.map(t=><TypeBadge key={t.id} type={t}/>) : <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[7px] font-bold text-slate-500">???</span>}
      </div>
      <div className="hidden md:block text-[10px] text-slate-400">{c?pokemon.generation.label:"—"}</div>
      <div className="ml-auto hidden sm:flex items-center gap-2">
        {c ? (
          <>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full bg-gradient-to-r ${tm.gradient}`} style={{width:`${(bst/720)*100}%`}}/>
            </div>
            <span className="w-8 text-right font-pixel text-[8px] text-slate-500 tabular-nums">{bst}</span>
          </>
        ) : <span className="font-pixel text-[8px] text-slate-600">???</span>}
      </div>
      {c && (
        <button className={`ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tm.gradient} text-white shadow-sm transition hover:brightness-110`}
          onClick={e=>{e.stopPropagation();onSelect(pokemon);}}>
          <BookOpen className="h-3.5 w-3.5"/>
        </button>
      )}
    </div>
  );
}

export function PokedexGrid({ pokemon, viewMode, onSelect }: GridProps) {
  if (pokemon.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <Search className="h-9 w-9 text-slate-300" />
        </div>
        <p className="font-pixel text-[10px] uppercase tracking-widest text-slate-400">Nenhum Pokémon encontrado</p>
        <p className="mt-1.5 text-sm text-slate-400">Tente ajustar os filtros de pesquisa</p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {pokemon.map((p,i) => <ListRow key={p.id} pokemon={p} idx={i} onSelect={onSelect}/>)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {pokemon.map((p,i) => <PokemonCard key={p.id} pokemon={p} index={i} onSelect={onSelect}/>)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑧ RESEARCH PANEL  (slide-in side panel)
// ─────────────────────────────────────────────────────────────────────────────

// ── Stat bar ────────────────────────────────────────────────────────────────
function StatBar({ label, value, animate }: { label:string; value:number; animate:boolean }) {
  const pct = Math.min((value / MAX_STAT) * 100, 100);
  const color =
    value >= 120 ? "from-emerald-400 to-green-500" :
    value >= 90  ? "from-blue-400 to-blue-500"     :
    value >= 60  ? "from-amber-400 to-yellow-500"  :
    value >= 40  ? "from-orange-400 to-orange-500" :
                   "from-red-400 to-red-500";
  return (
    <div className="grid grid-cols-[52px_1fr_34px] items-center gap-3">
      <span className="text-right font-pixel text-[7px] uppercase tracking-wider text-slate-500">{label}</span>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100 shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} relative overflow-hidden transition-all ease-out`}
          style={{ width: animate ? `${pct}%` : "0%", transitionDuration: "0.9s" }}
        >
          <div className="absolute inset-0 animate-statShimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>
      <span className="font-pixel text-[9px] text-slate-700 tabular-nums">{value}</span>
    </div>
  );
}

// ── SVG Radar Chart ──────────────────────────────────────────────────────────
function RadarChart({ stats, accent }: { stats: PokemonStats; accent: string }) {
  const vals = [stats.hp, stats.attack, stats.defense, stats.spAtk, stats.spDef, stats.speed];
  const labels = ["HP","ATK","DEF","SpA","SpD","SPD"];
  const N=6, cx=110, cy=110, r=78;
  const a = (i:number) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const grid = (s:number) => Array.from({length:N},(_,i)=>`${cx+r*s*Math.cos(a(i))},${cy+r*s*Math.sin(a(i))}`).join(" ");
  const poly = vals.map((v,i)=>{ const s=Math.min(v/MAX_STAT,1); return `${cx+r*s*Math.cos(a(i))},${cy+r*s*Math.sin(a(i))}`; }).join(" ");
  return (
    <svg viewBox="0 0 220 220" className="mx-auto h-44 w-44" role="img" aria-label="Gráfico radar de atributos">
      {[.25,.5,.75,1].map(s=><polygon key={s} points={grid(s)} fill="none" stroke="#e2e8f0" strokeWidth="1"/>)}
      {Array.from({length:N},(_,i)=><line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(a(i))} y2={cy+r*Math.sin(a(i))} stroke="#e2e8f0" strokeWidth="1"/>)}
      <polygon points={poly} fill={accent+"33"} stroke={accent} strokeWidth="2.5" strokeLinejoin="round"/>
      {vals.map((v,i)=>{ const s=Math.min(v/MAX_STAT,1); return <circle key={i} cx={cx+r*s*Math.cos(a(i))} cy={cy+r*s*Math.sin(a(i))} r="4.5" fill="white" stroke={accent} strokeWidth="2"/>; })}
      {labels.map((l,i)=>(
        <text key={l} x={cx+(r+17)*Math.cos(a(i))} y={cy+(r+17)*Math.sin(a(i))} textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="700" fill="#64748b" fontFamily="monospace">{l}</text>
      ))}
    </svg>
  );
}

// ── Section label ────────────────────────────────────────────────────────────
function Section({ icon, title, children }: { icon:ReactNode; title:string; children:ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <div className="text-slate-400">{icon}</div>
        <h3 className="font-pixel text-[7px] uppercase tracking-widest text-slate-500">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }: { icon:ReactNode; label:string; value:string }) {
  return (
    <div className="mb-2 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-2.5">
      <div className="flex items-center gap-2 text-slate-400">{icon}<span className="font-pixel text-[7px] uppercase tracking-widest">{label}</span></div>
      <span className="text-sm font-semibold text-slate-700">{value}</span>
    </div>
  );
}

// ── Root panel ───────────────────────────────────────────────────────────────
type PanelTab = "overview" | "stats" | "research";

interface PanelProps {
  pokemon: Pokemon | null;
  isOpen:  boolean;
  onClose: () => void;
}

export function ResearchPanel({ pokemon, isOpen, onClose }: PanelProps) {
  const [tab,       setTab]       = useState<PanelTab>("overview");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [animate,   setAnimate]   = useState(false);

  useEffect(() => {
    if (pokemon) { setTab("overview"); setImgLoaded(false); setAnimate(false); }
  }, [pokemon?.id]);

  useEffect(() => {
    if (tab === "stats" && isOpen) {
      const t = setTimeout(() => setAnimate(true), 220);
      return () => clearTimeout(t);
    }
  }, [tab, isOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  if (!pokemon) return null;

  const tm  = getTM(pokemon.types[0].slug);
  const bst = (Object.values(pokemon.stats) as number[]).reduce((a,b) => a+b, 0);

  const TABS: { id:PanelTab; icon:ReactNode; label:string }[] = [
    { id:"overview", icon:<Globe className="h-3.5 w-3.5"/>,    label:"Visão Geral" },
    { id:"stats",    icon:<BarChart2 className="h-3.5 w-3.5"/>, label:"Atributos"  },
    { id:"research", icon:<BookOpen className="h-3.5 w-3.5"/>,  label:"Pesquisa"   },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog" aria-modal="true" aria-label={`Painel de pesquisa — ${pokemon.name}`}
      >

        {/* ── Hero header ───────────────────────────────────── */}
        <div className={`relative flex-shrink-0 overflow-hidden bg-gradient-to-br ${tm.gradient} pb-9 pt-5`}>
          <PokeballSVG className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 opacity-[0.08]" />

          <div className="flex items-center justify-between px-6 mb-4">
            <span className="rounded-full bg-white/20 px-3 py-0.5 font-pixel text-[7px] uppercase tracking-widest text-white/80">
              #{String(pokemon.id).padStart(3,"0")} · {pokemon.generation.label}
            </span>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              aria-label="Fechar painel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Sprite */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 rounded-full blur-2xl opacity-20" style={{background:"radial-gradient(circle,white,transparent 70%)"}} />
              {!imgLoaded && <div className="h-36 w-36 animate-pulse rounded-full bg-white/20" />}
              <img src={pokemon.sprite} alt={pokemon.name} onLoad={() => setImgLoaded(true)}
                className={`relative z-10 h-36 w-36 object-contain drop-shadow-2xl transition-all duration-500 hover:scale-105 ${imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90 absolute"}`}
              />
            </div>
          </div>

          {/* Name */}
          <div className="mt-3 px-6 text-center">
            <p className="font-pixel text-[8px] tracking-widest text-white/60">{pokemon.nameJa}</p>
            <h2 className="font-pixel text-xl text-white drop-shadow mt-1">{pokemon.name.toUpperCase()}</h2>
            <p className="mt-0.5 text-xs text-white/70">{pokemon.category}</p>
            <div className="mt-2.5 flex justify-center gap-2 flex-wrap">
              {pokemon.types.map(t => {
                const m = getTM(t.slug);
                return (
                  <span key={t.id} className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[8px] font-bold uppercase tracking-wide ${m.badge}`}>
                    {m.icon} {t.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────── */}
        <div className="flex shrink-0 border-b border-slate-100">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 py-3.5 font-pixel text-[7px] uppercase tracking-wider transition-all ${tab===t.id ? "border-b-2 border-red-500 text-red-500" : "text-slate-400 hover:text-slate-600"}`}>
              {t.icon} <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Scrollable content ────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="space-y-4 p-5">
              {/* Quick strip */}
              <div className={`flex items-center justify-around rounded-2xl bg-gradient-to-r ${tm.gradient} p-4 text-white`}>
                {[["BST", bst], ["Geração", pokemon.generation.label], ["Região", pokemon.generation.region]].map(([k,v]) => (
                  <div key={k as string} className="flex flex-col items-center gap-0.5">
                    <span className="font-pixel text-[7px] uppercase tracking-wider text-white/70">{k}</span>
                    <span className="font-pixel text-base leading-none text-white">{v}</span>
                  </div>
                ))}
              </div>
              {/* Physical data */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                <Section title="Dados Físicos" icon={<Ruler className="h-3.5 w-3.5"/>}>
                  <InfoRow icon={<Ruler  className="h-3.5 w-3.5"/>} label="Altura"    value={`${pokemon.height} m`} />
                  <InfoRow icon={<Weight className="h-3.5 w-3.5"/>} label="Peso"      value={`${pokemon.weight} kg`} />
                  <InfoRow icon={<Star   className="h-3.5 w-3.5"/>} label="Categoria" value={pokemon.category} />
                </Section>
              </div>
              {/* Abilities */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                <Section title="Habilidades" icon={<Zap className="h-3.5 w-3.5"/>}>
                  <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div>
                      <p className="font-pixel text-[7px] uppercase tracking-widest text-slate-400 mb-0.5">Primária</p>
                      <p className="font-semibold text-sm text-slate-700">{pokemon.ability}</p>
                    </div>
                    <div className="h-px bg-slate-200"/>
                    <div>
                      <p className="font-pixel text-[7px] uppercase tracking-widest text-slate-400 mb-0.5">Oculta</p>
                      <p className="font-semibold text-sm text-slate-500">{pokemon.hiddenAbility}</p>
                    </div>
                  </div>
                </Section>
              </div>
              {/* Capture data */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                <Section title="Dados de Captura" icon={<Shield className="h-3.5 w-3.5"/>}>
                  <InfoRow icon={<Shield className="h-3.5 w-3.5"/>} label="Taxa de Captura" value={`${pokemon.captureRate} / 255`} />
                  <InfoRow icon={<Star   className="h-3.5 w-3.5"/>} label="Exp. Base"       value={String(pokemon.baseExp)} />
                </Section>
              </div>
            </div>
          )}

          {/* STATS */}
          {tab === "stats" && (
            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <Section title="Gráfico Radar" icon={<BarChart2 className="h-3.5 w-3.5"/>}>
                  <RadarChart stats={pokemon.stats} accent={tm.accent} />
                </Section>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <Section title="Barras de Base" icon={<TrendingUp className="h-3.5 w-3.5"/>}>
                  <div className="space-y-3 mt-1">
                    {STAT_KEYS.map(k => (
                      <StatBar key={k} label={STAT_LABEL[k]} value={pokemon.stats[k]} animate={animate} />
                    ))}
                  </div>
                  <div className={`mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r ${tm.gradient} px-4 py-2.5 text-white`}>
                    <span className="font-pixel text-[8px] uppercase tracking-widest text-white/80">Total BST</span>
                    <span className="font-pixel text-base">{bst}</span>
                  </div>
                </Section>
              </div>
            </div>
          )}

          {/* RESEARCH */}
          {tab === "research" && (
            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <Section title="Entrada Pokédex" icon={<BookOpen className="h-3.5 w-3.5"/>}>
                  <blockquote className="mt-2 border-l-4 pl-4 text-sm leading-relaxed text-slate-600" style={{ borderColor: tm.accent }}>
                    {pokemon.description}
                  </blockquote>
                </Section>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <Section title="Dados Taxonômicos" icon={<Dna className="h-3.5 w-3.5"/>}>
                  <div className="mt-2 space-y-2.5">
                    {[
                      ["Nº Nacional",  `#${String(pokemon.id).padStart(3,"0")}`],
                      ["Geração",      `${pokemon.generation.label} — ${pokemon.generation.region}`],
                      ["Nome japonês", pokemon.nameJa],
                      ["Tipos",        pokemon.types.map(t=>t.name).join(" / ")],
                      ["Habilidade",   pokemon.ability],
                      ["Hab. Oculta",  pokemon.hiddenAbility],
                    ].map(([l,v]) => (
                      <div key={l} className="flex items-start justify-between gap-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 shrink-0">{l}</span>
                        <span className="text-right text-xs text-slate-700">{v}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <Section title="Análise de Tipos" icon={<Shield className="h-3.5 w-3.5"/>}>
                  <div className="mt-2 flex gap-2">
                    {pokemon.types.map(t => {
                      const m = getTM(t.slug);
                      return (
                        <div key={t.id} className={`flex-1 rounded-xl bg-gradient-to-br ${m.gradient} p-3 text-center shadow-sm`}>
                          <p className="text-2xl mb-1">{m.icon}</p>
                          <p className="font-pixel text-[8px] text-white/90 uppercase tracking-wider">{t.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 px-5 py-3.5">
          <div className="flex items-center justify-between text-[9px] text-slate-400">
            <span className="font-pixel tracking-wider">RESEARCH LAB · POKE CENTER</span>
            <div className="flex items-center gap-1.5">
              <span>Fechar</span>
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[8px]">ESC</kbd>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑨ PROGRESS BAR (IntersectionObserver animated fill)
// ─────────────────────────────────────────────────────────────────────────────

function ProgressBar({ caught, total }: { caught:number; total:number }) {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold:.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const pct = (caught / total) * 100;
  return (
    <div ref={ref} className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 shrink-0 text-[9px]">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400"/>
        <span className="font-pixel text-[7px] uppercase tracking-widest text-white/60">Capturados</span>
        <span className="font-pixel text-[9px] font-bold text-white">{caught}</span>
        <span className="text-white/30">/</span>
        <span className="font-pixel text-[9px] text-white/50">{total}</span>
      </div>
      <div className="relative h-2.5 w-28 overflow-hidden rounded-full bg-white/10 shadow-inner shrink-0">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all ease-out duration-[1.2s] relative"
          style={{ width: vis ? `${pct}%` : "0%" }}
        >
          <div className="absolute inset-0 animate-progressShimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"/>
        </div>
      </div>
      <span className="font-pixel text-[8px] text-emerald-400 shrink-0">{Math.round(pct)}%</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑩ FILTER SELECT
// ─────────────────────────────────────────────────────────────────────────────

function FilterSelect({ value, onChange, icon, children }: {
  value:string; onChange:(v:string)=>void; icon:ReactNode; children:ReactNode;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
      <select value={value} onChange={(e:ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-7 text-xs font-semibold text-slate-600 outline-none transition focus:border-red-300 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑪ ROOT PAGE
// ─────────────────────────────────────────────────────────────────────────────

type SortOpt = "id" | "name" | "bst" | "captureRate";
type ViewMode = "grid" | "list";

interface Filters {
  search: string;
  type:   string;
  gen:    number | null;
  status: CaptureStatus | "all";
  sort:   SortOpt;
}

const INIT: Filters = { search:"", type:"", gen:null, status:"all", sort:"id" };

export function PokedexPage() {
  const [filters,     setFilters]     = useState<Filters>(INIT);
  const [view,        setView]        = useState<ViewMode>("grid");
  const [selected,    setSelected]    = useState<Pokemon | null>(null);
  const [panelOpen,   setPanelOpen]   = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debSearch = useDebounce(filters.search);

  // Lock body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = panelOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [panelOpen]);

  const setF = useCallback(<K extends keyof Filters>(k:K, v:Filters[K]) => {
    setFilters(p => ({ ...p, [k]: v }));
  }, []);

  const onSelect   = useCallback((p: Pokemon) => { setSelected(p); setPanelOpen(true); }, []);
  const onClose    = useCallback(() => { setPanelOpen(false); setTimeout(() => setSelected(null), 420); }, []);
  const clearFilts = useCallback(() => setFilters(INIT), []);

  const activeCount = [
    filters.type !== "",
    filters.gen !== null,
    filters.status !== "all",
    filters.sort !== "id",
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    return POKEDEX
      .filter(p => {
        const q = debSearch.toLowerCase();
        if (q && !p.name.toLowerCase().includes(q) && !String(p.id).includes(q)) return false;
        if (filters.type && !p.types.some(t => t.slug === filters.type)) return false;
        if (filters.gen  && p.generation.number !== filters.gen) return false;
        if (filters.status !== "all" && p.captureStatus !== filters.status) return false;
        return true;
      })
      .sort((a,b) => {
        if (filters.sort === "name") return a.name.localeCompare(b.name);
        if (filters.sort === "bst")  return ((Object.values(b.stats) as number[]).reduce((x,y)=>x+y)) - ((Object.values(a.stats) as number[]).reduce((x,y)=>x+y));
        if (filters.sort === "captureRate") return b.captureRate - a.captureRate;
        return a.id - b.id;
      });
  }, [debSearch, filters.type, filters.gen, filters.status, filters.sort]);

  const capturedInView = filtered.filter(p => p.captureStatus === "captured").length;

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-50">

        {/* ═════════════════════ HERO HEADER ══════════════════════ */}
      <header className="relative overflow-hidden border-b border-slate-200/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Ambient colour mesh */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 18% 60%,rgba(239,68,68,0.18) 0%,transparent 50%), radial-gradient(circle at 82% 40%,rgba(59,130,246,0.12) 0%,transparent 50%)",
        }} />
        {/* Subtle grid lines */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "repeating-linear-gradient(60deg,transparent,transparent 28px,rgba(255,255,255,1) 28px,rgba(255,255,255,1) 29px)",
        }} />
        {/* Giant pokeball watermark */}
        <PokeballSVG className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 opacity-[0.05]" />

        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-0.5 font-pixel text-[7px] uppercase tracking-widest text-red-400">
                  Laboratório do Pesquisador
                </span>
              </div>
              <h1 className="font-pixel text-3xl leading-tight text-white sm:text-4xl">POKÉDEX GLOBAL</h1>
              <p className="mt-1.5 text-sm text-slate-400">Arquivo de Pesquisa — Banco de Dados Nacional</p>
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon:<Dna className="h-3.5 w-3.5"/>,         label:"Total",     value:String(TOTAL),  color:"bg-blue-500"    },
                { icon:<CheckCircle2 className="h-3.5 w-3.5"/>, label:"Capturados",value:String(CAUGHT), color:"bg-emerald-500" },
                { icon:<Globe className="h-3.5 w-3.5"/>,        label:"Gerações",  value:"IV",           color:"bg-violet-500"  },
              ].map(({ icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${color} text-white`}>{icon}</div>
                  <div>
                    <p className="font-pixel text-[6px] uppercase tracking-widest text-white/50">{label}</p>
                    <p className="font-pixel text-[10px] text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <ProgressBar caught={CAUGHT} total={TOTAL} />
          </div>
        </div>
      </header>

      {/* ═════════════════════ STICKY TOOLBAR ══════════════════ */}
      <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={filters.search} onChange={e => setF("search", e.target.value)}
                placeholder="Nome ou número da Pokédex..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm text-slate-700 outline-none transition focus:border-red-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
              />
              {filters.search && (
                <button onClick={() => setF("search","")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setFiltersOpen(v => !v)}
              className={`flex sm:hidden items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${filtersOpen || activeCount > 0 ? "border-red-300 bg-red-50 text-red-600" : "border-slate-200 bg-white text-slate-600"}`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5"/>
              Filtros
              {activeCount > 0 && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 font-pixel text-[6px] text-white">{activeCount}</span>}
            </button>

            {/* Filters row */}
            <div className={`flex flex-wrap items-center gap-2 ${filtersOpen ? "flex" : "hidden sm:flex"}`}>
              <FilterSelect value={filters.type} onChange={v => setF("type", v)} icon={<Zap className="h-3.5 w-3.5"/>}>
                <option value="">Todos Tipos</option>
                {ALL_TYPES_LIST.map(t => <option key={t.id} value={t.slug}>{t.name}</option>)}
              </FilterSelect>

              <FilterSelect value={filters.gen === null ? "" : String(filters.gen)} onChange={v => setF("gen", v === "" ? null : Number(v))} icon={<Globe className="h-3.5 w-3.5"/>}>
                <option value="">Todas Gens</option>
                {G.map(g => <option key={g.id} value={String(g.number)}>{g.label} — {g.region}</option>)}
              </FilterSelect>

              <FilterSelect value={filters.status} onChange={v => setF("status", v as typeof filters.status)} icon={<CheckCircle2 className="h-3.5 w-3.5"/>}>
                <option value="all">Todos</option>
                <option value="captured">Capturados</option>
                <option value="unknown">Desconhecidos</option>
              </FilterSelect>

              <FilterSelect value={filters.sort} onChange={v => setF("sort", v as SortOpt)} icon={<TrendingUp className="h-3.5 w-3.5"/>}>
                <option value="id">Nº Pokédex</option>
                <option value="name">Nome A–Z</option>
                <option value="bst">BST Total</option>
                <option value="captureRate">Taxa Captura</option>
              </FilterSelect>

              {activeCount > 0 && (
                <button onClick={clearFilts} className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100">
                  <X className="h-3.5 w-3.5"/> Limpar ({activeCount})
                </button>
              )}
            </div>

            {/* View toggle */}
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden xl:block text-xs text-slate-400">
                <span className="font-semibold text-slate-600">{filtered.length}</span> / {TOTAL}
              </span>
              <div className="flex overflow-hidden rounded-xl border border-slate-200">
                {(["grid","list"] as ViewMode[]).map((m, i) => (
                  <button key={m} onClick={() => setView(m)}
                    className={`flex h-9 w-9 items-center justify-center transition ${view === m ? "bg-red-500 text-white" : "bg-white text-slate-400 hover:bg-slate-50"} ${i > 0 ? "border-l border-slate-200" : ""}`}
                    aria-label={m === "grid" ? "Visualização em grade" : "Visualização em lista"}
                  >
                    {m === "grid" ? <Grid3X3 className="h-4 w-4"/> : <List className="h-4 w-4"/>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═════════════════════ GRID AREA ═══════════════════════ */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Context bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span><span className="font-semibold text-slate-700">{filtered.length}</span> Pokémon</span>
            {capturedInView > 0 && (
              <><span className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400"/>{capturedInView} capturados</span></>
            )}
            {(filtered.length - capturedInView) > 0 && (
              <><span className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-700"/>{filtered.length - capturedInView} desconhecidos</span></>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-gradient-to-br from-red-400 to-rose-500"/>
              Capturado — clique para analisar
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-slate-700"/>
              Desconhecido — capture para revelar
            </span>
          </div>
        </div>

        <PokedexGrid pokemon={filtered} viewMode={view} onSelect={onSelect} />
      </main>

      {/* ═════════════════════ RESEARCH PANEL ══════════════════ */}
      <ResearchPanel pokemon={selected} isOpen={panelOpen} onClose={onClose} />

      {/* ═════════════════════ KEYFRAMES ════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-pixel { font-family: 'Press Start 2P', 'Courier New', monospace; }

        @keyframes pokedexCardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        @keyframes mystery {
          0%,100% { opacity: 0.25; transform: scale(1);    }
          50%     { opacity: 0.55; transform: scale(1.1);  }
        }
        .animate-mystery { animation: mystery 2.6s ease-in-out infinite; }

        @keyframes statShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%);  }
        }
        .animate-statShimmer { animation: statShimmer 2s ease-in-out infinite; }

        @keyframes progressShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%);  }
        }
        .animate-progressShimmer { animation: progressShimmer 2.2s ease-in-out infinite; }
      `}</style>
      </div>
    </AppLayout>
  );
}
