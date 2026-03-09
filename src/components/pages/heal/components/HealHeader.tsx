"use client";

export function HealHeader() {
  return (
    <div className="mb-6">
      <nav className="mb-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
        <span>Dashboard</span>
        <span>›</span>
        <span className="font-semibold text-red-500">Recuperação</span>
      </nav>
      <h1 className="font-pixel text-2xl text-red-500 sm:text-3xl">CENTRO DE RECUPERAÇÃO</h1>
      <p className="mt-1.5 text-sm text-slate-500">Restaure a saúde do seu time completo.</p>
    </div>
  );
}
