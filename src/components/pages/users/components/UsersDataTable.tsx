"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { AppUser, SortField, SortDir } from "../types";
import { Avatar } from "./Avatar";
import { RoleBadge } from "./RoleBadge";
import { SortBtn } from "./SortBtn";
import { UsersEmptyState } from "./UsersEmptyState";

export interface UsersDataTableProps {
  users: AppUser[];
  sort: { field: SortField; dir: SortDir };
  onSort: (f: SortField) => void;
  onEdit: (u: AppUser) => void;
  onDelete: (u: AppUser) => void;
}

export function UsersDataTable({ users, sort, onSort, onEdit, onDelete }: UsersDataTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm sm:block">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80">
            <th className="px-5 py-3.5 text-left">
              <SortBtn field="name" current={sort} onSort={onSort} />
            </th>
            <th className="px-5 py-3.5 text-left">
              <SortBtn field="role" current={sort} onSort={onSort} />
            </th>
            <th className="px-5 py-3.5 text-left">
              <SortBtn field="email" current={sort} onSort={onSort} />
            </th>
            <th className="sticky right-0 bg-slate-50/90 px-5 py-3.5 text-right">
              <span className="font-pixel text-[8px] uppercase tracking-widest text-slate-400">
                Ações
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 bg-white">
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="py-20 text-center">
                <UsersEmptyState />
              </td>
            </tr>
          )}
          {users.map((u, i) => (
            <tr
              key={u.id}
              className={`group transition-colors hover:bg-blue-50/30 ${i % 2 ? "bg-slate-50/20" : "bg-white"}`}
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <Avatar src={u.avatar} name={u.username} />
                  <div>
                    <p className="font-semibold leading-tight text-slate-800">{u.username}</p>
                    <p className="text-[11px] leading-tight text-slate-400">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5">
                <RoleBadge role={u.role} />
              </td>
              <td className="px-5 py-3.5 text-xs text-slate-600">{u.email}</td>
              <td className="sticky right-0 bg-white px-5 py-3.5 group-hover:bg-blue-50/30">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(u)}
                    className="rounded-lg p-2 text-slate-400 transition-all hover:bg-sky-50 hover:text-sky-600"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(u)}
                    className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
