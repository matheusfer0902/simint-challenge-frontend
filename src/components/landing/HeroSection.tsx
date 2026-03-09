"use client";

import { useState, useEffect } from "react";
import { Sparkles, Shield, Database, Search, Zap, Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pokeball } from "@/components/landing/Pokeball";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToHowItWorks = () => {
    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 pokedex-grid" />
      <div className="absolute inset-0 bg-gradient-to-b from-poke-red/5 via-transparent to-poke-cyan/5" />

      <div className="absolute top-32 left-10 opacity-20">
        <Pokeball size={80} className="animate-float" />
      </div>
      <div className="absolute bottom-40 right-16 opacity-15">
        <Pokeball size={100} className="animate-bounce-slow" />
      </div>
      <div className="absolute top-1/3 right-1/4 opacity-10">
        <Pokeball size={60} className="animate-spin-slow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`text-center lg:text-left transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <Badge className="mb-6 bg-poke-cyan/20 text-poke-blue border-poke-cyan/30 hover:bg-poke-cyan/30 px-4 py-1.5">
              <Shield className="w-3.5 h-3.5 mr-1.5" />
              Restricted System
            </Badge>

            <h2 className="font-pixel text-3xl sm:text-4xl lg:text-5xl text-poke-dark-gray leading-tight mb-6">
              Manage your
              <span className="block text-gradient-red mt-2">Pokémon</span>
              like a Master
            </h2>

            <p className="text-poke-dark-gray/70 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Exclusive system for trainers and researchers. Register,
              organize, and track your Pokémon with the efficiency of a Pokémon Center.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-poke-red hover:bg-poke-dark-red text-white btn-glow text-base px-8"
                onClick={() => router.push("/auth/register")}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-poke-dark-gray/20 text-poke-dark-gray hover:bg-poke-gray text-base px-8"
                onClick={scrollToHowItWorks}
              >
                <Search className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
              {[
                { icon: Shield, text: "Secure" },
                { icon: Zap, text: "Fast" },
                { icon: Database, text: "Reliable" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-poke-dark-gray/60 text-sm">
                  <Icon className="w-4 h-4 text-poke-cyan" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <div className="relative">
              <div className="bg-gradient-to-br from-poke-red to-poke-dark-red rounded-3xl p-6 shadow-poke-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-poke-cyan to-poke-light-blue flex items-center justify-center shadow-lg animate-pulse-glow">
                    <div className="w-10 h-10 rounded-full bg-white/30" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-full bg-poke-red border-2 border-white/50" />
                    <div className="w-4 h-4 rounded-full bg-poke-yellow border-2 border-white/50" />
                    <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-white/50" />
                  </div>
                </div>

                <div className="bg-poke-dark-gray rounded-2xl p-4 mb-4 scanline">
                  <div className="bg-gradient-to-br from-poke-cyan/20 to-poke-blue/20 rounded-xl p-6 border-2 border-poke-cyan/30">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-pixel text-poke-cyan text-xs">#001</span>
                      <Heart className="w-5 h-5 text-poke-pink fill-poke-pink" />
                    </div>
                    <div className="h-32 bg-gradient-to-br from-poke-cyan/30 to-poke-blue/30 rounded-lg flex items-center justify-center mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/bulbasaur.png"
                        alt="Bulbasaur"
                        className="h-28 w-auto object-contain drop-shadow-lg animate-float"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-poke-dark-gray/50 rounded p-2">
                        <span className="text-poke-cyan/60">TYPE</span>
                        <p className="text-poke-cyan font-medium">Grass/Poison</p>
                      </div>
                      <div className="bg-poke-dark-gray/50 rounded p-2">
                        <span className="text-poke-cyan/60">HP</span>
                        <p className="text-poke-cyan font-medium">45/45</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-poke-dark-gray border-4 border-poke-dark-gray/50 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-poke-dark-gray/80" />
                  </div>
                  <div className="flex gap-3">
                    <div className="w-16 h-4 bg-poke-dark-gray rounded-full" />
                    <div className="w-16 h-4 bg-poke-dark-gray rounded-full" />
                  </div>
                  <div className="w-16 h-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-16 bg-poke-dark-gray rounded" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-6 bg-poke-dark-gray rounded" />
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-20 h-20 bg-poke-yellow/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-poke-cyan/20 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#FFFFFF"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
}