"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { pokemonService } from "@/lib/api/pokemon.service";
import type { PokemonDetailDto } from "@/lib/api/pokemon.service";
import { usePaginationParams } from "@/lib/pagination";
import { createPaginationMeta } from "@/lib/pagination";
import type { PokedexFilters, ViewMode } from "./types";
import { INIT_FILTERS } from "./data";

export function useDebounce<T>(val: T, ms = 260): T {
  const [dv, setDv] = useState(val);
  useEffect(() => {
    const t = setTimeout(() => setDv(val), ms);
    return () => clearTimeout(t);
  }, [val, ms]);
  return dv;
}

export function usePokedexHandler() {
  const { page, limit, setPage, setLimit } = usePaginationParams();
  const [filters, setFilters] = useState<PokedexFilters>(INIT_FILTERS);
  const [view, setView] = useState<ViewMode>("grid");
  const [list, setList] = useState<PokemonDetailDto[]>([]);
  const [total, setTotal] = useState(0);
  const [capturedIds, setCapturedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<PokemonDetailDto | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const debSearch = useDebounce(filters.search, 400);
  const lastDebSearchRef = useRef(debSearch);
  const lastFetchKeyRef = useRef("");

  useEffect(() => {
    const searchJustChanged = debSearch !== lastDebSearchRef.current;
    if (searchJustChanged) {
      lastDebSearchRef.current = debSearch;
      setPage(0);
    }
    const pageToFetch = searchJustChanged ? 0 : page;
    const fetchKey = `${debSearch}|${pageToFetch}|${filters.type}|${filters.captured}|${limit}`;
    if (fetchKey === lastFetchKeyRef.current) {
      setLoading(false);
      return;
    }
    lastFetchKeyRef.current = fetchKey;

    let cancelled = false;
    setLoading(true);
    pokemonService
      .getAll({
        search: debSearch.trim() || undefined,
        type: filters.type || undefined,
        captured: filters.captured === "all" ? undefined : filters.captured === "captured",
        page: pageToFetch,
        limit,
      })
      .then(res => {
        if (!cancelled) {
          setList(res.data);
          setTotal(res.total);
          setCapturedIds(res.capturedIds ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setList([]);
          setCapturedIds([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debSearch, filters.type, filters.captured, page, limit, setPage]);

  useEffect(() => {
    if (!selectedId || !panelOpen) return;
    let cancelled = false;
    pokemonService
      .getById(selectedId)
      .then(res => {
        if (!cancelled) setDetail(res);
      })
      .catch(() => {
        if (!cancelled) setDetail(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId, panelOpen]);

  useEffect(() => {
    document.body.style.overflow = panelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [panelOpen]);

  const setFilter = useCallback(
    <K extends keyof PokedexFilters>(k: K, v: PokedexFilters[K]) => {
      setFilters(p => ({ ...p, [k]: v }));
      if (k !== "search") setPage(0);
    },
    [setPage]
  );

  const onSelect = useCallback((id: number) => {
    setSelectedId(id);
    setPanelOpen(true);
  }, []);

  const onClosePanel = useCallback(() => {
    setPanelOpen(false);
    setTimeout(() => {
      setSelectedId(null);
      setDetail(null);
    }, 420);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INIT_FILTERS);
    setPage(0);
  }, [setPage]);

  const activeFilterCount = [filters.type !== "", filters.captured !== "all"].filter(Boolean).length;
  const paginationMeta = createPaginationMeta(total, page, limit);

  return {
    list,
    total,
    capturedIds,
    loading,
    detail,
    panelOpen,
    filters,
    view,
    paginationMeta,
    setFilter,
    setView,
    onSelect,
    onClosePanel,
    clearFilters,
    activeFilterCount,
    setPage,
    setLimit,
  };
}
