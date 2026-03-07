"use client";

import { useRef } from "react";
import { Search, Bell, Menu, X } from "lucide-react";
import { avatarBg } from "../data";
import { Avatar } from "./Avatar";

interface HeaderProps {
  search: string;
  onSearchChange: (v: string) => void;
  onMobileMenuOpen: () => void;
  userName?: string;
}

export function Header({ search, onSearchChange, onMobileMenuOpen, userName }: HeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-100 bg-white/90 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onMobileMenuOpen}
        className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative flex-1 max-w-lg">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search teams, users..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-poke-red/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"
        />
        {search && (
          <button
            onClick={() => {
              onSearchChange("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button className="relative rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-poke-red ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition-colors hover:border-slate-300">
          <Avatar src={avatarBg(userName ?? "Trainer")} alt={userName ?? "Trainer"} size={28} online />
          <div className="hidden sm:block">
            <p className="text-[11px] font-semibold text-slate-800 leading-none">
              {userName ?? "Trainer"}
            </p>
            <p className="text-[10px] text-emerald-500 leading-none mt-0.5">● Online</p>
          </div>
        </div>
      </div>
    </header>
  );
}
