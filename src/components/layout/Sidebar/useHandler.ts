"use client";

import { usePathname } from "next/navigation";
import { Home, BookOpen, Layers, Dumbbell } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
  { id: "collections", label: "Collections", icon: Layers, href: "/dashboard/collections" },
  { id: "pokemons", label: "Pokémon", icon: BookOpen, href: "/dashboard/pokemon" },
  { id: "train", label: "Train", icon: Dumbbell, href: "/dashboard/train" },
];

export function useSidebarHandler() {
  const pathname = usePathname();

  /**
   * Determines the active nav item from the current URL.
   * The "/dashboard" route requires an exact match to avoid
   * shadowing all child routes (collections, pokemon, train).
   */
  const activeId =
    NAV_ITEMS.find((item) => {
      if (item.href === "/dashboard") return pathname === "/dashboard";
      return pathname === item.href || pathname.startsWith(item.href + "/");
    })?.id ?? "home";

  return { navItems: NAV_ITEMS, activeId };
}
