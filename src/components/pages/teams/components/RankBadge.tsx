"use client";

import { RANK_STYLE } from "../data";
import type { TeamRank } from "../types";

interface RankBadgeProps {
  rank: TeamRank;
}

export function RankBadge({ rank }: RankBadgeProps) {
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${RANK_STYLE[rank]} shadow-md`}
    >
      <span className="font-pixel text-[10px] text-white">{rank}</span>
    </div>
  );
}
