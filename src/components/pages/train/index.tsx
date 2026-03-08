"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Heart,
  Shield,
  Swords,
  Star,
  Candy,
  TrendingUp,
  Flame,
  Dumbbell,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTrainHandler, type TrainPokemon, type TrainState } from "./useHandler";

// ─────────────────────────────────────────────────────────────────────────────
// TYPE META
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, { gradient: string; glow: string; accent: string; badge: string }> = {
  electric: { gradient: "from-yellow-400 to-amber-500", glow: "rgba(245,158,11,0.55)", accent: "#f59e0b", badge: "bg-yellow-100 text-yellow-800" },
  fire: { gradient: "from-orange-500 to-red-500", glow: "rgba(249,115,22,0.5)", accent: "#f97316", badge: "bg-orange-100 text-orange-800" },
  grass: { gradient: "from-emerald-500 to-green-600", glow: "rgba(16,185,129,0.5)", accent: "#10b981", badge: "bg-emerald-100 text-emerald-800" },
  water: { gradient: "from-blue-500 to-cyan-500", glow: "rgba(59,130,246,0.5)", accent: "#3b82f6", badge: "bg-blue-100 text-blue-800" },
  ghost: { gradient: "from-violet-600 to-indigo-700", glow: "rgba(124,58,237,0.55)", accent: "#7c3aed", badge: "bg-violet-100 text-violet-800" },
  dragon: { gradient: "from-violet-500 to-purple-700", glow: "rgba(109,40,217,0.5)", accent: "#6d28d9", badge: "bg-purple-100 text-purple-800" },
  poison: { gradient: "from-fuchsia-500 to-purple-600", glow: "rgba(192,38,211,0.45)", accent: "#c026d3", badge: "bg-fuchsia-100 text-fuchsia-800" },
  normal: { gradient: "from-slate-400 to-zinc-600", glow: "rgba(100,116,139,0.35)", accent: "#64748b", badge: "bg-slate-100 text-slate-700" },
  flying: { gradient: "from-sky-400 to-blue-500", glow: "rgba(14,165,233,0.45)", accent: "#0ea5e9", badge: "bg-sky-100 text-sky-800" },
  psychic: { gradient: "from-pink-500 to-rose-600", glow: "rgba(236,72,153,0.5)", accent: "#ec4899", badge: "bg-pink-100 text-pink-800" },
  ice: { gradient: "from-cyan-400 to-blue-500", glow: "rgba(6,182,212,0.45)", accent: "#06b6d4", badge: "bg-cyan-100 text-cyan-800" },
};
const getTC = (t: string) => TYPE_COLORS[t.toLowerCase()] ?? TYPE_COLORS.normal;

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLE CANVAS
// ─────────────────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  decay: number;
}

function ParticleCanvas({ trigger, accent }: { trigger: boolean; accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const isRunning = useRef(false);

  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;
    const cx = w / 2;
    const cy = h * 0.38;

    const palette = [accent, "#fff", "#fbbf24", "#f9a8d4", "#a5f3fc", "#fdba74"];

    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 7 + 2,
        alpha: 1,
        color: palette[Math.floor(Math.random() * palette.length)],
        decay: 1 / (Math.random() * 50 + 35),
      });
    }

    if (isRunning.current) return;
    isRunning.current = true;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.vx *= 0.99;
        p.alpha = Math.max(0, p.alpha - p.decay);

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.size > 5) {
          ctx.font = `${p.size * 1.8}px serif`;
          ctx.fillText("✦", p.x - p.size * 0.5, p.y + p.size * 0.5);
        }
      }
      ctx.globalAlpha = 1;

      if (particlesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        isRunning.current = false;
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, accent]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// XP BAR
// ─────────────────────────────────────────────────────────────────────────────

