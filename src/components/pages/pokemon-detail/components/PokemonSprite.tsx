"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { getDetailTypeStyle } from "../data";
import type { PokemonDetail } from "../types";

interface PokemonSpriteProps {
  pokemon: PokemonDetail;
  size?: number;
}

export function PokemonSprite({ pokemon, size = 200 }: PokemonSpriteProps) {
  const [loaded, setLoaded] = useState(false);
  const primaryType = getDetailTypeStyle(pokemon.types[0]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute rounded-full border-2 border-dashed border-white/20 animate-spin-slow"
        style={{ width: size * 0.88, height: size * 0.88 }}
      />
      <div
        className="absolute rounded-full blur-2xl"
        style={{
          width: size * 0.75,
          height: size * 0.75,
          background: `radial-gradient(circle, ${primaryType.glow}, transparent 70%)`,
        }}
      />
      <div
        className="absolute rounded-full border-4 border-white/10"
        style={{ width: size * 0.9, height: size * 0.9 }}
      />

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white/80" />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pokemon.sprite}
        alt={pokemon.name}
        className={`relative z-10 object-contain drop-shadow-2xl transition-all duration-700 hover:scale-110 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        style={{ width: size * 0.82, height: size * 0.82 }}
        onLoad={() => setLoaded(true)}
      />

      {pokemon.shiny && (
        <div className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 shadow-lg">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
      )}
    </div>
  );
}
