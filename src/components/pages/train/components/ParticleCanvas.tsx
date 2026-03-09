"use client";

import { useRef, useEffect } from "react";

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

export interface ParticleCanvasProps {
  trigger: boolean;
  accent: string;
}

export function ParticleCanvas({ trigger, accent }: ParticleCanvasProps) {
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
