"use client";

import { useAuth } from "@/contexts/auth.context";

export function useDashboardHandler() {
  const { user, logout, isLoading } = useAuth();

  return { user, logout, isLoading };
}
