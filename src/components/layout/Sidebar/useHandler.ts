"use client";

import { usePathname } from "next/navigation";
import { Home, BookOpen, Layers, Dumbbell, List, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/auth.context"; 

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home, href: "/dashboard" },
  { id: "teams", label: "Teams", icon: Layers, href: "/teams" },
  { id: "pokemons", label: "Pokémon", icon: BookOpen, href: "/pokemon" },
  { id: "pokedex", label: "Pokedex", icon: List, href: "/pokedex" },
  { id: "train", label: "Train", icon: Dumbbell, href: "/train" },
  { id: "heal", label: "Heal", icon: Heart, href: "/healing" },
];

export function useSidebarHandler() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  const activeId =
    NAV_ITEMS.find((item) => {
      if (item.href === "/dashboard") return pathname === "/dashboard";
      return pathname === item.href || pathname.startsWith(item.href + "/");
    })?.id ?? "home";

  return { navItems: NAV_ITEMS, activeId, user, logout, isLoading };
}
