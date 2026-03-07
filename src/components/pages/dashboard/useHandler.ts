"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth.context";
import { BATTLE_CARDS, USER_CARDS } from "./data";
import type { Tab } from "./types";

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useDashboardHandler() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("battle");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 250);

  const filteredBattles = BATTLE_CARDS.filter(
    (c) =>
      c.teamName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.owner.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const filteredUsers = USER_CARDS.filter(
    (u) =>
      u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.region.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const isEmpty =
    (activeTab === "battle" && filteredBattles.length === 0) ||
    (activeTab === "users" && filteredUsers.length === 0);

  return {
    user,
    isLoading,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    filteredBattles,
    filteredUsers,
    isEmpty,
    debouncedSearch,
  };
}
