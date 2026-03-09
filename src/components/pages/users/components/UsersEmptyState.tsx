"use client";

export function UsersEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 opacity-25">
        <svg viewBox="0 0 100 100" className="mx-auto h-16 w-16">
          <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="#ef4444" />
          <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#e2e8f0" />
          <rect x="5" y="47" width="90" height="6" fill="#94a3b8" />
          <circle cx="50" cy="50" r="14" fill="#94a3b8" />
          <circle cx="50" cy="50" r="10" fill="#f1f5f9" />
          <circle cx="50" cy="50" r="6" fill="#cbd5e1" />
        </svg>
      </div>
      <p className="font-pixel text-[10px] text-slate-500">No user found</p>
      <p className="mt-1 text-sm text-slate-400">Try adjusting the filters or search term.</p>
    </div>
  );
}
