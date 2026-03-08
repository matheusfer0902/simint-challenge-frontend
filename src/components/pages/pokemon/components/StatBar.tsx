"use client";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color: string;
}

export function StatBar({ label, value, max = 150, color }: StatBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <span className="w-6 text-[9px] font-bold uppercase text-slate-400">{label}</span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right text-[9px] text-slate-500">{value}</span>
    </div>
  );
}
