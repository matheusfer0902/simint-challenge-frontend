"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode, type FormEvent } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Eye,
  EyeOff,
  AlertTriangle,
  Users,
  Shield,
  UserX,
  SlidersHorizontal,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  useUsersHandler,
  type AppUser,
  type UserRole,
  type UserFilter,
  type SortField,
  avatarUrl,
} from "./useHandler";

const SEARCH_DEBOUNCE_MS = 400;

// ─────────────────────────────────────────────────────────────────────────────
// ROLE STYLES (API: trainer | researcher | admin; admin não é criável via API)
// ─────────────────────────────────────────────────────────────────────────────

type SortDir = "asc" | "desc";

const ROLE_STYLES: Record<UserRole, { badge: string; icon: ReactNode }> = {
  admin: { badge: "bg-purple-100 text-purple-800 border border-purple-200", icon: <Shield className="h-2.5 w-2.5" /> },
  researcher: { badge: "bg-sky-100 text-sky-800 border border-sky-200", icon: <Eye className="h-2.5 w-2.5" /> },
  trainer: { badge: "bg-emerald-100 text-emerald-800 border border-emerald-200", icon: <Users className="h-2.5 w-2.5" /> },
};

// ─────────────────────────────────────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────────────────────────────────────

function Avatar({ src, name, size = 36 }: { src: string; name: string; size?: number }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      style={{ width: size, height: size }}
      className="relative shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-white shadow-sm"
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
      <img
        src={src}
        alt={name}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const s = ROLE_STYLES[role];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[9px] ${s.badge}`}>
      {s.icon}
      {role}
    </span>
  );
}

function SortBtn({
  field,
  current,
  onSort,
}: {
  field: SortField;
  current: { field: SortField; dir: SortDir };
  onSort: (f: SortField) => void;
}) {
  const active = current.field === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="group flex items-center gap-1 font-pixel text-[8px] uppercase tracking-widest text-slate-400 hover:text-slate-600"
    >
      {field === "name" && "Usuário"}
      {field === "role" && "Função"}
      {field === "email" && "E-mail"}
      {active ? (current.dir === "asc" ? <ChevronUp className="h-3 w-3 text-red-500" /> : <ChevronDown className="h-3 w-3 text-red-500" />) : <ChevronsUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100" />}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA TABLE
// ─────────────────────────────────────────────────────────────────────────────

function DataTable({
  users,
  sort,
  onSort,
  onEdit,
  onDelete,
}: {
  users: AppUser[];
  sort: { field: SortField; dir: SortDir };
  onSort: (f: SortField) => void;
  onEdit: (u: AppUser) => void;
  onDelete: (u: AppUser) => void;
}) {
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
              <span className="font-pixel text-[8px] uppercase tracking-widest text-slate-400">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 bg-white">
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="py-20 text-center">
                <UserX className="mx-auto mb-3 h-10 w-10 text-slate-200" />
                <p className="font-pixel text-[9px] text-slate-400">Nenhum usuário encontrado</p>
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
                  <button onClick={() => onEdit(u)} className="rounded-lg p-2 text-slate-400 transition-all hover:bg-sky-50 hover:text-sky-600" title="Editar">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDelete(u)} className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600" title="Excluir">
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

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE USER CARD
// ─────────────────────────────────────────────────────────────────────────────

function UserCard({ user, onEdit, onDelete }: { user: AppUser; onEdit: () => void; onDelete: () => void }) {
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
          <button onClick={onEdit} className="rounded-lg p-2 text-slate-400 hover:bg-sky-50 hover:text-sky-600">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={onDelete} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USER FORM MODAL
// ─────────────────────────────────────────────────────────────────────────────

const INPUT =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-red-300/60 focus:bg-white focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block font-pixel text-[8px] uppercase tracking-widest text-slate-500">{label}</label>
      {children}
    </div>
  );
}

function Shimmer() {
  return (
    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
  );
}

function PokeballSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="#fff" />
      <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#fff" />
      <rect x="5" y="47" width="90" height="6" fill="#000" />
      <circle cx="50" cy="50" r="14" fill="#000" />
      <circle cx="50" cy="50" r="10" fill="#fff" />
      <circle cx="50" cy="50" r="6" fill="#000" />
      <circle cx="50" cy="50" r="3" fill="#fff" />
    </svg>
  );
}

interface FormModalProps {
  user: AppUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: { username: string; email: string; role: UserRole; password?: string }) => void;
  saveError: string | null;
}

const BLANK = { username: "", email: "", role: "trainer" as UserRole, password: "" };

/** Roles editáveis via API: apenas trainer e researcher (admin não pode ser criado/atribuído). */
const EDITABLE_ROLES: UserRole[] = ["trainer", "researcher"];

function UserFormModal({ user, isOpen, onClose, onSave, saveError }: FormModalProps) {
  const [form, setForm] = useState(BLANK);
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(user);

  useEffect(() => {
    if (!isOpen) return;
    setForm(
      user
        ? { username: user.username, email: user.email, role: user.role === "admin" ? "trainer" : user.role, password: "" }
        : { ...BLANK }
    );
    setSaving(false);
  }, [user, isOpen]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || form.username.length < 3 || form.username.length > 100) return;
    if (!form.email.trim()) return;
    if (!isEdit && (!form.password || form.password.length < 8)) return;
    setSaving(true);
    try {
      await onSave({
        username: form.username.trim(),
        email: form.email.trim(),
        role: form.role,
        password: form.password || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        style={{ animation: "modalSlideIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-5">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 opacity-[0.07]">
            <PokeballSVG />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-pixel text-[8px] uppercase tracking-widest text-slate-400">Poke Center Admin</p>
              <h2 className="font-pixel text-[13px] text-white">{isEdit ? "EDITAR USUÁRIO" : "NOVO USUÁRIO"}</h2>
            </div>
            <button onClick={onClose} className="rounded-xl bg-white/10 p-2 text-white/70 transition hover:bg-white/20">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {saveError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
              {saveError}
            </div>
          )}

          <Field label="Nome de usuário (3–100 caracteres)">
            <input
              required
              minLength={3}
              maxLength={100}
              value={form.username}
              onChange={(e) => set("username", e.target.value)}
              placeholder="ash_ketchum"
              className={INPUT}
            />
          </Field>

          <Field label="E-mail">
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="ash@example.com"
              className={INPUT}
            />
          </Field>

          {!isEdit ? (
            <Field label="Senha (mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 especial . , @ - _)">
              <div className="relative">
                <input
                  required
                  minLength={8}
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="••••••••"
                  className={`${INPUT} pr-10`}
                />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          ) : (
            <Field label="Nova senha (deixe em branco para não alterar)">
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="••••••••"
                  className={`${INPUT} pr-10`}
                />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          )}

          <Field label="Função (apenas trainer ou researcher)">
            <div className="relative">
              <select value={form.role} onChange={(e) => set("role", e.target.value)} className={`${INPUT} appearance-none pr-8`}>
                {EDITABLE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r === "trainer" ? "Treinador" : "Pesquisador"}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </Field>

          <button
            type="submit"
            disabled={saving}
            className={`group relative w-full overflow-hidden rounded-xl py-3.5 font-pixel text-[10px] tracking-wider text-white transition-all focus:outline-none active:scale-[0.98] disabled:opacity-60 ${saving ? "bg-emerald-500" : "bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg hover:shadow-red-500/25"}`}
          >
            <Shimmer />
            <span className="relative flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Salvando…
                </>
              ) : isEdit ? (
                "ATUALIZAR"
              ) : (
                "CRIAR USUÁRIO"
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE MODAL
// ─────────────────────────────────────────────────────────────────────────────

function DeleteModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  deleteError,
}: {
  user: AppUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleteError: string | null;
}) {
  if (!isOpen || !user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl" style={{ animation: "modalSlideIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="font-pixel text-[12px] text-slate-800">EXCLUIR USUÁRIO?</h2>
          <p className="mt-2 text-sm text-slate-600">Você está prestes a excluir</p>
          <p className="mt-0.5 font-bold text-slate-800">&quot;{user.username}&quot;</p>
          {deleteError && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
              {deleteError}
            </div>
          )}
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-xs font-semibold text-red-600">
              ⚠ Esta ação não pode ser desfeita. Todos os dados deste usuário serão removidos permanentemente.
            </p>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-slate-200 bg-white py-3 font-pixel text-[9px] tracking-wider text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              CANCELAR
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 py-3 font-pixel text-[9px] tracking-wider text-white shadow-lg transition hover:shadow-xl hover:shadow-red-500/25 active:scale-[0.97]"
            >
              EXCLUIR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const KEYFRAMES = `
  @keyframes modalSlideIn {
    from { opacity: 0; transform: scale(0.93) translateY(16px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// USERS PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function UsersPage() {
  const {
    users,
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

  const handleFilterChange = useCallback(
    (value: UserFilter | "") => {
      setFilter(value);
    },
    [setFilter]
  );

  const handlePagePrev = useCallback(() => {
    const next = Math.max(1, page - 1);
    fetchUsers({ page: next, search, filter });
  }, [page, fetchUsers, search, filter]);

  const handlePageNext = useCallback(() => {
    const next = Math.min(totals.totalPages, page + 1);
    fetchUsers({ page: next, search, filter });
  }, [page, totals.totalPages, fetchUsers, search, filter]);

  return (
    <AppLayout
      search={displaySearch}
      onSearchChange={handleHeaderSearchChange}
      searchPlaceholder="Buscar usuários…"
    >
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <nav className="mb-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>Dashboard</span>
            <span>›</span>
            <span className="font-semibold text-red-500">Usuários</span>
          </nav>
          <h1 className="font-pixel text-2xl text-red-500 sm:text-3xl">GERENCIAMENTO DE USUÁRIOS</h1>
          <p className="mt-1.5 text-sm text-slate-500">Gerencie treinadores e pesquisadores do sistema (apenas admin).</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
              <Users className="h-3 w-3 text-blue-500" />
              {totals.total} total
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
              Página {totals.page} de {totals.totalPages}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="mb-5 flex flex-wrap items-center justify-end gap-2">
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => handleFilterChange((e.target.value || "") as UserFilter | "")}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-7 text-xs font-semibold text-slate-600 outline-none"
            >
              <option value="">Todas as funções</option>
              <option value="admin">Admin</option>
              <option value="researcher">Pesquisador</option>
              <option value="trainer">Treinador</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          <button
            onClick={openCreate}
            className="group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-2.5 font-pixel text-[10px] tracking-wider text-white shadow-lg shadow-red-500/20 transition hover:scale-[1.01] hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.97] focus:outline-none"
          >
            <Shimmer />
            <Plus className="h-4 w-4" />
            NOVO USUÁRIO
          </button>
        </div>

        <p className="mb-3 text-xs text-slate-400">
          Exibindo <span className="font-semibold text-slate-600">{users.length}</span> de {total} usuários
        </p>

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-24">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          </div>
        ) : (
          <>
            <DataTable users={users} sort={sort} onSort={handleSort} onEdit={openEdit} onDelete={openDelete} />

            <div className="space-y-3 sm:hidden">
              {users.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
                  <UserX className="mx-auto mb-3 h-10 w-10 text-slate-200" />
                  <p className="font-pixel text-[9px] text-slate-400">Nenhum usuário encontrado</p>
                </div>
              )}
              {users.map((u) => (
                <UserCard key={u.id} user={u} onEdit={() => openEdit(u)} onDelete={() => openDelete(u)} />
              ))}
            </div>

            {totals.totalPages > 1 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={handlePagePrev}
                  disabled={page <= 1}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-xs text-slate-500">
                  Página {page} de {totals.totalPages}
                </span>
                <button
                  onClick={handlePageNext}
                  disabled={page >= totals.totalPages}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}

        <UserFormModal user={editTarget} isOpen={formOpen} onClose={closeForm} onSave={handleSave} saveError={saveError} />
        <DeleteModal user={delTarget} isOpen={deleteOpen} onClose={closeDelete} onConfirm={handleConfirmDelete} deleteError={deleteError} />

        <style>{KEYFRAMES}</style>
      </div>
    </AppLayout>
  );
}
