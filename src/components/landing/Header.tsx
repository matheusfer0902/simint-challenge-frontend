"use client";

import { useState, useEffect } from "react";
import { Sparkles, Lock, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pokeball } from "@/components/landing/Pokeball";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Features", id: "funcionalidades" },
  { label: "How it Works", id: "como-funciona" },
  { label: "Pokémon", id: "pokemons" },
  { label: "Statistics", id: "estatisticas" },
  { label: "Testimonials", id: "depoimentos" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pokeball size={45} animate={!isScrolled} />
            <div>
              <h1 className="font-pixel text-sm sm:text-base text-poke-red tracking-tight">
                POKE CENTER
              </h1>
              <p className="text-[10px] text-poke-dark-gray/60 hidden sm:block">
                Management System
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm text-poke-dark-gray/80 hover:text-poke-red transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-poke-dark-gray hover:text-poke-red hover:bg-poke-red/10"
              onClick={() => router.push('/auth/register')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Register
            </Button>
            <Button
              className="bg-poke-red hover:bg-poke-dark-red text-white btn-glow"
              onClick={() => router.push('/auth/login')}
            >
              <Lock className="w-4 h-4 mr-2" />
              Login
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-poke-gray transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-poke-dark-gray" />
            ) : (
              <Menu className="w-6 h-6 text-poke-dark-gray" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-poke-gray/50 pt-4">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm text-poke-dark-gray/80 hover:text-poke-red transition-colors py-2 text-left"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex gap-3 mt-3 pt-3 border-t border-poke-gray/50">
                <Button
                  variant="outline"
                  className="flex-1 border-poke-red text-poke-red hover:bg-poke-red/10"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button className="flex-1 bg-poke-red hover:bg-poke-dark-red text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Register
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}