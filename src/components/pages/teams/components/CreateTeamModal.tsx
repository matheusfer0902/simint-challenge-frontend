"use client";

import { useState } from "react";
import { Plus, X, CheckCheck } from "lucide-react";
import { EmptySlot } from "./EmptySlot";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setName("");
      setDesc("");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md animate-modalIn overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-r from-poke-red to-rose-600 px-6 py-5">
          <div>
            <p className="font-pixel text-[9px] uppercase tracking-widest text-white/70">
              Poke Center
            </p>
            <h2 className="font-pixel text-sm text-white">CREATE NEW TEAM</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white/20 p-2 text-white hover:bg-white/30"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 opacity-10">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <path
                d="M50 5 A45 45 0 0 1 95 50 L50 50 Z"
                fill="#fff"
              />
              <circle cx="50" cy="50" r="10" fill="#fff" />
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="space-y-1.5">
            <label className="block font-pixel text-[9px] uppercase tracking-widest text-slate-500">
              Team Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Thunder Squad"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-poke-red/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block font-pixel text-[9px] uppercase tracking-widest text-slate-500">
              Description
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe your team strategy..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-poke-red/40 focus:bg-white"
            />
          </div>
          <div>
            <p className="mb-2 font-pixel text-[9px] uppercase tracking-widest text-slate-400">
              Pokémon Slots
            </p>
            <div className="flex gap-2">
              {[...Array(6)].map((_, i) => (
                <EmptySlot key={i} />
              ))}
            </div>
            <p className="mt-1.5 text-[10px] text-slate-400">
              You can add Pokémon after creating the team.
            </p>
          </div>
          <button
            type="submit"
            disabled={submitted}
            className={`group relative w-full overflow-hidden rounded-xl py-3 font-pixel text-[10px] tracking-wider text-white transition-all focus:outline-none active:scale-[0.98] disabled:opacity-70 ${
              submitted
                ? "bg-emerald-500"
                : "bg-gradient-to-r from-poke-red to-rose-600 hover:shadow-lg hover:shadow-poke-red/30"
            }`}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <span className="relative flex items-center justify-center gap-2">
              {submitted ? (
                <>
                  <CheckCheck className="h-4 w-4" /> TEAM CREATED!
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> CREATE TEAM
                </>
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
