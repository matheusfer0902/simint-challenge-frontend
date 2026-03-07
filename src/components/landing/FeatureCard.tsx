"use client";

import { useState, useEffect } from "react";
import type { ElementType } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: ElementType;
  title: string;
  description: string;
  color: string;
  delay: number;
}

export function FeatureCard({ icon: Icon, title, description, color, delay }: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card
      className={`card-3d glass-card border-2 border-poke-gray/50 overflow-hidden transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className={`h-1.5 w-full ${color}`} />
      <CardContent className="p-6">
        <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="font-pixel text-sm text-poke-dark-gray mb-3 leading-relaxed">{title}</h3>
        <p className="text-poke-dark-gray/70 text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
