"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { AppUser } from "../types";
import { Avatar } from "./Avatar";
import { RoleBadge } from "./RoleBadge";

export interface UserCardProps {
  user: AppUser;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm sm:hidden">
      <div
        className={`h-1 w-full ${
          user.role === "admin"
            ? "bg-purple-400"
            : user.role === "researcher"
              ? "bg-sky-400"
              : "bg-emerald-400"
        }`}
      />
      <div className="flex items-start gap-3 p-4">
        <Avatar src={user.avatar} name={user.username} size={44} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-800">{user.username}</p>
          <p className="truncate text-xs text-slate-400">{user.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <RoleBadge role={user.role} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-2 text-slate-400 hover:bg-sky-50 hover:text-sky-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
