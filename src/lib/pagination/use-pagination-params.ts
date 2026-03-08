"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { PaginationParams } from "./types";
import {
  parsePaginationFromSearchParams,
  mergeSearchParamsWithPagination,
} from "./url";

export interface UsePaginationParamsReturn extends PaginationParams {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setPageAndLimit: (params: Partial<PaginationParams>) => void;
  /** Atualiza a URL com os params de paginação mantendo os demais (search, filter, etc.) */
  updateUrl: (params: Partial<PaginationParams>) => void;
}

/**
 * Hook que mantém page e limit sincronizados com os query params da URL.
 * Padrão: page=0, limit=10. Pronto para usar em qualquer rota.
 * Princípio: Single source of truth na URL (compartilhável, voltar/avançar do browser).
 */
export function usePaginationParams(): UsePaginationParamsReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { page, limit } = useMemo(
    () => parsePaginationFromSearchParams(searchParams),
    [searchParams]
  );

  const updateUrl = useCallback(
    (params: Partial<PaginationParams>) => {
      const next = mergeSearchParamsWithPagination(searchParams, {
        page,
        limit,
        ...params,
      });
      const q = next.toString();
      router.replace(`${pathname}${q ? `?${q}` : ""}`, { scroll: false });
    },
    [pathname, router, searchParams, page, limit]
  );

  const setPage = useCallback(
    (newPage: number) => {
      if (newPage < 0) return;
      updateUrl({ page: newPage });
    },
    [updateUrl]
  );

  const setLimit = useCallback(
    (newLimit: number) => {
      if (newLimit < 1 || newLimit > 100) return;
      updateUrl({ limit: newLimit, page: 0 });
    },
    [updateUrl]
  );

  const setPageAndLimit = useCallback(
    (params: Partial<PaginationParams>) => {
      updateUrl({ page, limit, ...params });
    },
    [updateUrl, page, limit]
  );

  return {
    page,
    limit,
    setPage,
    setLimit,
    setPageAndLimit,
    updateUrl,
  };
}
