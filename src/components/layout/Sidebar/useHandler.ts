"use client";

import { usePathname } from "next/navigation";
import { Home, BookOpen, Layers, Dumbbell } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/auth.context"; 

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Full pathname this item links to. Used to detect the active route. */
  href: string;
}

/**
 * Single source of truth for all sidebar navigation items.
 * To add or remove a route, edit only this array.
 */
export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home, href: "/dashboard" },
  { id: "collections", label: "Collections", icon: Layers, href: "/collections" },
  { id: "pokemons", label: "Pokémon", icon: BookOpen, href: "/pokemon" },
  { id: "train", label: "Train", icon: Dumbbell, href: "/train" },
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
