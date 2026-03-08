"use client";

import { getDetailTypeStyle } from "../data";
import type { Stat } from "../types";

interface StatRadarChartProps {
  stats: Stat;
  primaryType: string;
}

export function StatRadarChart({ stats, primaryType }: StatRadarChartProps) {
  const meta = getDetailTypeStyle(primaryType);
  const labels = ["HP", "ATK", "DEF", "SPD"];
  const values = [
    stats.hp,
    stats.attack,
    stats.defense,
    stats.speed,
  ];
  const maxVal = 200;
  const cx = 100;
  const cy = 100;
  const r = 70;
  const n = 4;

  const angleFor = (i: number) =>
    (Math.PI * 2 * i) / n - Math.PI / 2;

  const gridPolygon = (scale: number) =>
    [...Array(n)]
      .map((_, i) => {
        const a = angleFor(i);
        return `${cx + r * scale * Math.cos(a)},${cy + r * scale * Math.sin(a)}`;
      })
      .join(" ");

  const statPolygon = values
    .map((v, i) => {
      const scale = Math.min(v / maxVal, 1);
      const a = angleFor(i);
      return `${cx + r * scale * Math.cos(a)},${cy + r * scale * Math.sin(a)}`;
    })
    .join(" ");

  const glowColor = meta.glow.replace("0.35", "0.9").replace("0.25", "0.9").replace("0.45", "0.9");

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className="h-48 w-48">
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <polygon
            key={scale}
            points={gridPolygon(scale)}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}
        {[...Array(n)].map((_, i) => {
          const a = angleFor(i);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + r * Math.cos(a)}
              y2={cy + r * Math.sin(a)}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}
        <polygon
          points={statPolygon}
          fill={meta.glow.replace("0.35", "0.25").replace("0.25", "0.2").replace("0.45", "0.25")}
          stroke={glowColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {values.map((v, i) => {
          const scale = Math.min(v / maxVal, 1);
          const a = angleFor(i);
          return (
            <circle
              key={i}
              cx={cx + r * scale * Math.cos(a)}
              cy={cy + r * scale * Math.sin(a)}
              r="4"
              fill="white"
              stroke={glowColor}
              strokeWidth="2"
            />
          );
        })}
        {labels.map((label, i) => {
          const a = angleFor(i);
          const lx = cx + (r + 16) * Math.cos(a);
          const ly = cy + (r + 16) * Math.sin(a);
          return (
            <text
              key={label}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="9"
              fontWeight="bold"
              fill="#64748b"
              fontFamily="monospace"
            >
              {label}
            </text>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {labels.map((l, i) => (
          <span key={l} className="text-[9px] text-slate-500">
            <span className="font-bold text-slate-700">{l}</span> {values[i]}
          </span>
        ))}
      </div>
    </div>
  );
}
