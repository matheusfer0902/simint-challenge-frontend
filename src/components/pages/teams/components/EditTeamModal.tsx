"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Team } from "../types";

interface EditTeamModalProps {
  team: Team;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => void | Promise<void>;
}

export function EditTeamModal({
  team,
  isOpen,
  onClose,
  onSave,
}: EditTeamModalProps) {
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(team.name);
      setDescription(team.description ?? "");
    }
  }, [isOpen, team.name, team.description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ name, description });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

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
              Edit Team
            </p>
            <h2 className="font-pixel text-sm text-white">EDIT TEAM</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white/20 p-2 text-white hover:bg-white/30"
          >
            <X className="h-5 w-5" />
          </button>
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
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-poke-red/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block font-pixel text-[9px] uppercase tracking-widest text-slate-500">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-poke-red/40 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-r from-poke-red to-rose-600 py-3 font-pixel text-[10px] tracking-wider text-white transition-all hover:shadow-lg hover:shadow-poke-red/30 focus:outline-none active:scale-[0.98] disabled:opacity-70"
          >
            {saving ? "SALVANDO..." : "SAVE CHANGES"}
          </button>
        </form>
      </div>
    </div>
  );
}
