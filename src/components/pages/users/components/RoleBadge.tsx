"use client";

import { Eye, Users, Shield } from "lucide-react";
import type { UserRole } from "../types";
import { ROLE_BADGE } from "../data";

export interface RoleBadgeProps {
  role: UserRole;
}

const ROLE_ICON: Record<UserRole, React.ReactNode> = {
  admin: <Shield className="h-2.5 w-2.5" />,
  researcher: <Eye className="h-2.5 w-2.5" />,
  trainer: <Users className="h-2.5 w-2.5" />,
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const badgeClass = ROLE_BADGE[role];
  const icon = ROLE_ICON[role];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[9px] ${badgeClass}`}
    >
      {icon}
      {role}
    </span>
  );
}
