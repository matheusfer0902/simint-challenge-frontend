"use client";

import { useState } from "react";
import { Link2, Loader2, Copy, Check } from "lucide-react";
import { teamService } from "@/lib/api/team.service";
import { HttpError } from "@/lib/api/http-client";

interface ShareLinkBoxProps {
  teamId: string;
}

export function ShareLinkBox({ teamId }: ShareLinkBoxProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    setError(null);
    setShareUrl(null);
    setLoading(true);
    try {
      const { shareUrl: url } = await teamService.createShareLink(teamId);
      setShareUrl(url);
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.apiError.status === 400) {
          setError("Times públicos não podem ser compartilhados por link.");
          return;
        }
        if (err.apiError.status === 403) {
          setError("Você não pode compartilhar este time.");
          return;
        }
        if (err.apiError.status === 404) {
          setError("Time não encontrado.");
          return;
        }
      }
      setError(
        err instanceof Error ? err.message : "Não foi possível gerar o link."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Não foi possível copiar. Copie o link manualmente.");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-poke-red/5 to-rose-50 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-poke-red/10">
          <Link2 className="h-5 w-5 text-poke-red" />
        </div>
        <div>
          <h3 className="font-pixel text-[11px] text-slate-800">
            SHARE BY LINK
          </h3>
          <p className="text-xs text-slate-500">
            Generate a link for anyone to view this team (read-only).
            When generating a new link, the previous one stops working.
          </p>
        </div>
      </div>
      <div className="space-y-4 p-5">
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {!shareUrl ? (
          <button
            type="button"
            onClick={handleGenerateLink}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-poke-red px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-poke-red/90 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Link2 className="h-4 w-4" />
                Generate Link
              </>
            )}
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Link generated — copy and share
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-700"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-poke-red px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-poke-red/90"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Anyone with the link can view this team. The link does not expire until you generate a new one.
            </p>
            <button
              type="button"
              onClick={handleGenerateLink}
              disabled={loading}
              className="text-xs font-medium text-poke-red hover:underline disabled:opacity-70"
            >
              Generate new link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
