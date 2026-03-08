import type { PaginationParams } from "./types";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "./constants";

/** Readonly view dos search params (Next.js useSearchParams().get etc.) */
export interface SearchParamsLike {
  get(name: string): string | null;
  toString(): string;
}

/**
 * Lê page e limit dos query params. Valores inválidos usam o padrão.
 * Page 0-based; limit entre 1 e 100.
 */
export function parsePaginationFromSearchParams(
  searchParams: SearchParamsLike
): PaginationParams {
  const pageRaw = searchParams.get("page");
  const limitRaw = searchParams.get("limit");
  let page = DEFAULT_PAGE;
  let limit = DEFAULT_LIMIT;
  if (pageRaw !== null && pageRaw !== "") {
    const p = parseInt(pageRaw, 10);
    if (!Number.isNaN(p) && p >= 0) page = p;
  }
  if (limitRaw !== null && limitRaw !== "") {
    const l = parseInt(limitRaw, 10);
    if (!Number.isNaN(l) && l >= 1 && l <= 100) limit = l;
  }
  return { page, limit };
}

/**
 * Gera a string de query para page e limit (?page=0&limit=10).
 * Útil para montar URLs em serviços ou links.
 */
export function buildPaginationQueryString(params: PaginationParams): string {
  const q = new URLSearchParams();
  q.set("page", String(params.page));
  q.set("limit", String(params.limit));
  return q.toString();
}

/**
 * Mescla os search params atuais com novos valores de paginação.
 * Preserva outros params (search, filter, etc.).
 */
export function mergeSearchParamsWithPagination(
  current: SearchParamsLike,
  pagination: Partial<PaginationParams>
): URLSearchParams {
  const next = new URLSearchParams(current.toString());
  if (pagination.page !== undefined) next.set("page", String(pagination.page));
  if (pagination.limit !== undefined) next.set("limit", String(pagination.limit));
  return next;
}
