"use client";

import Link from "next/link";
import { LogOut, X } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { AppButton } from "@/components/shared/AppButton";
import { avatarBg } from "@/lib/utils/avatar";
import { useSidebarHandler } from "./useHandler";

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { navItems, activeId, user, logout, isLoading } = useSidebarHandler();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-100 bg-white/95 backdrop-blur-md
          transition-transform duration-300 ease-out
          md:relative md:translate-x-0 md:w-20 lg:w-60
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-4">
          <div className="relative h-9 w-9 shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow">
              <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="#ef4444" stroke="#000" strokeWidth="3" />
              <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#fff" stroke="#000" strokeWidth="3" />
              <rect x="5" y="47" width="90" height="6" fill="#000" />
              <circle cx="50" cy="50" r="14" fill="#000" />
              <circle cx="50" cy="50" r="10" fill="#fff" />
              <circle cx="50" cy="50" r="6" fill="#000" />
              <circle cx="50" cy="50" r="3" fill="#fff" className="animate-pulse" />
            </svg>
          </div>
          <div className="hidden lg:block overflow-hidden">
            <span className="font-pixel text-[11px] text-poke-red leading-none block">POKE</span>
            <span className="font-pixel text-[11px] text-slate-700 leading-none block">CENTER</span>
          </div>
          <button
            onClick={onMobileClose}
            className="ml-auto rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-3 hidden px-2 text-[9px] font-semibold uppercase tracking-widest text-slate-400 lg:block">
            Navigation
          </p>
          <ul className="space-y-1">
            {navItems.map(({ id, label, icon: Icon, href }) => {
              const isActive = activeId === id;
              return (
                <li key={id}>
                  <Link
                    href={href}
                    onClick={onMobileClose}
                    className={`
                      group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150
                      ${
                        isActive
                          ? "bg-poke-red/10 text-poke-red"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                      }
                    `}
                  >
                    <Icon
                      className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-poke-red" : "text-slate-400"
                      }`}
                    />
                    <span className="hidden font-medium lg:block md:hidden">{label}</span>
                    <span className="font-medium md:hidden">{label}</span>
                    {isActive && (
                      <div className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-poke-red lg:block" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-100 p-4 space-y-3">
          {user && (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
              <Avatar
                src={avatarBg(user.username)}
                alt={user.username}
                size={36}
              />
              <div className="hidden min-w-0 flex-1 lg:block md:hidden">
                <p className="truncate text-xs font-semibold text-slate-700">{user.username}</p>
                <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
              </div>
            </div>
          )}

          <AppButton
            variant="secondary"
            size="sm"
            fullWidth
            icon={<LogOut className="h-3.5 w-3.5" />}
            onClick={logout}
            className="border-poke-red/30 text-poke-red hover:bg-poke-red hover:text-white hover:border-poke-red"
          >
            <span className="hidden lg:inline md:hidden font-pixel text-[9px] tracking-wider">LOGOUT</span>
            <span className="md:hidden font-pixel text-[9px] tracking-wider">LOGOUT</span>
          </AppButton>
        </div>
      </aside>
    </>
  );
}
