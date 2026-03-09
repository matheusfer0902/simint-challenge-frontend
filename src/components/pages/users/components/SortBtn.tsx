"use client";

import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import type { SortField, SortDir } from "../types";

export interface SortBtnProps {
  field: SortField;
  current: { field: SortField; dir: SortDir };
  onSort: (f: SortField) => void;
}

const FIELD_LABEL: Record<SortField, string> = {
  name: "User",
  role: "Role",
  email: "Email",
};

export function SortBtn({ field, current, onSort }: SortBtnProps) {
  const active = current.field === field;
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="group flex items-center gap-1 font-pixel text-[8px] uppercase tracking-widest text-slate-400 hover:text-slate-600"
    >
      {FIELD_LABEL[field]}
      {active ? (
        current.dir === "asc" ? (
          <ChevronUp className="h-3 w-3 text-red-500" />
        ) : (
          <ChevronDown className="h-3 w-3 text-red-500" />
        )
      ) : (
        <ChevronsUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100" />
      )}
    </button>
  );
}
