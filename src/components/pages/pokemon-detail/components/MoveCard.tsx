"use client";

import { getDetailTypeStyle } from "../data";
import type { Move } from "../types";

interface MoveCardProps {
  move: Move;
}

export function MoveCard({ move }: MoveCardProps) {
  const meta = getDetailTypeStyle(move.type);
  return (
    <div
      className={`flex items-center justify-between rounded-xl border bg-gradient-to-r ${meta.gradient} p-0.5 shadow-sm`}
    >
      <div className="flex w-full items-center justify-between rounded-[10px] bg-white/90 px-3 py-2 backdrop-blur-sm">
        <span className="font-pixel text-[9px] text-slate-700">{move.name}</span>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase ${meta.badge}`}
          >
            {move.type}
          </span>
          <span className="text-[9px] text-slate-500">
            PWR{" "}
            <span className="font-bold text-slate-700">{move.power}</span>
          </span>
          <span className="text-[9px] text-slate-400">
            PP <span className="font-medium">{move.pp}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
