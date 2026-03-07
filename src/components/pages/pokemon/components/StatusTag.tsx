"use client";

import type { PokemonTag } from "../types";

interface StatusTagProps {
  tag: PokemonTag;
}

export function StatusTag({ tag }: StatusTagProps) {
  if (tag === "wild") return null;
  return (
    <span
      className={`absolute right-2 top-2 z-10 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest shadow-md ${
        tag === "created"
          ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
          : "bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
      }`}
    >
      {tag === "created" ? "CREATED" : "CAPTURED"}
    </span>
  );
}
