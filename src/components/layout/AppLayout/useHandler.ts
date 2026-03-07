"use client";

import { useState } from "react";

export function useAppLayoutHandler() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return {
    mobileOpen,
    openMobile: () => setMobileOpen(true),
    closeMobile: () => setMobileOpen(false),
  };
}
