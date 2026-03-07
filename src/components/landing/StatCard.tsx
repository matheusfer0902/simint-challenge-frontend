"use client";

import { useState, useEffect } from "react";
import type { ElementType } from "react";

interface StatCardProps {
  value: string;
  label: string;
  icon: ElementType;
  delay: number;
}

export function StatCard({ value, label, icon: Icon, delay }: StatCardProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const numericValue = parseInt(value.replace(/\D/g, ""));

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;

      const counter = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setCount(numericValue);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
    }, delay);

    return () => clearTimeout(timer);
  }, [numericValue, delay]);

  return (
    <div
      className={`text-center transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center shadow-lg">
        <Icon className="w-8 h-8 text-poke-red" />
      </div>
      <div className="font-pixel text-3xl text-white mb-2">
        {value.includes("+") ? `${count}+` : value.includes("%") ? `${count}%` : count}
      </div>
      <p className="text-white/80 text-sm font-medium">{label}</p>
    </div>
  );
}
