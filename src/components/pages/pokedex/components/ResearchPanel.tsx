"use client";

import { useState, useEffect } from "react";
import { X, Globe, BarChart2, BookOpen, Dna, Shield, TrendingUp } from "lucide-react";
import type { PokemonDetailDto } from "@/lib/api/pokemon.service";
import type { PanelTab } from "../types";
import { getTypeMeta, TYPE_SLUG_TO_NAME, DETAIL_STAT_MAX } from "../data";
import { PokeballSVG } from "./PokeballSVG";
import { StatBar } from "./StatBar";
import { Section } from "./Section";

export interface ResearchPanelProps {
  detail: PokemonDetailDto | null;
  isOpen: boolean;
  onClose: () => void;
}

const TABS: { id: PanelTab; icon: React.ReactNode; label: string }[] = [
  { id: "overview", icon: <Globe className="h-3.5 w-3.5" />, label: "Visão Geral" },
  { id: "stats", icon: <BarChart2 className="h-3.5 w-3.5" />, label: "Atributos" },
  { id: "research", icon: <BookOpen className="h-3.5 w-3.5" />, label: "Pesquisa" },
];

export function ResearchPanel({ detail, isOpen, onClose }: ResearchPanelProps) {
  const [tab, setTab] = useState<PanelTab>("overview");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (detail) {
      setTab("overview");
      setImgLoaded(false);
      setAnimate(false);
    }
  }, [detail?.id]);

  useEffect(() => {
    if (tab === "stats" && isOpen) {
      const t = setTimeout(() => setAnimate(true), 220);
      return () => clearTimeout(t);
    }
  }, [tab, isOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  if (!detail) return null;

  const primaryType = detail.types[0] ?? "normal";
  const tm = getTypeMeta(primaryType);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal
        aria-label={`Painel de pesquisa — ${detail.name}`}
      >
        <div
          className={`relative flex-shrink-0 overflow-hidden bg-gradient-to-br ${tm.gradient} pb-9 pt-5`}
        >
          <PokeballSVG className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 opacity-[0.08]" />

          <div className="mb-4 flex items-center justify-between px-6">
            <span className="rounded-full bg-white/20 px-3 py-0.5 font-pixel text-[7px] uppercase tracking-widest text-white/80">
              #{String(detail.id).padStart(4, "0")} {detail.region ? `· ${detail.region}` : ""}
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
              <div
                className="pointer-events-none absolute inset-0 rounded-full opacity-20 blur-2xl"
                style={{
                  background: "radial-gradient(circle,white,transparent 70%)",
                }}
              />
              {!imgLoaded && (
                <div className="h-36 w-36 animate-pulse rounded-full bg-white/20" />
              )}
              <img
                src={detail.spriteUrl}
                alt={detail.name}
                onLoad={() => setImgLoaded(true)}
                className={`relative z-10 h-36 w-36 object-contain drop-shadow-2xl transition-all duration-500 hover:scale-105 ${imgLoaded ? "scale-100 opacity-100" : "absolute scale-90 opacity-0"}`}
              />
            </div>
          </div>

          <div className="mt-3 px-6 text-center">
            <h2 className="mt-1 font-pixel text-xl text-white drop-shadow">
              {detail.name.toUpperCase()}
            </h2>
            <div className="mt-2.5 flex flex-wrap justify-center gap-2">
              {detail.types.map(slug => {
                const m = getTypeMeta(slug);
                const name = TYPE_SLUG_TO_NAME[slug] ?? slug;
                return (
                  <span
                    key={slug}
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[8px] font-bold uppercase tracking-wide ${m.badge}`}
                  >
                    {m.icon} {name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 border-b border-slate-100">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 py-3.5 font-pixel text-[7px] uppercase tracking-wider transition-all ${tab === t.id ? "border-b-2 border-red-500 text-red-500" : "text-slate-400 hover:text-slate-600"}`}
            >
              {t.icon} <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "overview" && (
            <div className="space-y-4 p-5">
              <div
                className={`flex items-center justify-around rounded-2xl bg-gradient-to-r ${tm.gradient} p-4 text-white`}
              >
                {[
                  ["Nível", String(detail.level)],
                  ["HP", `${detail.currentHp} / ${detail.hp}`],
                  ["Região", detail.region ?? "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col items-center gap-0.5">
                    <span className="font-pixel text-[7px] uppercase tracking-wider text-white/70">
                      {k}
                    </span>
                    <span className="font-pixel text-sm leading-none text-white">{v}</span>
                  </div>
                ))}
              </div>
              {detail.locations.length > 0 && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                  <Section title="Localizações" icon={<Globe className="h-3.5 w-3.5" />}>
                    <ul className="mt-2 space-y-2">
                      {detail.locations.map((loc, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-2.5 text-sm font-semibold text-slate-700"
                        >
                          <span className="font-pixel text-[7px] uppercase tracking-widest text-slate-400">
                            #{i + 1}
                          </span>
                          {loc}
                        </li>
                      ))}
                    </ul>
                  </Section>
                </div>
              )}
            </div>
          )}

          {tab === "stats" && (
            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <Section title="Atributos base" icon={<TrendingUp className="h-3.5 w-3.5" />}>
                  <div className="mt-1 space-y-3">
                    <StatBar
                      label="HP"
                      value={detail.hp}
                      animate={animate}
                      maxStat={DETAIL_STAT_MAX}
                    />
                    <StatBar
                      label="Ataque"
                      value={detail.baseAttack}
                      animate={animate}
                      maxStat={DETAIL_STAT_MAX}
                    />
                    <StatBar
                      label="Defesa"
                      value={detail.baseDefense}
                      animate={animate}
                      maxStat={DETAIL_STAT_MAX}
                    />
                    <StatBar
                      label="Velocidade"
                      value={detail.baseSpeed}
                      animate={animate}
                      maxStat={DETAIL_STAT_MAX}
                    />
                  </div>
                </Section>
              </div>
            </div>
          )}

          {tab === "research" && (
            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <Section title="Dados do registro" icon={<Dna className="h-3.5 w-3.5" />}>
                  <div className="mt-2 space-y-2.5">
                    {[
                      ["Nº Nacional", `#${String(detail.id).padStart(4, "0")}`],
                      [
                        "Tipos",
                        detail.types.map(s => TYPE_SLUG_TO_NAME[s] ?? s).join(" / "),
                      ],
                      ["Região", detail.region ?? "—"],
                      ["Criador", detail.creatorId ? detail.creatorId : "Oficial / Selvagem"],
                    ].map(([l, v]) => (
                      <div
                        key={l}
                        className="flex items-start justify-between gap-4"
                      >
                        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          {l}
                        </span>
                        <span className="text-right text-xs text-slate-700">{v}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <Section title="Análise de Tipos" icon={<Shield className="h-3.5 w-3.5" />}>
                  <div className="mt-2 flex gap-2">
                    {detail.types.map(slug => {
                      const m = getTypeMeta(slug);
                      const name = TYPE_SLUG_TO_NAME[slug] ?? slug;
                      return (
                        <div
                          key={slug}
                          className={`flex-1 rounded-xl bg-gradient-to-br ${m.gradient} p-3 text-center shadow-sm`}
                        >
                          <p className="mb-1 text-2xl">{m.icon}</p>
                          <p className="font-pixel text-[8px] uppercase tracking-wider text-white/90">
                            {name}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-slate-100 px-5 py-3.5">
          <div className="flex items-center justify-between text-[9px] text-slate-400">
            <span className="font-pixel tracking-wider">RESEARCH LAB · POKE CENTER</span>
            <div className="flex items-center gap-1.5">
              <span>Fechar</span>
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[8px]">
                ESC
              </kbd>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
