"use client";

import { Database, Search, Shield, Activity, Globe, Zap, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/landing/FeatureCard";

export function FeaturesSection() {
  return (
    <section id="funcionalidades" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-poke-red/10 text-poke-red border-poke-red/20">
            <Cpu className="w-3.5 h-3.5 mr-1.5" />
            Features
          </Badge>
          <h2 className="font-pixel text-2xl sm:text-3xl text-poke-dark-gray mb-4">
            Everything you need
          </h2>
          <p className="text-poke-dark-gray/70 max-w-2xl mx-auto">
            A complete system inspired by Pokémon Centers, with all the tools
            to manage your Pokémon collection efficiently.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={Database}
            title="Complete CRUD"
            description="Create, read, update, and delete Pokémon records with an intuitive and responsive interface."
            color="bg-gradient-to-br from-poke-red to-poke-dark-red"
            delay={0}
          />
          <FeatureCard
            icon={Search}
            title="Advanced Search"
            description="Find Pokémon quickly by name, type, number, or specific characteristics."
            color="bg-gradient-to-br from-poke-blue to-poke-light-blue"
            delay={100}
          />
          <FeatureCard
            icon={Shield}
            title="Restricted Access"
            description="Secure system exclusive to authorized trainers and researchers."
            color="bg-gradient-to-br from-poke-cyan to-poke-blue"
            delay={200}
          />
          <FeatureCard
            icon={Activity}
            title="Statistics"
            description="Track detailed statistics of each Pokémon: HP, attack, defense, and more."
            color="bg-gradient-to-br from-poke-pink to-poke-red"
            delay={300}
          />
          <FeatureCard
            icon={Globe}
            title="Multi-platform"
            description="Access from any device with an interface optimized for desktop and mobile."
            color="bg-gradient-to-br from-poke-yellow to-orange-400"
            delay={400}
          />
          <FeatureCard
            icon={Zap}
            title="Performance"
            description="Fast and efficient system built with the best technologies on the market."
            color="bg-gradient-to-br from-green-400 to-emerald-500"
            delay={500}
          />
        </div>
      </div>
    </section>
  );
}