/**
 * Contrato da paginação: page 0-based, limit por página.
 * Usado na URL (?page=0&limit=10) e no estado da aplicação.
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Metadados derivados da resposta paginada (total, totalPages, etc.).
 * Útil para UI e para desabilitar próximo/anterior.
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  startIndex: number;
  endIndex: number;
}

/**
 * Contrato de resposta paginada do backend.
 * Permite que serviços e handlers tipem as respostas de listagem.
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Cria PaginationMeta a partir de total, page e limit (todos 0-based para page).
 */
export function createPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = total === 0 ? 0 : page * limit + 1;
  const endIndex = Math.min((page + 1) * limit, total);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages - 1,
    hasPrev: page > 0,
    startIndex,
    endIndex,
  };
}
