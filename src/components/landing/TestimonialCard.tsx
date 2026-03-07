"use client";

import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  delay: number;
}

export function TestimonialCard({ name, role, quote, delay }: TestimonialCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card
      className={`glass-card border-2 border-poke-cyan/30 overflow-hidden transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-poke-yellow text-poke-yellow" />
          ))}
        </div>
        <p className="text-poke-dark-gray/80 text-sm leading-relaxed mb-4 italic">
          &ldquo;{quote}&rdquo;
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-poke-cyan to-poke-blue flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-poke-dark-gray text-sm">{name}</p>
            <p className="text-poke-dark-gray/60 text-xs">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
