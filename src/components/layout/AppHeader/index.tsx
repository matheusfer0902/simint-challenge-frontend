"use client";

import Link from "next/link";
import { Menu, Search, X, ChevronDown, Pencil, Mail } from "lucide-react";
import { useAuth } from "@/contexts/auth.context";
import { AppInput } from "@/components/shared/AppInput";
import { AppButton } from "@/components/shared/AppButton";
import { Avatar } from "@/components/shared/Avatar";
import { avatarBg } from "@/lib/utils/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

interface AppHeaderProps {
  onMobileMenuOpen: () => void;
  search?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
}

export function AppHeader({
  onMobileMenuOpen,
  search = "",
  onSearchChange,
  searchPlaceholder = "Search…",
}: AppHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-100 bg-white/90 px-4 backdrop-blur-md sm:px-6">
      <AppButton
        variant="icon"
        onClick={onMobileMenuOpen}
        aria-label="Open menu"
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
      </AppButton>

      <div className="relative flex-1 max-w-lg">
        <AppInput
          variant="search"
          value={search}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          icon={<Search className="h-4 w-4" />}
          suffix={
            search ? (
              <button
                onClick={() => onSearchChange?.("")}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : undefined
          }
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors",
                "hover:border-slate-300 hover:bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-poke-red/20 focus:ring-offset-1"
              )}
              aria-label="Abrir menu do usuário"
            >
              <Avatar
                src={avatarBg(user?.username ?? "user")}
                alt={user?.username ?? "User"}
                size={40}
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-800 leading-tight">
                  {user?.username ?? "—"}
                </p>
                <p className="text-xs text-slate-500 leading-tight mt-0.5">
                  {user?.role ? formatRole(user.role) : "—"}
                </p>
              </div>
              <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3 py-1">
                <Avatar
                  src={avatarBg(user?.username ?? "user")}
                  alt={user?.username ?? "User"}
                  size={44}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 truncate">{user?.username ?? "—"}</p>
                  <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                    <Mail className="h-3 w-3 shrink-0" />
                    {user?.email ?? "—"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {user?.role ? formatRole(user.role) : "—"}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                <Pencil className="h-4 w-4" />
                Editar meus dados
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
