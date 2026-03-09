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
  X, ChevronDown, Grid3X3, List, Dna, BookOpen,
  Zap, Globe, CheckCircle2, TrendingUp, SlidersHorizontal,
  Microscope, Lock, HelpCircle, BarChart2, Shield,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { pokemonService, type PokemonDetailDto } from "@/lib/api/pokemon.service";
import { usePaginationParams } from "@/lib/pagination";
import { createPaginationMeta } from "@/lib/pagination";
import { PaginationControls } from "@/components/ui/PaginationControls";

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

/** Mapa slug → nome do tipo (exibição) */
const TYPE_SLUG_TO_NAME: Record<string, string> = {
  fire:"Fogo", water:"Água", grass:"Planta", electric:"Elétrico", psychic:"Psíquico", ghost:"Fantasma",
  dragon:"Dragão", dark:"Sombrio", steel:"Aço", ice:"Gelo", normal:"Normal", fighting:"Lutador",
  poison:"Veneno", ground:"Terra", flying:"Voador", rock:"Pedra", bug:"Inseto", fairy:"Fada",
};
/** Opções para filtro de tipo */
const TYPE_FILTER_OPTIONS = Object.entries(TYPE_SLUG_TO_NAME).map(([slug, name]) => ({ slug, name }));

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

