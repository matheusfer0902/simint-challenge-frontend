"use client";

import { Users } from "lucide-react";
import type { PaginationMeta } from "@/lib/pagination";

export interface UsersHeaderProps {
  paginationMeta: PaginationMeta;
}

export function UsersHeader({ paginationMeta }: UsersHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="font-pixel text-2xl text-red-500 sm:text-3xl">
        USER MANAGEMENT
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Manage trainers and researchers in the system.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
          <Users className="h-3 w-3 text-blue-500" />
          {paginationMeta.total} total
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
          Page {paginationMeta.page + 1} of {paginationMeta.totalPages}
        </div>
      </div>
    </div>
  );
}