function XpBar({
  xp,
  xpToNext,
  isLevelUp,
  accent,
}: {
  xp: number;
  xpToNext: number;
  isLevelUp: boolean;
  accent: string;
}) {
  const raw = isLevelUp ? 1 : Math.min(xp / xpToNext, 1);
  const pct = raw * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-pixel text-[8px] uppercase tracking-widest text-slate-400">EXP</span>
        <span className="font-pixel text-[10px] text-slate-600">
          {isLevelUp ? xpToNext : xp} / {xpToNext}
        </span>
      </div>

      <div className="relative h-5 overflow-hidden rounded-full bg-slate-900/80 shadow-inner">
        <div
          className="h-full rounded-full transition-all ease-out"
          style={{
            width: `${pct}%`,
            transitionDuration: isLevelUp ? "1.1s" : "0.9s",
            background: `linear-gradient(90deg, ${accent}cc, ${accent})`,
            boxShadow: `0 0 10px ${accent}88`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full animate-xpShimmer"
            style={{ backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-pixel text-[8px] text-white/80 mix-blend-screen drop-shadow">{Math.round(pct)}%</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POKEMON SELECTOR
// ─────────────────────────────────────────────────────────────────────────────

function PokemonSelector({
  roster,
  selected,
  onChange,
}: {
  roster: TrainPokemon[];
  selected: number;
  onChange: (i: number) => void;
}) {
  const prev = () => onChange((selected - 1 + roster.length) % roster.length);
  const next = () => onChange((selected + 1) % roster.length);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={prev}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm text-slate-500 transition hover:border-red-200 hover:text-red-500 active:scale-90"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex flex-1 items-center gap-2 overflow-x-auto scroll-smooth py-1 no-scrollbar">
        {roster.map((p, i) => {
          const tc = getTC(p.type);
          const active = i === selected;
          return (
            <button
              key={p.id}
              onClick={() => onChange(i)}
              className={`relative flex shrink-0 flex-col items-center gap-1 rounded-2xl border-2 px-3 py-2.5 transition-all duration-200
                ${active ? `border-transparent bg-gradient-to-br ${tc.gradient} shadow-lg scale-[1.08]` : "border-slate-200 bg-white hover:border-slate-300 hover:scale-[1.02]"}`}
            >
              <img src={p.sprite} alt={p.name} className="h-10 w-10 object-contain drop-shadow" loading="lazy" />
              <span className={`font-pixel text-[7px] leading-none ${active ? "text-white" : "text-slate-600"}`}>
                {p.name.slice(0, 7).toUpperCase()}
              </span>
              <span className={`text-[8px] ${active ? "text-white/80" : "text-slate-400"}`}>Lv.{p.level}</span>
              <div className="h-1.5 w-full rounded-full overflow-hidden bg-black/20">
                <div className="h-full rounded-full bg-white/70" style={{ width: `${Math.round((p.xp / p.xpToNext) * 100)}%` }} />
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={next}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm text-slate-500 transition hover:border-red-200 hover:text-red-500 active:scale-90"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GYM STAGE
// ─────────────────────────────────────────────────────────────────────────────

function GymStage({
  pokemon,
  state,
  onTrain,
}: {
  pokemon: TrainPokemon;
  state: TrainState;
  onTrain: () => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const tc = getTC(pokemon.type);
  const isBusy = state.phase !== "idle";

  const spriteClass =
    state.phase === "bouncing"
      ? "animate-pokeBounce"
      : state.phase === "level-up"
        ? "animate-levelPop"
        : state.phase === "celebrating"
          ? "animate-levelPop"
          : "animate-pokeBreath";

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-500"
            style={{ background: tc.glow, opacity: state.phase === "bouncing" ? 0.7 : 0.25 }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 1px,transparent 4px)",
            }}
          />
          <div className="absolute bottom-3 left-5 text-5xl opacity-[0.06] select-none">🏋️</div>
          <div className="absolute bottom-3 right-5 text-5xl opacity-[0.06] select-none">⚡</div>
        </div>

        <div className="absolute inset-0">
          <ParticleCanvas trigger={state.particles} accent={tc.accent} />
        </div>

        <div className="relative flex items-center justify-center py-14 sm:py-16">
          {!imgLoaded && <div className="h-48 w-48 animate-pulse rounded-full bg-white/5" />}
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            key={pokemon.id}
            onLoad={() => setImgLoaded(true)}
            className={`relative z-10 select-none object-contain drop-shadow-2xl transition-[opacity] duration-500
              ${imgLoaded ? "opacity-100" : "opacity-0 absolute"}
              ${spriteClass}
            `}
            style={{ width: 200, height: 200 }}
          />
          {state.xpGained > 0 && state.phase === "idle" && (
            <div className="pointer-events-none absolute right-8 top-8 animate-floatAway">
              <span
                className="rounded-xl px-3 py-1.5 font-pixel text-[10px] text-slate-900 shadow-lg"
                style={{ background: tc.accent }}
              >
                +{state.xpGained} EXP ✦
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3">
          <div className="flex items-center gap-2">
            {[pokemon.type, pokemon.secondType].filter(Boolean).map((t) => (
              <span
                key={t}
                className={`rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${getTC(t!).badge}`}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
            <Zap className="h-3 w-3 text-yellow-400" />
            <span className="font-pixel text-[9px] text-white/80">LVL {state.level}</span>
          </div>
        </div>

        <LevelUpOverlay level={state.level} isActive={state.phase === "level-up"} />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-pixel text-xl text-slate-800">{pokemon.name.toUpperCase()}</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              #{String(pokemon.id).padStart(3, "0")} · {pokemon.type}
            </p>
          </div>
          <div
            className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${tc.accent}dd, ${tc.accent})` }}
          >
            <span className="font-pixel text-xl leading-none">{state.level}</span>
            <span className="font-pixel text-[7px] leading-none text-white/70 mt-0.5">LVL</span>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-around rounded-xl bg-slate-50 py-3">
          {[
            { icon: <Heart className="h-3.5 w-3.5" />, label: "HP", value: pokemon.hp, color: "text-emerald-600 bg-emerald-100" },
            { icon: <Swords className="h-3.5 w-3.5" />, label: "ATK", value: pokemon.attack, color: "text-red-600 bg-red-100" },
            { icon: <Shield className="h-3.5 w-3.5" />, label: "DEF", value: pokemon.defense, color: "text-blue-600 bg-blue-100" },
            { icon: <Zap className="h-3.5 w-3.5" />, label: "SPD", value: pokemon.speed, color: "text-yellow-600 bg-yellow-100" },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${color}`}>{icon}</div>
              <span className="font-pixel text-[7px] text-slate-400 uppercase">{label}</span>
              <span className="font-pixel text-[11px] text-slate-700">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2.5">
          <button
            onClick={onTrain}
            disabled={isBusy}
            className={`group relative w-full overflow-hidden rounded-2xl py-4 font-pixel text-[11px] tracking-widest text-white shadow-xl transition-all duration-200 focus:outline-none
              active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60
              ${isBusy ? "bg-slate-600" : `bg-gradient-to-r ${tc.gradient} hover:scale-[1.01] hover:shadow-2xl`}`}
            style={{ boxShadow: isBusy ? undefined : `0 8px 32px ${tc.glow}` }}
          >
            <Shimmer />
            <span className="relative flex items-center justify-center gap-2.5">
              {state.phase === "bouncing" || state.phase === "xp-fill" ? (
                <>
                  <Spinner /> TREINANDO...
                </>
              ) : (
                <>
                  <Candy className="h-4 w-4" /> DAR RARE CANDY <TrendingUp className="h-4 w-4" />
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL UP OVERLAY
// ─────────────────────────────────────────────────────────────────────────────

function LevelUpOverlay({ level, isActive }: { level: number; isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl bg-black/75 backdrop-blur-[2px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-3 w-3 rounded-sm animate-confettiFall"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-12px",
              background: ["#fbbf24", "#ef4444", "#34d399", "#60a5fa", "#f472b6", "#a78bfa", "#fb923c"][i % 7],
              animationDelay: `${(Math.random() * 0.6).toFixed(2)}s`,
              animationDuration: `${(Math.random() * 1.2 + 1.4).toFixed(2)}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex h-24 w-24 animate-levelPopBig items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-2xl shadow-yellow-400/50">
          <Star className="h-12 w-12 text-white" />
        </div>
        <p className="font-pixel text-[15px] animate-levelBlink text-yellow-400 drop-shadow-lg">LEVEL UP!</p>
        <p className="font-pixel text-6xl text-white drop-shadow-2xl leading-none">{level}</p>
        <p className="text-sm text-white/70 font-semibold">Parabéns! 🎉</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI
// ─────────────────────────────────────────────────────────────────────────────

function Shimmer() {
  return (
    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
  );
}

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />;
}

const CSS_KEYFRAMES = `
  @keyframes pokeBreath {
    0%,100% { transform: scale(1)    translateY(0px); }
    50%     { transform: scale(1.05) translateY(-8px); }
  }
  .animate-pokeBreath { animation: pokeBreath 3.2s ease-in-out infinite; }

  @keyframes pokeBounce {
    0%   { transform: scale(1)    translateY(0);    }
    15%  { transform: scale(0.85) translateY(0);    }
    45%  { transform: scale(1.18) translateY(-36px);}
    65%  { transform: scale(0.95) translateY(-10px);}
    80%  { transform: scale(1.05) translateY(-4px); }
    100% { transform: scale(1)    translateY(0);    }
  }
  .animate-pokeBounce { animation: pokeBounce 0.65s cubic-bezier(0.36,0.07,0.19,0.97) forwards; }

  @keyframes levelPop {
    0%,100% { transform: scale(1);    }
    30%     { transform: scale(0.80); }
    60%     { transform: scale(1.25); }
    80%     { transform: scale(0.95); }
  }
  .animate-levelPop { animation: levelPop 0.5s ease-out; }

  @keyframes levelPopBig {
    0%   { transform: scale(0);    opacity: 0; }
    60%  { transform: scale(1.25); opacity: 1; }
    100% { transform: scale(1);    opacity: 1; }
  }
  .animate-levelPopBig { animation: levelPopBig 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }

  @keyframes levelBlink {
    0%,100% { opacity: 1;   transform: scale(1);    }
    50%     { opacity: 0.3; transform: scale(1.06); }
  }
  .animate-levelBlink { animation: levelBlink 0.55s ease-in-out infinite; }

  @keyframes confettiFall {
    0%   { transform: translateY(0)    rotate(0deg);   opacity: 1; }
    100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
  }
  .animate-confettiFall { animation: confettiFall linear forwards; }

  @keyframes xpShimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(300%);  }
  }
  .animate-xpShimmer { animation: xpShimmer 2s ease-in-out infinite; }

  @keyframes floatAway {
    0%   { opacity: 1; transform: translateY(0)    scale(1);    }
    80%  { opacity: 1; transform: translateY(-28px) scale(1.05); }
    100% { opacity: 0; transform: translateY(-50px) scale(0.9);  }
  }
  .animate-floatAway { animation: floatAway 1.8s ease-out forwards; }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// TRAINING PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function TrainingPage() {
  const { roster, loading, selectedIdx, setSelectedIdx, pokemon, state, train, trainError, clearTrainError } = useTrainHandler();

  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <nav className="mb-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>Dashboard</span>
            <span>›</span>
            <span className="font-semibold text-red-500">Treinamento</span>
          </nav>
          <h1 className="font-pixel text-2xl text-red-500 sm:text-3xl">ÁREA DE TREINAMENTO</h1>
          <p className="mt-1.5 text-sm text-slate-500">Fortaleça seu time. Cada candy conta.</p>
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-red-500/30 via-slate-200 to-transparent" />

        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-500/30 border-t-red-500" />
          </div>
        ) : roster.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 py-12 text-center">
            <p className="text-slate-600">Você ainda não tem Pokémon para treinar.</p>
            <p className="mt-1 text-sm text-slate-400">Capture ou crie Pokémon na área de Pokémon.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="mb-3 font-pixel text-[8px] uppercase tracking-widest text-slate-400">Selecione o Pokémon</p>
              <PokemonSelector roster={roster} selected={selectedIdx} onChange={setSelectedIdx} />
            </div>

            {pokemon && (
              <>
                {trainError && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {trainError}
                    <button type="button" onClick={clearTrainError} className="ml-2 underline">Fechar</button>
                  </div>
                )}
                <GymStage pokemon={pokemon} state={state} onTrain={train} />
              </>
            )}
          </>
        )}
      </div>

      <style>{CSS_KEYFRAMES}</style>
    </AppLayout>
  );
}