/** Badge colorida por tipo (slug da API) */
function TypeBadge({ slug }: { slug: string }) {
  const m = getTM(slug);
  const name = TYPE_SLUG_TO_NAME[slug] ?? slug;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[7px] font-bold uppercase tracking-wide ${m.badge}`}>
      <span className="text-[8px]">{m.icon}</span> {name}
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
  pokemon:   PokemonDetailDto;
  index:     number;
  captured:  boolean;
  onSelect:  (id: number) => void;
}

export function PokemonCard({ pokemon, index, captured, onSelect }: CardProps) {
  const [loaded, setLoaded] = useState(false);
  const primaryType = pokemon.types[0] ?? "normal";
  const tm = getTM(primaryType);
  const displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 focus-visible:outline-2 focus-visible:outline-red-500 ${
        captured
          ? "border-slate-200/80 cursor-pointer hover:border-red-200 hover:-translate-y-0.5 hover:shadow-md"
          : "border-slate-700/50 cursor-default"
      }`}
      style={{ animation: `pokedexCardIn .4s ease-out ${Math.min(index * 40, 800)}ms both` }}
      onClick={() => captured && onSelect(pokemon.id)}
      tabIndex={captured ? 0 : -1}
      onKeyDown={e => { if (captured && (e.key==="Enter"||e.key===" ")) { e.preventDefault(); onSelect(pokemon.id); } }}
      aria-label={captured ? `${displayName} — analisar` : "Pokémon não capturado"}
    >
      {captured ? (
        <>
          <div className={`relative overflow-hidden bg-gradient-to-br ${tm.gradient} p-4 pb-8`}>
            <PokeballSVG className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 opacity-[0.12]" />
            <div className="relative z-10 flex items-center justify-between mb-1">
              <span className="font-pixel text-[7px] text-white/70">#{String(pokemon.id).padStart(4,"0")}</span>
              {pokemon.region && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 font-pixel text-[6px] text-white/80 uppercase">{pokemon.region}</span>
              )}
            </div>
            <div className="relative flex h-24 items-center justify-center">
              <div className="pointer-events-none absolute inset-0 rounded-full blur-2xl opacity-30" style={{ background: `radial-gradient(circle, white 0%, transparent 70%)` }} />
              {!loaded && <div className="h-20 w-20 animate-pulse rounded-full bg-white/20" />}
              <img
                src={pokemon.spriteUrl} alt={displayName} loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`relative z-10 h-20 w-20 object-contain drop-shadow-lg transition-all duration-500 group-hover:scale-110 ${loaded ? "opacity-100" : "opacity-0 absolute"}`}
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col bg-white p-3">
            <h3 className="font-pixel text-[9px] text-slate-800 truncate mb-2">{displayName}</h3>
            <div className="flex flex-wrap gap-1 mb-3">
              {pokemon.types.map(slug => <TypeBadge key={slug} slug={slug} />)}
            </div>
            <button
              className={`mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${tm.gradient} py-2 font-pixel text-[7px] tracking-wider text-white shadow-sm transition hover:brightness-105 active:scale-[0.97]`}
              onClick={e => { e.stopPropagation(); onSelect(pokemon.id); }}
              tabIndex={-1}
            >
              <Microscope className="h-3 w-3" /> ANALISAR
            </button>
          </div>
          <div className="absolute left-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/90 shadow z-20">
            <span className="font-pixel text-[5px] text-white">✓</span>
          </div>
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl ring-0 transition-all duration-200 group-hover:ring-2 group-hover:ring-offset-1"
            style={{ "--tw-ring-color": tm.accent } as React.CSSProperties}
          />
        </>
      ) : (
        <>
          <div className="relative flex flex-col items-center overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 p-4 pb-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 1px,transparent 8px)" }}
            />
            <div className="relative z-10 flex w-full items-center justify-between mb-1">
              <span className="font-pixel text-[7px] text-slate-600">#{String(pokemon.id).padStart(4,"0")}</span>
              <Lock className="h-2.5 w-2.5 text-slate-600" />
            </div>
            <div className="relative flex h-24 items-center justify-center">
              <div className="pointer-events-none absolute inset-0 blur-2xl opacity-[0.15]" style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
              {!loaded && <div className="h-20 w-20 animate-pulse rounded-full bg-slate-700" />}
              <img
                src={pokemon.spriteUrl} alt="???" loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`relative z-10 h-20 w-20 object-contain transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0 absolute"}`}
                style={{
                  filter: "brightness(0) saturate(0) invert(0.08)",
                  WebkitFilter: "brightness(0) saturate(0) invert(0.08)",
                }}
              />
              <HelpCircle className="absolute h-7 w-7 text-slate-600/40 animate-mystery" />
            </div>
          </div>
          <div className="flex flex-1 flex-col bg-slate-900 p-3">
            <div className="mb-2 h-2.5 w-14 animate-pulse rounded-full bg-slate-700" />
            <div className="flex gap-1 mb-3">
              {pokemon.types.map((_, i) => (
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
  pokemon:     PokemonDetailDto[];
  capturedIds: number[];
  viewMode:    "grid" | "list";
  onSelect:   (id: number) => void;
}

function ListRow({ pokemon, idx, captured, onSelect }: { pokemon: PokemonDetailDto; idx: number; captured: boolean; onSelect: (id: number) => void }) {
  const [loaded, setLoaded] = useState(false);
  const primaryType = pokemon.types[0] ?? "normal";
  const tm = getTM(primaryType);
  const displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-3 transition-all duration-200 ${
        captured
          ? "border-slate-200/80 bg-white cursor-pointer hover:border-red-200 hover:-translate-y-0.5 hover:shadow-md"
          : "border-slate-700/50 bg-slate-900/50 cursor-default"
      }`}
      style={{ animation:`pokedexCardIn .3s ease-out ${Math.min(idx*20,500)}ms both` }}
      onClick={() => captured && onSelect(pokemon.id)}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${captured ? `bg-gradient-to-br ${tm.gradient}` : "bg-slate-800"}`}>
        {!loaded && <div className="h-8 w-8 animate-pulse rounded-full bg-white/20"/>}
        <img
          src={pokemon.spriteUrl}
          alt={captured ? displayName : "???"}
          loading="lazy"
          onLoad={()=>setLoaded(true)}
          className={`h-10 w-10 object-contain transition-opacity duration-300 ${loaded?"opacity-100":"opacity-0 absolute"}`}
          style={!captured ? { filter: "brightness(0) saturate(0) invert(0.08)", WebkitFilter: "brightness(0) saturate(0) invert(0.08)" } : undefined}
        />
      </div>
      <div className="min-w-[64px]">
        <p className={`font-pixel text-[7px] ${captured ? "text-slate-400" : "text-slate-600"}`}>#{String(pokemon.id).padStart(4,"0")}</p>
        <p className={`font-semibold text-sm ${captured ? "text-slate-800" : "text-slate-500"}`}>{captured ? displayName : "???"}</p>
      </div>
      <div className="hidden sm:flex gap-1.5 flex-wrap">
        {captured ? pokemon.types.map(slug => <TypeBadge key={slug} slug={slug} />) : (
          <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[7px] font-bold text-slate-500">???</span>
        )}
      </div>
      <div className="hidden md:block text-[10px] text-slate-400">{captured ? (pokemon.region ?? "—") : "—"}</div>
      {captured ? (
        <button
          className={`ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tm.gradient} text-white shadow-sm transition hover:brightness-110`}
          onClick={e=>{e.stopPropagation();onSelect(pokemon.id);}}
        >
          <BookOpen className="h-3.5 w-3.5"/>
        </button>
      ) : (
        <Lock className="ml-auto h-4 w-4 text-slate-600" />
      )}
    </div>
  );
}

