"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import type { PaginationMeta } from "@/lib/pagination";
import { LIMIT_OPTIONS } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface PaginationControlsProps {
  /** Metadados (total, page 0-based, limit, totalPages, hasNext, hasPrev) */
  meta: PaginationMeta;
  /** Chamado com página 0-based */
  onPageChange: (page: number) => void;
  /** Opcional: chamado ao mudar limit (reseta para página 0) */
  onLimitChange?: (limit: number) => void;
  /** Exibir seletor de itens por página */
  showLimitSelector?: boolean;
  /** Texto "Anterior" / "Próxima" (page é 0-based; exibição "Página X de Y" usa page+1) */
  className?: string;
  /** Classe para o texto "Página X de Y" */
  labelClassName?: string;
}

/**
 * Controles de paginação reutilizáveis: Anterior, Próxima, "Página X de Y" e opcionalmente limit.
 * Page é 0-based internamente; a UI exibe "Página 1 de N" (page + 1).
 */
export function PaginationControls({
  meta,
  onPageChange,
  onLimitChange,
  showLimitSelector = false,
  className,
  labelClassName,
}: PaginationControlsProps) {
  const { total, page, limit, totalPages, hasNext, hasPrev } = meta;
  const displayPage = page + 1; // exibição 1-based para o usuário

  if (total === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
      <Pagination>
        <PaginationContent className="flex flex-wrap items-center gap-2">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasPrev) onPageChange(page - 1);
              }}
              className={cn(!hasPrev && "pointer-events-none opacity-50")}
              aria-disabled={!hasPrev}
            >
              Anterior
            </PaginationPrevious>
          </PaginationItem>
          <PaginationItem>
            <span
              className={cn(
                "px-3 py-2 text-sm text-muted-foreground",
                labelClassName
              )}
              aria-live="polite"
            >
              Página {displayPage} de {totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasNext) onPageChange(page + 1);
              }}
              className={cn(!hasNext && "pointer-events-none opacity-50")}
              aria-disabled={!hasNext}
            >
              Próxima
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {showLimitSelector && onLimitChange && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Por página</span>
          <div className="relative">
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="appearance-none rounded-lg border border-input bg-background py-1.5 pl-2.5 pr-7 text-sm outline-none focus:ring-2 focus:ring-ring"
              aria-label="Itens por página"
            >
              {LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}
