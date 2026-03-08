"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { canAccess } from "@/lib/roles";

const DASHBOARD_PATH = "/dashboard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;
    const allowed = canAccess(user.role, pathname);
    if (!allowed) {
      router.replace(DASHBOARD_PATH);
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-poke-gray border-t-poke-red" />
          <p className="font-pixel text-[10px] uppercase tracking-widest text-poke-dark-gray/50">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