const EmptyStateNotFound = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="mb-4 opacity-25">
      <svg viewBox="0 0 100 100" className="mx-auto h-16 w-16">
        <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="#ef4444" />
        <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#e2e8f0" />
        <rect x="5" y="47" width="90" height="6" fill="#94a3b8" />
        <circle cx="50" cy="50" r="14" fill="#94a3b8" />
        <circle cx="50" cy="50" r="10" fill="#f1f5f9" />
        <circle cx="50" cy="50" r="6" fill="#cbd5e1" />
      </svg>
    </div>
    <p className="font-pixel text-[10px] text-slate-500">Nenhum Pokémon encontrado</p>
    <p className="mt-1 text-sm text-slate-400">Tente ajustar os filtros ou o termo de busca.</p>
  </div>
);

export function PokedexGrid({ pokemon, capturedIds, viewMode, onSelect }: GridProps) {
  if (pokemon.length === 0) {
    return <EmptyStateNotFound />;
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {pokemon.map((p, i) => (
          <ListRow key={p.id} pokemon={p} idx={i} captured={capturedIds.includes(p.id)} onSelect={onSelect} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {pokemon.map((p, i) => (
        <PokemonCard key={p.id} pokemon={p} index={i} captured={capturedIds.includes(p.id)} onSelect={onSelect} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑧ RESEARCH PANEL  (slide-in side panel)
// ─────────────────────────────────────────────────────────────────────────────

// ── Stat bar ────────────────────────────────────────────────────────────────
function StatBar({ label, value, animate, maxStat = MAX_STAT }: { label:string; value:number; animate:boolean; maxStat?: number }) {
  const pct = Math.min((value / maxStat) * 100, 100);
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
  detail: PokemonDetailDto | null;
  isOpen:  boolean;
  onClose: () => void;
}

const DETAIL_STAT_MAX = 200;

export function ResearchPanel({ detail, isOpen, onClose }: PanelProps) {
  const [tab,       setTab]       = useState<PanelTab>("overview");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [animate,   setAnimate]   = useState(false);

  useEffect(() => {
    if (detail) { setTab("overview"); setImgLoaded(false); setAnimate(false); }
  }, [detail?.id]);

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

  if (!detail) return null;

  const primaryType = detail.types[0] ?? "normal";
  const tm = getTM(primaryType);

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
        role="dialog" aria-modal="true" aria-label={`Painel de pesquisa — ${detail.name}`}
      >

        {/* ── Hero header (dados GET /pokemon/{id}) ──────────────────────────── */}
        <div className={`relative flex-shrink-0 overflow-hidden bg-gradient-to-br ${tm.gradient} pb-9 pt-5`}>
          <PokeballSVG className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 opacity-[0.08]" />

          <div className="flex items-center justify-between px-6 mb-4">
            <span className="rounded-full bg-white/20 px-3 py-0.5 font-pixel text-[7px] uppercase tracking-widest text-white/80">
              #{String(detail.id).padStart(4,"0")} {detail.region ? `· ${detail.region}` : ""}
            </span>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              aria-label="Fechar painel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 rounded-full blur-2xl opacity-20" style={{background:"radial-gradient(circle,white,transparent 70%)"}} />
              {!imgLoaded && <div className="h-36 w-36 animate-pulse rounded-full bg-white/20" />}
              <img src={detail.spriteUrl} alt={detail.name} onLoad={() => setImgLoaded(true)}
                className={`relative z-10 h-36 w-36 object-contain drop-shadow-2xl transition-all duration-500 hover:scale-105 ${imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90 absolute"}`}
              />
            </div>
          </div>

          <div className="mt-3 px-6 text-center">
            <h2 className="font-pixel text-xl text-white drop-shadow mt-1">{detail.name.toUpperCase()}</h2>
            <div className="mt-2.5 flex justify-center gap-2 flex-wrap">
              {detail.types.map(slug => {
                const m = getTM(slug);
                const name = TYPE_SLUG_TO_NAME[slug] ?? slug;
                return (
                  <span key={slug} className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[8px] font-bold uppercase tracking-wide ${m.badge}`}>
                    {m.icon} {name}
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

        {/* ── Scrollable content (apenas campos de GET /pokemon/{id}) ────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* OVERVIEW: level, hp, region, locations */}
          {tab === "overview" && (
            <div className="space-y-4 p-5">
              <div className={`flex items-center justify-around rounded-2xl bg-gradient-to-r ${tm.gradient} p-4 text-white`}>
                {[
                  ["Nível", String(detail.level)],
                  ["HP", `${detail.currentHp} / ${detail.hp}`],
                  ["Região", detail.region ?? "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col items-center gap-0.5">
                    <span className="font-pixel text-[7px] uppercase tracking-wider text-white/70">{k}</span>
                    <span className="font-pixel text-sm leading-none text-white">{v}</span>
                  </div>
                ))}
              </div>
              {detail.locations.length > 0 && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                  <Section title="Localizações" icon={<Globe className="h-3.5 w-3.5"/>}>
                    <ul className="mt-2 space-y-2">
                      {detail.locations.map((loc, i) => (
                        <li key={i} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-2.5 text-sm font-semibold text-slate-700">
                          <span className="font-pixel text-[7px] uppercase tracking-widest text-slate-400">#{i + 1}</span>
                          {loc}
                        </li>
                      ))}
                    </ul>
                  </Section>
                </div>
              )}
            </div>
          )}

          {/* STATS: hp, baseAttack, baseDefense, baseSpeed */}
          {tab === "stats" && (
            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <Section title="Atributos base" icon={<TrendingUp className="h-3.5 w-3.5"/>}>
                  <div className="space-y-3 mt-1">
                    <StatBar label="HP" value={detail.hp} animate={animate} maxStat={DETAIL_STAT_MAX} />
                    <StatBar label="Ataque" value={detail.baseAttack} animate={animate} maxStat={DETAIL_STAT_MAX} />
                    <StatBar label="Defesa" value={detail.baseDefense} animate={animate} maxStat={DETAIL_STAT_MAX} />
                    <StatBar label="Velocidade" value={detail.baseSpeed} animate={animate} maxStat={DETAIL_STAT_MAX} />
                  </div>
                </Section>
              </div>
            </div>
          )}

          {/* RESEARCH: id, types, region, locations, creatorId */}
          {tab === "research" && (
            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <Section title="Dados do registro" icon={<Dna className="h-3.5 w-3.5"/>}>
                  <div className="mt-2 space-y-2.5">
                    {[
                      ["Nº Nacional", `#${String(detail.id).padStart(4,"0")}`],
                      ["Tipos", detail.types.map(s => TYPE_SLUG_TO_NAME[s] ?? s).join(" / ")],
                      ["Região", detail.region ?? "—"],
                      ["Criador", detail.creatorId ? detail.creatorId : "Oficial / Selvagem"],
                    ].map(([l, v]) => (
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
                    {detail.types.map(slug => {
                      const m = getTM(slug);
                      const name = TYPE_SLUG_TO_NAME[slug] ?? slug;
                      return (
                        <div key={slug} className={`flex-1 rounded-xl bg-gradient-to-br ${m.gradient} p-3 text-center shadow-sm`}>
                          <p className="text-2xl mb-1">{m.icon}</p>
                          <p className="font-pixel text-[8px] text-white/90 uppercase tracking-wider">{name}</p>
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

type ViewMode = "grid" | "list";

interface Filters {
  search:   string;
  type:     string;
  captured: "all" | "captured" | "not_captured";
}

const INIT: Filters = { search: "", type: "", captured: "all" };

export function PokedexPage() {
  const { page, limit, setPage, setLimit } = usePaginationParams();
  const [filters,     setFilters]     = useState<Filters>(INIT);
  const [view,        setView]        = useState<ViewMode>("grid");
  const [list,        setList]        = useState<PokemonDetailDto[]>([]);
  const [total,       setTotal]       = useState(0);
  const [capturedIds, setCapturedIds]  = useState<number[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [selectedId,  setSelectedId]  = useState<number | null>(null);
  const [detail,      setDetail]      = useState<PokemonDetailDto | null>(null);
  const [panelOpen,   setPanelOpen]   = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debSearch = useDebounce(filters.search, 400);
  const lastDebSearchRef = useRef(debSearch);
  const lastFetchKeyRef = useRef("");

  // Quando o termo de busca (debounced) muda, ir para página 0; uma única requisição por combinação (debSearch, page, filtros)
  useEffect(() => {
    const searchJustChanged = debSearch !== lastDebSearchRef.current;
    if (searchJustChanged) {
      lastDebSearchRef.current = debSearch;
      setPage(0);
    }
    const pageToFetch = searchJustChanged ? 0 : page;
    const fetchKey = `${debSearch}|${pageToFetch}|${filters.type}|${filters.captured}|${limit}`;
    if (fetchKey === lastFetchKeyRef.current) return;
    lastFetchKeyRef.current = fetchKey;

    let cancelled = false;
    setLoading(true);
    pokemonService
      .getAll({
        search: debSearch.trim() || undefined,
        type: filters.type || undefined,
        captured: filters.captured === "all" ? undefined : filters.captured === "captured",
        page: pageToFetch,
        limit,
      })
      .then(res => {
        if (!cancelled) {
          setList(res.data);
          setTotal(res.total);
          setCapturedIds(res.capturedIds ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) { setList([]); setCapturedIds([]); }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [debSearch, filters.type, filters.captured, page, limit, setPage]);

  // Fetch detail GET /pokemon/{id} when opening panel
  useEffect(() => {
    if (!selectedId || !panelOpen) return;
    let cancelled = false;
    pokemonService
      .getById(selectedId)
      .then(res => { if (!cancelled) setDetail(res); })
      .catch(() => { if (!cancelled) setDetail(null); });
    return () => { cancelled = true; };
  }, [selectedId, panelOpen]);

  useEffect(() => {
    document.body.style.overflow = panelOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [panelOpen]);

  const setF = useCallback(<K extends keyof Filters>(k: K, v: Filters[K]) => {
    setFilters(p => ({ ...p, [k]: v }));
    // Só reseta página ao mudar tipo/captured; para search o reset é no useEffect quando debSearch muda
    if (k !== "search") setPage(0);
  }, [setPage]);

  const onSelect = useCallback((id: number) => {
    setSelectedId(id);
    setPanelOpen(true);
  }, []);
  const onClose = useCallback(() => {
    setPanelOpen(false);
    setTimeout(() => { setSelectedId(null); setDetail(null); }, 420);
  }, []);

  const clearFilts = useCallback(() => { setFilters(INIT); setPage(0); }, [setPage]);

  const activeCount = [filters.type !== "", filters.captured !== "all"].filter(Boolean).length;

  const paginationMeta = useMemo(
    () => createPaginationMeta(total, page, limit),
    [total, page, limit]
  );

  return (
    <AppLayout
      search={filters.search}
      onSearchChange={v => setF("search", v)}
      searchPlaceholder="Nome ou número da Pokédex..."
    >
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
          </div>
        </div>
      </header>

      {/* ═════════════════════ STICKY TOOLBAR ══════════════════ */}
      <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

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
                {TYPE_FILTER_OPTIONS.map(t => <option key={t.slug} value={t.slug}>{t.name}</option>)}
              </FilterSelect>

              <FilterSelect value={filters.captured} onChange={v => setF("captured", v as Filters["captured"])} icon={<CheckCircle2 className="h-3.5 w-3.5"/>}>
                <option value="all">Todos</option>
                <option value="captured">Capturados</option>
                <option value="not_captured">Não capturados</option>
              </FilterSelect>

              {activeCount > 0 && (
                <button onClick={clearFilts} className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100">
                  <X className="h-3.5 w-3.5"/> Limpar ({activeCount})
                </button>
              )}
            </div>

            {/* View toggle */}
            <div className="ml-auto flex items-center gap-2">
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            <p className="mt-4 font-pixel text-[10px] text-slate-500">Carregando...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="hidden sm:flex items-center gap-4 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-gradient-to-br from-red-400 to-rose-500"/>
                  Capturado — clique para analisar
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-slate-700"/>
                  Não capturado — capture para revelar
                </span>
              </div>
            </div>
            <PokedexGrid pokemon={list} capturedIds={capturedIds} viewMode={view} onSelect={onSelect} />
          </>
        )}

        {paginationMeta.totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <PaginationControls
              meta={paginationMeta}
              onPageChange={setPage}
              showLimitSelector
              onLimitChange={setLimit}
            />
          </div>
        )}
      </main>

      {/* ═════════════════════ RESEARCH PANEL (dados de GET /pokemon/{id}) ═════ */}
      <ResearchPanel detail={detail} isOpen={panelOpen} onClose={onClose} />

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
