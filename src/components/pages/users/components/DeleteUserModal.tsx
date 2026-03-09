"use client";

import { AlertTriangle } from "lucide-react";
import type { AppUser } from "../types";

export interface DeleteUserModalProps {
  user: AppUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleteError: string | null;
}

export function DeleteUserModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  deleteError,
}: DeleteUserModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
        style={{ animation: "modalSlideIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="font-pixel text-[12px] text-slate-800">EXCLUIR USUÁRIO?</h2>
          <p className="mt-2 text-sm text-slate-600">Você está prestes a excluir</p>
          <p className="mt-0.5 font-bold text-slate-800">&quot;{user.username}&quot;</p>
          {deleteError && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
              {deleteError}
            </div>
          )}
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-xs font-semibold text-red-600">
              ⚠ Esta ação não pode ser desfeita. Todos os dados deste usuário serão removidos
              permanentemente.
            </p>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-slate-200 bg-white py-3 font-pixel text-[9px] tracking-wider text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              CANCELAR
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 py-3 font-pixel text-[9px] tracking-wider text-white shadow-lg transition hover:shadow-xl hover:shadow-red-500/25 active:scale-[0.97]"
            >
              EXCLUIR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
