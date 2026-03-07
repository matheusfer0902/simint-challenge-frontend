"use client";

import { useAuth } from "@/contexts/auth.context";
import { Pokeball } from "@/components/landing/Pokeball";
import { LogOut, User } from "lucide-react";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin">
            <Pokeball size={56} animate={false} />
          </div>
          <p className="font-pixel text-xs text-poke-dark-gray/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-poke-gray/20 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Pokeball size={36} />
            <span className="font-pixel text-sm text-poke-red">POKE CENTER</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border-2 border-poke-gray px-4 py-2 text-sm text-poke-dark-gray/70 transition-all hover:border-poke-red/40 hover:text-poke-red"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="rounded-2xl border-2 border-poke-gray/50 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-poke-cyan to-poke-blue flex items-center justify-center">
              <User className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="font-pixel text-sm text-poke-dark-gray">
                Hello, {user?.name}!
              </h1>
              <p className="mt-1 text-xs text-poke-dark-gray/60 capitalize">
                {user?.role === "trainer" ? "Trainer" : "Researcher"}
              </p>
            </div>
          </div>
          <p className="text-sm text-poke-dark-gray/70">
            You are authenticated. From here you can build the rest of the dashboard by consuming the services in{" "}
            <code className="rounded bg-poke-gray px-1 py-0.5 text-xs">
              lib/api/
            </code>
            .
          </p>
        </div>
      </div>
    </div>
  );
}