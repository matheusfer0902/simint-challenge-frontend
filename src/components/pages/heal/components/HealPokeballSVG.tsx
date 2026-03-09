"use client";

export interface HealPokeballSVGProps {
  state?: "red" | "yellow" | "green";
}

export function HealPokeballSVG({ state: s = "red" }: HealPokeballSVGProps) {
  const topColor = s === "green" ? "#22c55e" : s === "yellow" ? "#fbbf24" : "#ef4444";
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow">
      <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill={topColor} stroke="#000" strokeWidth="3" />
      <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#fff" stroke="#000" strokeWidth="3" />
      <rect x="5" y="47" width="90" height="6" fill="#000" />
      <circle cx="50" cy="50" r="14" fill="#000" />
      <circle cx="50" cy="50" r="10" fill="#fff" />
      <circle cx="50" cy="50" r="6" fill={s === "red" ? "#000" : topColor} />
      <circle cx="50" cy="50" r="3" fill="#fff" />
    </svg>
  );
}
