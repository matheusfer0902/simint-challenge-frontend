"use client";

import { PlusCircle } from "lucide-react";

export function EmptySlot() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
      <PlusCircle className="h-4 w-4 text-slate-300" />
    </div>
  );
}
