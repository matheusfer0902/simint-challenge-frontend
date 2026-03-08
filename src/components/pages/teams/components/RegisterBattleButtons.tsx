"use client";

import { useState } from "react";
import { Trophy, XCircle, Loader2 } from "lucide-react";

interface RegisterBattleButtonsProps {
  teamId: string;
  onRegister: (teamId: string, result: "win" | "loss") => Promise<void>;
}

export function RegisterBattleButtons({
  teamId,
  onRegister,
}: RegisterBattleButtonsProps) {
  const [loading, setLoading] = useState<"win" | "loss" | null>(null);

  const handle = async (result: "win" | "loss") => {
    setLoading(result);
    try {
      await onRegister(teamId, result);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Registrar batalha
      </span>
      <button
        type="button"
        onClick={() => handle("win")}
        disabled={loading !== null}
        className="flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-200 disabled:opacity-50"
      >
        {loading === "win" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trophy className="h-3.5 w-3.5" />
        )}
        Vitória
      </button>
      <button
        type="button"
        onClick={() => handle("loss")}
        disabled={loading !== null}
        className="flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-200 disabled:opacity-50"
      >
        {loading === "loss" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <XCircle className="h-3.5 w-3.5" />
        )}
        Derrota
      </button>
    </div>
  );
}
