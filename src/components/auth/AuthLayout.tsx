"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Pokeball } from "@/components/landing/Pokeball";
import { Shield } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-poke-red to-poke-dark-red relative overflow-hidden flex-col items-center justify-center p-12 gap-8">
        <div className="absolute inset-0 pokedex-grid opacity-20" />

        <div className="absolute top-16 left-12 opacity-20">
          <Pokeball size={90} className="animate-float" />
        </div>
        <div className="absolute bottom-24 right-10 opacity-15">
          <Pokeball size={110} className="animate-bounce-slow" />
        </div>
        <div className="absolute top-1/2 right-1/4 opacity-10">
          <Pokeball size={60} className="animate-spin-slow" />
        </div>

        <div className="relative text-white text-center space-y-6 max-w-xs">
          <Pokeball size={80} />
          <h1 className="font-pixel text-lg leading-relaxed">POKE CENTER</h1>
          <p className="text-white/75 text-sm leading-relaxed">
            Exclusive system for authorized trainers and researchers.
          </p>

          <div className="flex items-center gap-2 justify-center text-white/60 text-xs mt-4">
            <Shield className="h-3.5 w-3.5" />
            Secure System • 24/7
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-3 bg-poke-dark-red" />
        <div className="absolute bottom-3 left-0 right-0 h-0.5 bg-black/10" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
        <div className="lg:hidden mb-8 flex flex-col items-center gap-3">
          <Pokeball size={48} />
          <span className="font-pixel text-sm text-poke-red">POKE CENTER</span>
        </div>

        <div
          className={`w-full max-w-md transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-poke-dark-gray/50 transition-colors hover:text-poke-red"
          >
            ← Back to the home page
          </Link>

          <div className="mb-8">
            <h2 className="font-pixel text-xl text-poke-dark-gray leading-snug">{title}</h2>
            <p className="mt-2 text-sm text-poke-dark-gray/60">{subtitle}</p>
          </div>

          <div className="mb-6 h-1 w-12 rounded-full bg-gradient-to-r from-poke-red to-poke-dark-red" />

          {children}
        </div>
      </div>
    </div>
  );
}