"use client";

export interface XpBarProps {
  xp: number;
  xpToNext: number;
  isLevelUp: boolean;
  accent: string;
}

export function XpBar({ xp, xpToNext, isLevelUp, accent }: XpBarProps) {
  const raw = isLevelUp ? 1 : Math.min(xp / xpToNext, 1);
  const pct = raw * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-pixel text-[8px] uppercase tracking-widest text-slate-400">EXP</span>
        <span className="font-pixel text-[10px] text-slate-600">
          {isLevelUp ? xpToNext : xp} / {xpToNext}
        </span>
      </div>

      <div className="relative h-5 overflow-hidden rounded-full bg-slate-900/80 shadow-inner">
        <div
          className="h-full rounded-full transition-all ease-out"
          style={{
            width: `${pct}%`,
            transitionDuration: isLevelUp ? "1.1s" : "0.9s",
            background: `linear-gradient(90deg, ${accent}cc, ${accent})`,
            boxShadow: `0 0 10px ${accent}88`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full animate-xpShimmer"
            style={{
              backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
            }}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-pixel text-[8px] text-white/80 mix-blend-screen drop-shadow">
            {Math.round(pct)}%
          </span>
        </div>
      </div>
    </div>
  );
}
