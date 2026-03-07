"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PokemonCardProps {
  name: string;
  number: string;
  types: string[];
  image: string;
  delay: number;
}

const typeColors: Record<string, string> = {
  Elétrico: "bg-poke-yellow",
  Fogo: "bg-poke-red",
  Água: "bg-blue-500",
  Planta: "bg-green-500",
  Psíquico: "bg-purple-500",
  Fantasma: "bg-purple-700",
  Lutador: "bg-orange-500",
  Normal: "bg-gray-400",
  Veneno: "bg-purple-400",
  Voador: "bg-sky-400",
  Aço: "bg-slate-400",
};

export function PokemonCard({ name, number, types, image, delay }: PokemonCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card
      className={`overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="bg-gradient-to-br from-poke-gray to-white p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="font-pixel text-xs text-poke-dark-gray/60">{number}</span>
          <Heart className="w-4 h-4 text-poke-pink" />
        </div>
        <div className="h-32 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={name}
            className="h-28 w-auto object-contain drop-shadow-lg hover:scale-110 transition-transform"
          />
        </div>
      </div>
      <CardContent className="p-4 bg-white">
        <h4 className="font-pixel text-sm text-poke-dark-gray mb-2">{name}</h4>
        <div className="flex gap-2 flex-wrap">
          {types.map((type) => (
            <span
              key={type}
              className={`${typeColors[type] ?? "bg-gray-400"} text-white text-xs px-2 py-1 rounded-full font-medium`}
            >
              {type}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
