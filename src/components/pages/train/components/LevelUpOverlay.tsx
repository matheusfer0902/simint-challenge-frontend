"use client";

import { Star } from "lucide-react";

export interface LevelUpOverlayProps {
  level: number;
  isActive: boolean;
}

export function LevelUpOverlay({ level, isActive }: LevelUpOverlayProps) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl bg-black/75 backdrop-blur-[2px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-3 w-3 rounded-sm animate-confettiFall"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-12px",
              background: ["#fbbf24", "#ef4444", "#34d399", "#60a5fa", "#f472b6", "#a78bfa", "#fb923c"][i % 7],
              animationDelay: `${(Math.random() * 0.6).toFixed(2)}s`,
              animationDuration: `${(Math.random() * 1.2 + 1.4).toFixed(2)}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex h-24 w-24 animate-levelPopBig items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-2xl shadow-yellow-400/50">
          <Star className="h-12 w-12 text-white" />
        </div>
        <p className="animate-levelBlink font-pixel text-[15px] text-yellow-400 drop-shadow-lg">
          LEVEL UP!
        </p>
        <p className="font-pixel text-6xl leading-none text-white drop-shadow-2xl">{level}</p>
        <p className="text-sm font-semibold text-white/70">Parabéns! 🎉</p>
      </div>
    </div>
  );
}
