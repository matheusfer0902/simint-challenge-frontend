"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  userService,
  type UserListItemDto,
  type CreateUserDto,
  type UpdateUserDto,
} from "@/lib/api/user.service";
import { HttpError } from "@/lib/api/http-client";
import { usePaginationParams } from "@/lib/pagination";
import { createPaginationMeta } from "@/lib/pagination";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES — alinhados à API (username, sem status/region/createdAt)
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "trainer" | "researcher";
export type SortField = "name" | "role" | "email";
export type SortDir = "asc" | "desc";

export type UserFilter = "trainer" | "researcher" | "admin";

/** Tipo usado na UI; avatar é derivado para exibição. */
export interface AppUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
}

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

function dtoToAppUser(d: UserListItemDto): AppUser {
  return {
    id: d.id,
    username: d.username,
    email: d.email,
    role: d.role as UserRole,
    avatar: avatarUrl(d.username),
  };
}

function parseFilter(value: string | null): UserFilter | "" {
  if (value === "trainer" || value === "researcher" || value === "admin") return value;
  return "";
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER — busca e filtro só no backend; query params ?search=&filter=
// ─────────────────────────────────────────────────────────────────────────────

export { avatarUrl };

export function useUsersHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { page, limit, setPage } = usePaginationParams();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearchState] = useState("");
  const [filter, setFilterState] = useState<UserFilter | "">("");
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({ field: "name", dir: "asc" });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AppUser | null>(null);
  const [delTarget, setDelTarget] = useState<AppUser | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const updateUrl = useCallback(
    (opts: { search?: string; filter?: UserFilter | ""; page?: number }) => {
      const next = new URLSearchParams(searchParams.toString());
      if (opts.search !== undefined) {
        if (opts.search.trim()) next.set("search", opts.search.trim());
        else next.delete("search");
      }
      if (opts.filter !== undefined) {
        if (opts.filter) next.set("filter", opts.filter);
        else next.delete("filter");
      }
      if (opts.page !== undefined) next.set("page", String(opts.page));
      next.set("limit", String(limit));
      const q = next.toString();
      router.replace(`${pathname}${q ? `?${q}` : ""}`, { scroll: false });
    },
    [pathname, router, searchParams, limit]
  );

  const fetchUsers = useCallback(
    async (opts?: { search?: string; filter?: UserFilter | "" }) => {
      setLoading(true);
      setError(null);
      const nextSearch = opts?.search !== undefined ? opts.search : search;
      const nextFilter = opts?.filter !== undefined ? opts.filter : filter;
      try {
        const res = await userService.getUsers({
          page: page + 1,
          limit,
          search: nextSearch.trim() || undefined,
          filter: nextFilter || undefined,
        });
        setUsers(res.data.map(dtoToAppUser));
        setTotal(res.total);
        if (opts?.search !== undefined) setSearchState(opts.search);
        if (opts?.filter !== undefined) setFilterState(opts.filter);
      } catch (err) {
        if (err instanceof HttpError) {
          if (err.apiError.status === 403) setError("Acesso negado. Apenas administradores podem listar usuários.");
          else setError(err.apiError.message ?? "Erro ao carregar usuários.");
        } else {
          setError("Erro ao carregar usuários.");
        }
        setUsers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search, filter]
  );

  useEffect(() => {
    const s = searchParams.get("search") ?? "";
    const f = parseFilter(searchParams.get("filter"));
    setSearchState(s);
    setFilterState(f);
    fetchUsers({ search: s, filter: f });
  }, [searchParams]);

  const setSearch = useCallback(
    (value: string) => {
      setSearchState(value);
      updateUrl({ search: value, page: 0 });
    },
    [updateUrl]
  );

  const setFilter = useCallback(
    (value: UserFilter | "") => {
      setFilterState(value);
      updateUrl({ filter: value, page: 0 });
    },
    [updateUrl]
  );

  const handleSort = useCallback((field: SortField) => {
    setSort((s) => ({ field, dir: s.field === field && s.dir === "asc" ? "desc" : "asc" }));
  }, []);

  const openEdit = useCallback((u: AppUser) => {
    setEditTarget(u);
    setSaveError(null);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((u: AppUser) => {
    setDelTarget(u);
    setDeleteError(null);
    setDeleteOpen(true);
  }, []);

  const openCreate = useCallback(() => {
    setEditTarget(null);
    setSaveError(null);
    setFormOpen(true);
  }, []);

  const handleSave = useCallback(
    async (payload: { username: string; email: string; role: UserRole; password?: string }) => {
      setSaveError(null);
      try {
        if (editTarget) {
          const body: UpdateUserDto = {
            username: payload.username.trim(),
            email: payload.email.trim(),
          };
          if (editTarget.role !== "admin" && payload.role !== "admin") body.role = payload.role;
          if (payload.password && payload.password.length > 0) body.password = payload.password;
          await userService.updateUser(editTarget.id, body);
        } else {
          if (!payload.password || payload.password.length < 8) {
            setSaveError("Senha é obrigatória e deve ter no mínimo 8 caracteres.");
            return;
          }
          const body: CreateUserDto = {
            username: payload.username.trim(),
            email: payload.email.trim(),
            password: payload.password,
            role: payload.role === "admin" ? "trainer" : payload.role,
          };
          await userService.createUser(body);
        }
        setFormOpen(false);
        setEditTarget(null);
        await fetchUsers();
      } catch (err) {
        if (err instanceof HttpError) {
          setSaveError(err.apiError.message ?? "Erro ao salvar.");
        } else {
          setSaveError("Erro ao salvar usuário.");
        }
      }
    },
    [editTarget, fetchUsers]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!delTarget) return;
    setDeleteError(null);
    try {
      await userService.deleteUser(delTarget.id);
      setDeleteOpen(false);
      setDelTarget(null);
      await fetchUsers();
    } catch (err) {
      if (err instanceof HttpError) {
        setDeleteError(err.apiError.message ?? "Erro ao excluir.");
      } else {
        setDeleteError("Erro ao excluir usuário.");
      }
    }
  }, [delTarget, fetchUsers]);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditTarget(null);
    setSaveError(null);
  }, []);

  const closeDelete = useCallback(() => {
    setDeleteOpen(false);
    setDelTarget(null);
    setDeleteError(null);
  }, []);

  // Ordenação apenas no cliente (sobre a lista retornada pelo backend)
  const sortedUsers = [...users].sort((a, b) => {
    const dir = sort.dir === "asc" ? 1 : -1;
    if (sort.field === "name") return a.username.localeCompare(b.username) * dir;
    if (sort.field === "role") return a.role.localeCompare(b.role) * dir;
    if (sort.field === "email") return a.email.localeCompare(b.email) * dir;
    return 0;
  });

  const totals = createPaginationMeta(total, page, limit);

  return {
    users: sortedUsers,
    total,
    page,
    limit,
    setPage,
    loading,
    error,
    search,
    setSearch,
    filter,
    setFilter,
    sort,
    handleSort,
    formOpen,
    deleteOpen,
    editTarget,
    delTarget,
    openEdit,
    openDelete,
    openCreate,
    handleSave,
    handleConfirmDelete,
    closeForm,
    closeDelete,
    saveError,
    deleteError,
    fetchUsers,
    totals,
  };
}
