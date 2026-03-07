"use client";

import { useState, useCallback } from "react";
import type { PageTab, PokemonData } from "./types";

export function usePokemonHandler() {
  const [activeTab, setActiveTab] = useState<PageTab>("your-pokemon");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailPokemon, setDetailPokemon] = useState<PokemonData | null>(null);
  const [search, setSearch] = useState("");

  const handleTabChange = useCallback((tab: PageTab) => {
    if (tab === "new-pokemon") {
      setModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  }, []);

  const handleSearchChange = useCallback((v: string) => {
    setSearch(v);
  }, []);

  const handleDetails = useCallback((p: PokemonData) => {
    setDetailPokemon(p);
  }, []);

  return {
    activeTab,
    modalOpen,
    setModalOpen,
    detailPokemon,
    setDetailPokemon,
    handleTabChange,
    handleDetails,
    search,
    handleSearchChange,
  };
}
