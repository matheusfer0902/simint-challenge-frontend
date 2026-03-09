export type UserRole = "admin" | "trainer" | "researcher";
export type SortField = "name" | "role" | "email";
export type SortDir = "asc" | "desc";
export type UserFilter = "trainer" | "researcher" | "admin";

export interface AppUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface SortState {
  field: SortField;
  dir: SortDir;
}
