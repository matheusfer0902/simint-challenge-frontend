"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { useAppLayoutHandler } from "./useHandler";

interface AppLayoutProps {
  children: ReactNode;
  search?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
}

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
