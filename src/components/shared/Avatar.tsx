"use client";

export interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  /** Adds a poke-red ring around the avatar. */
  ring?: boolean;
  /** Shows a green online indicator dot. */
  online?: boolean;
}

export function Avatar({ src, alt, size = 40, ring = false, online = false }: AvatarProps) {
  return (
    <div
      className={`relative shrink-0 rounded-full ${ring ? "ring-2 ring-poke-red ring-offset-2" : ""}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full rounded-full object-cover bg-slate-100"
        loading="lazy"
      />
      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
      )}
    </div>
  );
}
