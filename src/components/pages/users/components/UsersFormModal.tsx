"use client";

import { useState, useEffect, type FormEvent } from "react";
import { X, Eye, EyeOff, ChevronDown } from "lucide-react";
import type { AppUser, UserRole } from "../types";
import { FORM_BLANK, EDITABLE_ROLES, INPUT_CLASS } from "../data";
import { Field } from "./Field";

function UsersModalShimmer() {
  return (
    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
  );
}

function UsersPokeballSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="#fff" />
      <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#fff" />
      <rect x="5" y="47" width="90" height="6" fill="#000" />
      <circle cx="50" cy="50" r="14" fill="#000" />
      <circle cx="50" cy="50" r="10" fill="#fff" />
      <circle cx="50" cy="50" r="6" fill="#000" />
      <circle cx="50" cy="50" r="3" fill="#fff" />
    </svg>
  );
}

export interface UsersFormModalProps {
  user: AppUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: {
    username: string;
    email: string;
    role: UserRole;
    password?: string;
  }) => void;
  saveError: string | null;
}

export function UsersFormModal({
  user,
  isOpen,
  onClose,
  onSave,
  saveError,
}: UsersFormModalProps) {
  const [form, setForm] = useState(FORM_BLANK);
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(user);

  useEffect(() => {
    if (!isOpen) return;
    setForm(
      user
        ? {
            username: user.username,
            email: user.email,
            role: user.role === "admin" ? "trainer" : user.role,
            password: "",
          }
        : { ...FORM_BLANK }
    );
    setSaving(false);
  }, [user, isOpen]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || form.username.length < 3 || form.username.length > 100) return;
    if (!form.email.trim()) return;
    if (!isEdit && (!form.password || form.password.length < 8)) return;
    setSaving(true);
    try {
      await onSave({
        username: form.username.trim(),
        email: form.email.trim(),
        role: form.role,
        password: form.password || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        style={{ animation: "modalSlideIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-5">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 opacity-[0.07]">
            <UsersPokeballSVG />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-pixel text-[8px] uppercase tracking-widest text-slate-400">
                Poke Center Admin
              </p>
              <h2 className="font-pixel text-[13px] text-white">
                {isEdit ? "EDIT USER" : "NEW USER"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-white/10 p-2 text-white/70 transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {saveError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
              {saveError}
            </div>
          )}

          <Field label="Username">
            <input
              required
              minLength={3}
              maxLength={100}
              value={form.username}
              onChange={(e) => set("username", e.target.value)}
              placeholder="ash_ketchum"
              className={INPUT_CLASS}
            />
          </Field>

          <Field label="Email">
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="ash@example.com"
              className={INPUT_CLASS}
            />
          </Field>

          {!isEdit ? (
            <Field label="Password (min. 8 characters, 1 uppercase, 1 lowercase, 1 special character . , @ - _)">
              <div className="relative">
                <input
                  required
                  minLength={8}
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="••••••••"
                  className={`${INPUT_CLASS} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          ) : (
            <Field label="New password (leave blank to not change)">
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="••••••••"
                  className={`${INPUT_CLASS} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          )}

          <Field label="Role">
            <div className="relative">
              <select
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                className={`${INPUT_CLASS} appearance-none pr-8`}
              >
                {EDITABLE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r === "trainer" ? "Trainer" : "Researcher"}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </Field>

          <button
            type="submit"
            disabled={saving}
            className={`group relative w-full overflow-hidden rounded-xl py-3.5 font-pixel text-[10px] tracking-wider text-white transition-all focus:outline-none active:scale-[0.98] disabled:opacity-60 ${saving ? "bg-emerald-500" : "bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg hover:shadow-red-500/25"}`}
          >
            <UsersModalShimmer />
            <span className="relative flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving…
                </>
              ) : isEdit ? (
                "UPDATE"
              ) : (
                "CREATE USER"
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
