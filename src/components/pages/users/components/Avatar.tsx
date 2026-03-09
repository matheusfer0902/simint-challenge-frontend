"use client";

import { useState } from "react";

export interface AvatarProps {
  src: string;
  name: string;
  size?: number;
}

export function Avatar({ src, name, size = 36 }: AvatarProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      style={{ width: size, height: size }}
      className="relative shrink-0 overflow-hidden rounded-full bg-slate-100 shadow-sm ring-2 ring-white"
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
