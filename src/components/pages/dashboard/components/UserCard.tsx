"use client";

import { useState, useCallback } from "react";
import { Zap, MapPin, Star, UserPlus } from "lucide-react";
import type { UserCardData } from "../types";
import { AppButton } from "@/components/shared/AppButton";
import { Avatar } from "./Avatar";

export function UserCard({ user }: { user: UserCardData }) {
  const [following, setFollowing] = useState(user.isFollowing);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const toggleFollow = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setFollowing((f) => !f);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 ${
        hovered ? "-translate-y-1 shadow-lg shadow-slate-200/60" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-20 bg-gradient-to-br from-poke-red/10 via-rose-50 to-slate-100 overflow-hidden">
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 opacity-10">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="#ef4444" />
            <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#fff" />
            <rect x="5" y="47" width="90" height="6" fill="#000" />
            <circle cx="50" cy="50" r="10" fill="#fff" />
            <circle cx="50" cy="50" r="6" fill="#000" />
          </svg>
        </div>

        {user.badges > 0 && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 backdrop-blur-sm">
            <Star className="h-3 w-3 text-yellow-500" />
            <span className="text-[10px] font-semibold text-slate-700">{user.badges} badges</span>
          </div>
        )}
      </div>

      <div className="px-5 pb-5">
        <div className="-mt-8 mb-3 flex justify-center">
          <div
            className={`rounded-full ring-4 ring-white shadow-md transition-transform duration-300 ${
              hovered ? "scale-105" : ""
            }`}
          >
            <Avatar src={user.avatar} alt={user.name} size={64} />
          </div>
        </div>

        <div className="mb-4 text-center">
          <h3 className="font-pixel text-[11px] text-slate-800">{user.name}</h3>
          <p className="mt-1 text-[11px] text-slate-500">{user.title}</p>

          <div className="mt-2 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span className="font-medium text-slate-700">Lv. {user.level}</span>
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <MapPin className="h-3 w-3 text-slate-400" />
              <span>{user.region}</span>
            </div>
          </div>
        </div>

        <AppButton
          variant={following ? "secondary" : "primary"}
          size="md"
          fullWidth
          loading={loading}
          icon={<UserPlus className="h-3.5 w-3.5" />}
          onClick={toggleFollow}
        >
          <span className="font-pixel text-[9px] tracking-wider">
            {following ? "FOLLOWING" : "FOLLOW"}
          </span>
        </AppButton>
      </div>
    </article>
  );
}
