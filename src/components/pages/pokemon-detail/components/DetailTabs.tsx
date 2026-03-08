"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Heart, Shield, Swords, Zap } from "lucide-react";
import type { PokemonDetail, Stat } from "../types";
import { Section } from "./Section";
import { StatBar } from "./StatBar";
import { StatRadarChart } from "./StatRadarChart";

const STAT_KEYS: (keyof Stat)[] = ["hp", "attack", "defense", "speed"] as const;

const STAT_CONFIG: {
  key: keyof Stat;
  label: string;
  color: string;
  icon: React.ReactNode;
}[] = [
  { key: "hp", label: "HP", color: "bg-emerald-400", icon: <Heart className="h-3.5 w-3.5" /> },
  { key: "attack", label: "Attack", color: "bg-red-400", icon: <Swords className="h-3.5 w-3.5" /> },
  { key: "defense", label: "Defense", color: "bg-blue-400", icon: <Shield className="h-3.5 w-3.5" /> },
  { key: "speed", label: "Speed", color: "bg-yellow-400", icon: <Zap className="h-3.5 w-3.5" /> },
];

interface DetailTabsProps {
  pokemon: PokemonDetail;
  primaryGradient: string;
  onBack: () => void;
}

export function DetailTabs({ pokemon, primaryGradient, onBack }: DetailTabsProps) {
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

  const totalBst = STAT_KEYS.reduce((sum, key) => sum + pokemon.stats[key], 0);

  return (
    <>
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
            <span className="font-pixel text-sm text-poke-red">{totalBst}</span>
          </div>
        </Section>
        <Section title="Radar Overview">
          <StatRadarChart
            stats={pokemon.stats}
            primaryType={pokemon.types[0]}
          />
        </Section>
      </div>

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
