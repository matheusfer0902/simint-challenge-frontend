"use client";

import { Users } from "lucide-react";
import type { PaginationMeta } from "@/lib/pagination";

export interface UsersHeaderProps {
  paginationMeta: PaginationMeta;
}

export function UsersHeader({ paginationMeta }: UsersHeaderProps) {
  return (
    <div className="mb-6">
      <nav className="mb-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
        <span>Dashboard</span>
        <span>›</span>
        <span className="font-semibold text-red-500">Usuários</span>
      </nav>
      <h1 className="font-pixel text-2xl text-red-500 sm:text-3xl">
        GERENCIAMENTO DE USUÁRIOS
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Gerencie treinadores e pesquisadores do sistema (apenas admin).
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
          <Users className="h-3 w-3 text-blue-500" />
          {paginationMeta.total} total
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
          Página {paginationMeta.page + 1} de {paginationMeta.totalPages}
        </div>
      </div>
    </div>
  );
}
