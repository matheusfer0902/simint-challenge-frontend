"use client";

import { Heart, CheckCircle2 } from "lucide-react";

export interface SuccessToastProps {
  visible: boolean;
}

export function SuccessToast({ visible }: SuccessToastProps) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
        visible
          ? "scale-100 translate-y-0 opacity-100"
          : "pointer-events-none scale-95 translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 shadow-2xl shadow-emerald-500/40">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <Heart className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-pixel text-[10px] text-white">CURA COMPLETA!</p>
          <p className="mt-0.5 text-xs text-white/80">Seu time está em perfeitas condições! ✨</p>
        </div>
        <CheckCircle2 className="h-6 w-6 text-white/80" />
      </div>
    </div>
  );
}
