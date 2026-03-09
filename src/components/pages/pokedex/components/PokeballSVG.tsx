"use client";

export interface PokeballSVGProps {
  className?: string;
  "aria-hidden"?: boolean;
}

export function PokeballSVG({ className = "", "aria-hidden": ariaHidden = true }: PokeballSVGProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden={ariaHidden}>
      <path d="M50 5A45 45 0 0 1 95 50L50 50Z" fill="#fff" />
      <path d="M50 95A45 45 0 0 1 5 50L50 50Z" fill="#fff" />
      <rect x="5" y="47" width="90" height="6" fill="#000" />
      <circle cx="50" cy="50" r="14" fill="#000" />
      <circle cx="50" cy="50" r="10" fill="#fff" />
      <circle cx="50" cy="50" r="6" fill="#000" />
      <circle cx="50" cy="50" r="3" fill="#fff" />
    </svg>
  );
}
