import type { Role } from "./types";
import { ALLOWED_PATHS_BY_ROLE } from "./constants";

export function canAccess(role: Role, pathname: string): boolean {
  const allowed = ALLOWED_PATHS_BY_ROLE[role];
  return allowed.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
