"use client";

import { User, Database, Zap, Heart, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/landing/StatCard";
import { Pokeball } from "@/components/landing/Pokeball";

export function StatsSection() {
  return (
    <section
      id="estatisticas"
      className="py-24 bg-gradient-to-br from-poke-red to-poke-dark-red relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10">
          <Pokeball size={120} animate={false} />
        </div>
        <div className="absolute bottom-10 right-10">
          <Pokeball size={150} animate={false} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Pokeball size={200} animate={false} className="opacity-30" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            <Activity className="w-3.5 h-3.5 mr-1.5" />
            Statistics
          </Badge>
          <h2 className="font-pixel text-2xl sm:text-3xl text-white mb-4">
            Impressive data
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Numbers that show the trust trainers and researchers have in our system.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard value="1000+" label="Trainers" icon={User} delay={0} />
          <StatCard value="50000+" label="Pokémon" icon={Database} delay={100} />
          <StatCard value="99%" label="Uptime" icon={Zap} delay={200} />
          <StatCard value="24" label="Support" icon={Heart} delay={300} />
        </div>
      </div>
    </section>
  );
}