"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useUsersHandler } from "./useHandler";
import { UsersContentView } from "./components/UsersContentView";

const SEARCH_DEBOUNCE_MS = 400;

export function UsersPage() {
  const {
    users,
    total,
    page,
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
    totals,
  } = useUsersHandler();

  const [displaySearch, setDisplaySearch] = useState(search);
  useEffect(() => {
    setDisplaySearch(search);
  }, [search]);

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleHeaderSearchChange = useCallback(
    (value: string) => {
      setDisplaySearch(value);
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
        searchDebounceRef.current = null;
        setSearch(value);
      }, SEARCH_DEBOUNCE_MS);
    },
    [setSearch]
  );

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  return (
    <AppLayout
      search={displaySearch}
      onSearchChange={handleHeaderSearchChange}
      searchPlaceholder="Buscar usuários…"
    >
      <UsersContentView
        users={users}
        total={total}
        loading={loading}
        error={error}
        filter={filter}
        sort={sort}
        paginationMeta={totals}
        formOpen={formOpen}
        deleteOpen={deleteOpen}
        editTarget={editTarget}
        delTarget={delTarget}
        saveError={saveError}
        deleteError={deleteError}
        onFilterChange={setFilter}
        onSort={handleSort}
        onPageChange={setPage}
        onEdit={openEdit}
        onDelete={openDelete}
        onNewUser={openCreate}
        onSave={handleSave}
        onConfirmDelete={handleConfirmDelete}
        onCloseForm={closeForm}
        onCloseDelete={closeDelete}
      />
    </AppLayout>
  );
}

export { useUsersHandler, avatarUrl } from "./useHandler";
export type { AppUser, UserRole, UserFilter, SortField, SortDir, SortState } from "./useHandler";
export { ROLE_BADGE, EDITABLE_ROLES, FILTER_OPTIONS } from "./data";
export {
  UsersDataTable,
  UserCard,
  UsersContentView,
  UsersFormModal,
  DeleteUserModal,
  UsersHeader,
  UsersToolbar,
  Avatar,
  RoleBadge,
  SortBtn,
  UsersEmptyState,
  UsersPageStyles,
} from "./components";
