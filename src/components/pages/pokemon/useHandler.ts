"use client";

import { useState, useCallback, useEffect } from "react";
import type { PageTab, PokemonData } from "./types";
import { pokemonService } from "@/lib/api/pokemon.service";

export function usePokemonHandler() {
  const [activeTab, setActiveTab] = useState<PageTab>("your-pokemon");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailPokemon, setDetailPokemon] = useState<PokemonData | null>(null);
  const [search, setSearch] = useState("");

  const [myPokemon, setMyPokemon] = useState<PokemonData[]>([]);
  const [wildPokemon, setWildPokemon] = useState<PokemonData[]>([]);
  const [myLoading, setMyLoading] = useState(false);
  const [wildLoading, setWildLoading] = useState(false);

  const fetchMyPokemon = useCallback(async () => {
    setMyLoading(true);
    try {
      const data = await pokemonService.getMyPokemons();
      setMyPokemon(
        data.map((p) => ({ ...p, tag: p.status as PokemonData["tag"] }))
      );
      console.log(data);
    } catch {
      // silently fail; user stays on current state
    } finally {
      setMyLoading(false);
    }
  }, []);

  const fetchWildPokemon = useCallback(async () => {
    setWildLoading(true);
    try {
      const data = await pokemonService.getWildArea();
      setWildPokemon(data.map((p) => ({ ...p, tag: "wild" as const })));
    } catch {
      // silently fail
    } finally {
      setWildLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyPokemon();
    fetchWildPokemon();
  }, [fetchMyPokemon, fetchWildPokemon]);

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

  const handleCatch = useCallback(
    async (pokemon: PokemonData): Promise<boolean> => {
      const response = await pokemonService.catch({
        pokemonId: pokemon.id,
        location: pokemon.location ?? "",
      });
      if (response.caught) {
        await Promise.all([fetchMyPokemon(), fetchWildPokemon()]);
      }
      return response.caught;
    },
    [fetchMyPokemon, fetchWildPokemon]
  );

  const handleCreateSuccess = useCallback(() => {
    fetchMyPokemon();
  }, [fetchMyPokemon]);

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
    myPokemon,
    wildPokemon,
    myLoading,
    wildLoading,
    handleCatch,
    handleCreateSuccess,
  };
}
