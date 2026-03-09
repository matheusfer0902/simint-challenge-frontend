"use client";

import type { AppUser, SortField, SortDir, UserFilter, UserRole } from "../types";
import type { PaginationMeta } from "@/lib/pagination";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { UsersHeader } from "./UsersHeader";
import { UsersToolbar } from "./UsersToolbar";
import { UsersDataTable } from "./UsersDataTable";
import { UserCard } from "./UserCard";
import { UsersEmptyState } from "./UsersEmptyState";
import { UsersFormModal } from "./UsersFormModal";
import { DeleteUserModal } from "./DeleteUserModal";
import { UsersPageStyles } from "./UsersPageStyles";

export interface UsersContentViewProps {
  users: AppUser[];
  total: number;
  loading: boolean;
  error: string | null;
  filter: UserFilter | "";
  sort: { field: SortField; dir: SortDir };
  paginationMeta: PaginationMeta;
  formOpen: boolean;
  deleteOpen: boolean;
  editTarget: AppUser | null;
  delTarget: AppUser | null;
  saveError: string | null;
  deleteError: string | null;
  onFilterChange: (value: UserFilter | "") => void;
  onSort: (f: SortField) => void;
  onPageChange: (page: number) => void;
  onEdit: (u: AppUser) => void;
  onDelete: (u: AppUser) => void;
  onNewUser: () => void;
  onSave: (payload: {
    username: string;
    email: string;
    role: UserRole;
    password?: string;
  }) => void;
  onConfirmDelete: () => void;
  onCloseForm: () => void;
  onCloseDelete: () => void;
}

export function UsersContentView({
  users,
  total,
  loading,
  error,
  filter,
  sort,
  paginationMeta,
  formOpen,
  deleteOpen,
  editTarget,
  delTarget,
  saveError,
  deleteError,
  onFilterChange,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
  onNewUser,
  onSave,
  onConfirmDelete,
  onCloseForm,
  onCloseDelete,
}: UsersContentViewProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <UsersHeader paginationMeta={paginationMeta} />

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <UsersToolbar
        filter={filter}
        onFilterChange={onFilterChange}
        onNewUser={onNewUser}
      />

      <p className="mb-3 text-xs text-slate-400">
        Showing <span className="font-semibold text-slate-600">{users.length}</span> of {total}{" "}
        users
      </p>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-24">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
        </div>
      ) : (
        <>
          <UsersDataTable
            users={users}
            sort={sort}
            onSort={onSort}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          <div className="space-y-3 sm:hidden">
            {users.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 text-center">
                <UsersEmptyState />
              </div>
            )}
            {users.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                onEdit={() => onEdit(u)}
                onDelete={() => onDelete(u)}
              />
            ))}
          </div>

          {paginationMeta.totalPages > 1 && (
            <div className="mt-4">
              <PaginationControls
                meta={paginationMeta}
                onPageChange={onPageChange}
                showLimitSelector={false}
              />
            </div>
          )}
        </>
      )}

      <UsersFormModal
        user={editTarget}
        isOpen={formOpen}
        onClose={onCloseForm}
        onSave={onSave}
        saveError={saveError}
      />
      <DeleteUserModal
        user={delTarget}
        isOpen={deleteOpen}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
        deleteError={deleteError}
      />

      <UsersPageStyles />
    </div>
  );
}
