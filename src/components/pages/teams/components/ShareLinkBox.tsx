"use client";

import { Share2, Copy, CheckCheck, Globe } from "lucide-react";
import { useCopyLink } from "../useHandler";
import type { Team } from "../types";

interface ShareLinkBoxProps {
  team: Team;
}

export function ShareLinkBox({ team }: ShareLinkBoxProps) {
  const shareUrl = `https://pokecenter.com/teams/${team.shareSlug}`;
  const { copied, copy } = useCopyLink(shareUrl);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-poke-red/5 to-rose-50 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-poke-red/10">
          <Share2 className="h-5 w-5 text-poke-red" />
        </div>
        <div>
          <h3 className="font-pixel text-[11px] text-slate-800">SHARE TEAM</h3>
          <p className="text-xs text-slate-500">
            Share this team with other trainers
          </p>
        </div>
        <div className="ml-auto hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:flex">
          <Globe className="h-3 w-3 text-emerald-500" />
          <span className="text-[10px] font-semibold text-emerald-600">
            Public Link
          </span>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              readOnly
              value={shareUrl}
              className="w-full cursor-default select-all rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-xs text-slate-600 outline-none"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
          </div>
          <button
            type="button"
            onClick={copy}
            className={`flex shrink-0 items-center gap-2 rounded-xl border-2 px-4 py-3 text-[10px] font-bold transition-all duration-200 active:scale-[0.97] focus:outline-none ${
              copied
                ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                : "border-poke-red bg-poke-red text-white hover:bg-poke-dark-red hover:shadow-lg hover:shadow-poke-red/20"
            }`}
          >
            {copied ? (
              <>
                <CheckCheck className="h-3.5 w-3.5" />
                <span className="hidden font-pixel text-[9px] sm:inline">
                  COPIED!
                </span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="hidden font-pixel text-[9px] sm:inline">
                  COPY LINK
                </span>
              </>
            )}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400">Also share via:</span>
          <div className="flex gap-2">
            {["Twitter / X", "Discord", "WhatsApp"].map((platform) => (
              <button
                key={platform}
                type="button"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[9px] font-semibold text-slate-500 transition-all hover:border-slate-300 hover:bg-white hover:text-slate-700"
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
