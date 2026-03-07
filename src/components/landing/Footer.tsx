"use client";

import { ArrowUp, Shield } from "lucide-react";
import { Pokeball } from "@/components/landing/Pokeball";

const navLinks = [
  { label: "Features", href: "#funcionalidades" },
  { label: "How it Works", href: "#como-funciona" },
  { label: "Pokémon", href: "#pokemons" },
  { label: "Statistics", href: "#estatisticas" },
  { label: "Testimonials", href: "#depoimentos" },
];

const legalLinks = ["Terms of Use", "Privacy Policy", "Restricted Access"];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 text-white py-16 relative">
      <button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-poke-red hover:bg-poke-dark-red rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Pokeball size={35} animate={false} />
              <span className="font-pixel text-sm">POKE CENTER</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Pokémon management system for trainers and researchers.
            </p>
          </div>

          <div>
            <h4 className="font-pixel text-xs text-poke-cyan mb-4">NAVIGATION</h4>
            <ul className="space-y-2">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-slate-400 hover:text-poke-cyan transition-colors text-sm"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-pixel text-xs text-poke-cyan mb-4">LEGAL</h4>
            <ul className="space-y-2">
              {legalLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-poke-cyan transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-pixel text-xs text-poke-cyan mb-4">CONTACT</h4>
            <p className="text-slate-400 text-sm mb-2">support@pokecenter.com</p>
            <p className="text-slate-400 text-sm">24/7 System</p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 Poke Center. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Shield className="w-4 h-4" />
            Secure System
          </div>
        </div>
      </div>
    </footer>
  );
}