"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { PageTab, PokemonData } from "./types";
import type { FilterOption } from "./types";
import type { PokemonDto } from "@/lib/api/pokemon.service";
import { pokemonService } from "@/lib/api/pokemon.service";

export type CountsByFilter = Record<FilterOption, number>;

const VALID_FILTERS: FilterOption[] = ["all", "created", "captured"];
const SEARCH_DEBOUNCE_MS = 400;

function getFilterFromParam(value: string | null): FilterOption {
  if (value && VALID_FILTERS.includes(value as FilterOption)) return value as FilterOption;
  return "all";
}

export function usePokemonHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filter = getFilterFromParam(searchParams.get("filter"));
  const searchFromUrl = searchParams.get("search") ?? "";

  const [activeTab, setActiveTab] = useState<PageTab>("your-pokemon");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailPokemon, setDetailPokemon] = useState<PokemonData | null>(null);
  const [searchInput, setSearchInput] = useState(searchFromUrl);

  const [myPokemon, setMyPokemon] = useState<PokemonData[]>([]);
  const [wildPokemon, setWildPokemon] = useState<PokemonData[]>([]);
  const [myLoading, setMyLoading] = useState(false);
  const [wildLoading, setWildLoading] = useState(false);
  const [counts, setCounts] = useState<CountsByFilter>({ all: 0, created: 0, captured: 0 });
  const [countsLoaded, setCountsLoaded] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateSearchParam = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        next.set("search", value.trim());
      } else {
        next.delete("search");
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  useEffect(() => {
    setSearchInput(searchFromUrl);
  }, [searchFromUrl]);

  const fetchCounts = useCallback(async () => {
    try {
      const data = await pokemonService.getMyPokemons();
      const list = data.map((p) => ({
        ...p,
        region: p.region ?? "",
        location: p.location ?? "",
        tag: p.status as PokemonData["tag"],
      }));
      setCounts({
        all: list.length,
        created: list.filter((p) => p.tag === "created").length,
        captured: list.filter((p) => p.tag === "captured").length,
      });
      setCountsLoaded(true);
    } catch {
      // silently fail
    }
  }, []);

  const fetchMyPokemon = useCallback(async () => {
    setMyLoading(true);
    try {
      const params: { filter?: "created" | "captured"; search?: string } = {};
      if (filter !== "all") params.filter = filter;
      if (searchFromUrl.trim()) params.search = searchFromUrl.trim();
      const data = await pokemonService.getMyPokemons(params);
      setMyPokemon(
        data.map((p) => ({
          ...p,
          region: p.region ?? "",
          location: p.location ?? "",
          tag: p.status as PokemonData["tag"],
        }))
      );
    } catch {
      // silently fail; user stays on current state
    } finally {
      setMyLoading(false);
    }
  }, [filter, searchFromUrl]);

  const fetchWildPokemon = useCallback(async () => {
    setWildLoading(true);
    try {
      const data = await pokemonService.getWildArea();
      setWildPokemon(
        data.map((p) => ({
          ...p,
          region: p.region ?? "",
          location: p.location ?? "",
          tag: "wild" as const,
        }))
      );
    } catch {
      // silently fail
    } finally {
      setWildLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyPokemon();
  }, [fetchMyPokemon]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    fetchWildPokemon();
  }, [fetchWildPokemon]);

  const handleTabChange = useCallback((tab: PageTab) => {
    if (tab === "new-pokemon") {
      setModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  }, []);

  const handleSearchChange = useCallback(
    (v: string) => {
      setSearchInput(v);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        updateSearchParam(v);
      }, SEARCH_DEBOUNCE_MS);
    },
    [updateSearchParam]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const setFilterParam = useCallback(
    (newFilter: FilterOption) => {
      const next = new URLSearchParams(searchParams.toString());
      if (newFilter === "all") {
        next.delete("filter");
      } else {
        next.set("filter", newFilter);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname]
  );

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
        await Promise.all([fetchMyPokemon(), fetchWildPokemon(), fetchCounts()]);
      }
      return response.caught;
    },
    [fetchMyPokemon, fetchWildPokemon, fetchCounts]
  );

  const handleCreateSuccess = useCallback(
    (created?: PokemonDto) => {
      if (created) {
        const withTag: PokemonData = {
          ...created,
          region: created.region ?? "",
          location: created.location ?? "",
          tag: "created" as const,
        };
        setMyPokemon((prev) => [withTag, ...prev]);
        setCounts((c) => ({
          ...c,
          all: c.all + 1,
          created: c.created + 1,
        }));
      } else {
        Promise.all([fetchMyPokemon(), fetchCounts()]);
      }
    },
    [fetchMyPokemon, fetchCounts]
  );

  return {
    activeTab,
    modalOpen,
    setModalOpen,
    detailPokemon,
    setDetailPokemon,
    handleTabChange,
    handleDetails,
    search: searchInput,
    handleSearchChange,
    filter,
    setFilterParam,
    counts,
    countsLoaded,
    myPokemon,
    wildPokemon,
    myLoading,
    wildLoading,
    handleCatch,
    handleCreateSuccess,
  };
}
