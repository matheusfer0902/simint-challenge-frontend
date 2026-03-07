"use client";

import { Bell, Menu, Search, X } from "lucide-react";
import { useAuth } from "@/contexts/auth.context";
import { AppInput } from "@/components/shared/AppInput";
import { AppButton } from "@/components/shared/AppButton";
import { Avatar } from "@/components/shared/Avatar";
import { avatarBg } from "@/lib/utils/avatar";

interface AppHeaderProps {
  onMobileMenuOpen: () => void;
  /** Search value controlled by the parent page. */
  search?: string;
  /** Called when the user types in the search bar. */
  onSearchChange?: (v: string) => void;
  /** Placeholder text for the search bar. Defaults to "Search…" */
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
        <div className="relative">
          <AppButton variant="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </AppButton>
          <span className="pointer-events-none absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-poke-red ring-2 ring-white" />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition-colors hover:border-slate-300">
          <Avatar
            src={avatarBg(user?.name ?? "Trainer")}
            alt={user?.name ?? "Trainer"}
            size={28}
            online
          />
          <div className="hidden sm:block">
            <p className="text-[11px] font-semibold text-slate-800 leading-none">
              {user?.name ?? "Trainer"}
            </p>
            <p className="text-[10px] text-emerald-500 leading-none mt-0.5">● Online</p>
          </div>
        </div>
      </div>
    </header>
  );
}
