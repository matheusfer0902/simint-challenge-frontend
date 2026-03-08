"use client";

import { useState } from "react";
import { Share2, Loader2 } from "lucide-react";
import type { Team } from "../types";

interface ShareTeamBoxProps {
  team: Team;
  onShare: (teamId: string, sharedWithUserId: string) => Promise<void>;
}

export function ShareTeamBox({ team, onShare }: ShareTeamBoxProps) {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = userId.trim();
    if (!trimmed) return;
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await onShare(team.id, trimmed);
      setSuccess(true);
      setUserId("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao compartilhar. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-poke-red/5 to-rose-50 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-poke-red/10">
          <Share2 className="h-5 w-5 text-poke-red" />
        </div>
        <div>
          <h3 className="font-pixel text-[11px] text-slate-800">
            COMPARTILHAR TIME
          </h3>
          <p className="text-xs text-slate-500">
            Informe o UUID do usuário para dar acesso de visualização.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            Time compartilhado com sucesso.
          </p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="UUID do usuário"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-700 outline-none transition-all focus:border-poke-red/40 focus:bg-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-poke-red px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-poke-red/90 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Compartilhar"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
