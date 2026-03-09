
export interface PaginationParams {
  page: number;
  limit: number;
}

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

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}


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
