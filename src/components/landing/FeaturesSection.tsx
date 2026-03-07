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
            Funcionalidades
          </Badge>
          <h2 className="font-pixel text-2xl sm:text-3xl text-poke-dark-gray mb-4">
            Tudo que você precisa
          </h2>
          <p className="text-poke-dark-gray/70 max-w-2xl mx-auto">
            Um sistema completo inspirado nos Centros Pokémon, com todas as ferramentas
            para gerenciar sua coleção de Pokémons de forma eficiente.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={Database}
            title="CRUD Completo"
            description="Crie, leia, atualize e exclua registros de Pokémons com interface intuitiva e responsiva."
            color="bg-gradient-to-br from-poke-red to-poke-dark-red"
            delay={0}
          />
          <FeatureCard
            icon={Search}
            title="Busca Avançada"
            description="Encontre Pokémons rapidamente por nome, tipo, número ou características específicas."
            color="bg-gradient-to-br from-poke-blue to-poke-light-blue"
            delay={100}
          />
          <FeatureCard
            icon={Shield}
            title="Acesso Restrito"
            description="Sistema seguro exclusivo para treinadores e pesquisadores autorizados."
            color="bg-gradient-to-br from-poke-cyan to-poke-blue"
            delay={200}
          />
          <FeatureCard
            icon={Activity}
            title="Estatísticas"
            description="Acompanhe estatísticas detalhadas de cada Pokémon: HP, ataque, defesa e mais."
            color="bg-gradient-to-br from-poke-pink to-poke-red"
            delay={300}
          />
          <FeatureCard
            icon={Globe}
            title="Multi-plataforma"
            description="Acesse de qualquer dispositivo com interface otimizada para desktop e mobile."
            color="bg-gradient-to-br from-poke-yellow to-orange-400"
            delay={400}
          />
          <FeatureCard
            icon={Zap}
            title="Performance"
            description="Sistema rápido e eficiente construído com as melhores tecnologias do mercado."
            color="bg-gradient-to-br from-green-400 to-emerald-500"
            delay={500}
          />
        </div>
      </div>
    </section>
  );
}
