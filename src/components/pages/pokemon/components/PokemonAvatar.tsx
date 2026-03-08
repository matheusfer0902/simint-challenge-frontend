"use client";

import { useState } from "react";
import { getMeta } from "../data";
import type { PokemonData } from "../types";

interface PokemonAvatarProps {
  pokemon: PokemonData;
  size?: number;
}

export function PokemonAvatar({ pokemon, size = 96 }: PokemonAvatarProps) {
  const [loaded, setLoaded] = useState(false);
  const { gradient } = getMeta(pokemon.types[0]);

  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${gradient} shadow-lg`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full opacity-30 blur-md" style={{ background: "inherit" }} />
      <div className="absolute inset-0 rounded-full border-4 border-white/30" />

      {!loaded && <div className="absolute inset-4 animate-pulse rounded-full bg-white/30" />}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pokemon.spriteUrl}
        alt={pokemon.name}
        className={`relative z-10 object-contain drop-shadow-xl transition-all duration-500 ${
          loaded ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        style={{ width: size * 0.75, height: size * 0.75 }}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
