import type { UserRole } from "./types";

export const ROLE_BADGE: Record<UserRole, string> = {
  admin: "border border-purple-200 bg-purple-100 text-purple-800",
  researcher: "border border-sky-200 bg-sky-100 text-sky-800",
  trainer: "border border-emerald-200 bg-emerald-100 text-emerald-800",
};

export const EDITABLE_ROLES: UserRole[] = ["trainer", "researcher"];

export const FORM_BLANK = {
  username: "",
  email: "",
  role: "trainer" as UserRole,
  password: "",
};

export const INPUT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-red-300/60 focus:bg-white focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]";

export const FILTER_OPTIONS: { value: UserFilter | ""; label: string }[] = [
  { value: "", label: "Todas as funções" },
  { value: "admin", label: "Admin" },
  { value: "researcher", label: "Pesquisador" },
  { value: "trainer", label: "Treinador" },
];
