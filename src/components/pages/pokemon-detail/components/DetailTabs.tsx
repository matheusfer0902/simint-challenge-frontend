"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Heart, Shield, Swords, Zap, Star } from "lucide-react";
import { getDetailTypeStyle } from "../data";
import type { PokemonDetail, Stat } from "../types";
import { Section } from "./Section";
import { StatBar } from "./StatBar";
import { StatRadarChart } from "./StatRadarChart";
import { MoveCard } from "./MoveCard";
import { EvolutionChain } from "./EvolutionChain";

type DetailTab = "stats" | "moves" | "evolution";

const STAT_CONFIG: {
  key: keyof Stat;
  label: string;
  color: string;
  icon: React.ReactNode;
}[] = [
  { key: "hp", label: "HP", color: "bg-emerald-400", icon: <Heart className="h-3.5 w-3.5" /> },
  { key: "attack", label: "Attack", color: "bg-red-400", icon: <Swords className="h-3.5 w-3.5" /> },
  { key: "defense", label: "Defense", color: "bg-blue-400", icon: <Shield className="h-3.5 w-3.5" /> },
  { key: "spAtk", label: "Sp. Atk", color: "bg-orange-400", icon: <Star className="h-3.5 w-3.5" /> },
  { key: "spDef", label: "Sp. Def", color: "bg-indigo-400", icon: <Shield className="h-3.5 w-3.5" /> },
  { key: "speed", label: "Speed", color: "bg-yellow-400", icon: <Zap className="h-3.5 w-3.5" /> },
];

interface DetailTabsProps {
  pokemon: PokemonDetail;
  primaryGradient: string;
  onBack: () => void;
}

export function DetailTabs({ pokemon, primaryGradient, onBack }: DetailTabsProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("stats");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 }
    );
    const el = statsRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {(["stats", "moves", "evolution"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full border-2 px-5 py-2 font-pixel text-[9px] uppercase tracking-wider transition-all duration-200 focus:outline-none ${
              activeTab === tab
                ? "border-poke-red bg-poke-red text-white shadow-lg shadow-poke-red/20"
                : "border-slate-300 bg-white text-slate-600 hover:border-poke-red/30"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "stats" && (
        <div ref={statsRef} className="grid gap-4 sm:grid-cols-2">
          <Section title="Base Stats">
            <div className="space-y-3">
              {STAT_CONFIG.map(({ key, label, color, icon }) => (
                <StatBar
                  key={key}
                  label={label}
                  value={pokemon.stats[key]}
                  color={color}
                  icon={icon}
                  animate={statsVisible}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="font-pixel text-[9px] uppercase tracking-wider text-slate-500">
                Total BST
              </span>
              <span className="font-pixel text-sm text-poke-red">
                {Object.values(pokemon.stats).reduce((a, b) => a + b, 0)}
              </span>
            </div>
          </Section>
          <Section title="Radar Overview">
            <StatRadarChart
              stats={pokemon.stats}
              primaryType={pokemon.types[0]}
            />
          </Section>
        </div>
      )}

      {activeTab === "moves" && (
        <Section title={`Moves (${pokemon.moves.length})`}>
          <div className="grid gap-2 sm:grid-cols-2">
            {pokemon.moves.map((m) => (
              <MoveCard key={m.name} move={m} />
            ))}
          </div>
        </Section>
      )}

      {activeTab === "evolution" && (
        <Section title="Evolution Chain">
          <EvolutionChain chain={pokemon.evolution} currentId={pokemon.id} />
        </Section>
      )}

      <button
        type="button"
        onClick={onBack}
        className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${primaryGradient} py-4 font-pixel text-[11px] text-white shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl active:scale-[0.98]`}
      >
        <ArrowLeft className="h-4 w-4" />
        BACK TO LIST
      </button>
    </>
  );
}
