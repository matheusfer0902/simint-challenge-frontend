"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { useAppLayoutHandler } from "./useHandler";

interface AppLayoutProps {
  children: ReactNode;
  /**
   * Search value owned and controlled by the page.
   * Pass it down so the header search bar stays in sync with the page's filter logic.
   */
  search?: string;
  /** Called when the user types in the header search bar. */
  onSearchChange?: (v: string) => void;
  /** Overrides the default search bar placeholder text. */
  searchPlaceholder?: string;
}

/**
 * AppLayout — the authenticated shell.
 *
 * Wraps every protected page with the Sidebar + AppHeader.
 * Pages control their own search state and pass it down via props.
 *
 * Usage:
 * ```tsx
 * export function SomePage() {
 *   const { search, setSearch, ... } = useSomePageHandler();
 *   return (
 *     <AppLayout search={search} onSearchChange={setSearch} searchPlaceholder="Search pokémon...">
 *       {content}
 *     </AppLayout>
 *   );
 * }
 * ```
 */
export function AppLayout({
  children,
  search,
  onSearchChange,
  searchPlaceholder,
}: AppLayoutProps) {
  const { mobileOpen, openMobile, closeMobile } = useAppLayoutHandler();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={closeMobile} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader
          onMobileMenuOpen={openMobile}
          search={search}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
