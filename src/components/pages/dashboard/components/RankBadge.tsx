"use client";

import { RANK_COLORS } from "../data";
import type { BattleCardData } from "../types";

export function RankBadge({ rank }: { rank: BattleCardData["rank"] }) {
  return (
    <div
      className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${RANK_COLORS[rank]} shadow-md`}
    >
      <span className="font-pixel text-[10px] text-white">{rank}</span>
    </div>
  );
}
