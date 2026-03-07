interface PokeballProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function Pokeball({ size = 60, className = "", animate = true }: PokeballProps) {
  return (
    <div
      className={`relative ${animate ? "animate-bounce-slow" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <path
          d="M50 5 A45 45 0 0 1 95 50 L50 50 Z"
          fill="#FF0000"
          stroke="#000"
          strokeWidth="3"
        />
        <path
          d="M50 95 A45 45 0 0 1 5 50 L50 50 Z"
          fill="#FFFFFF"
          stroke="#000"
          strokeWidth="3"
        />
        <rect x="5" y="47" width="90" height="6" fill="#000" />
        <circle cx="50" cy="50" r="14" fill="#000" />
        <circle cx="50" cy="50" r="10" fill="#FFFFFF" />
        <circle cx="50" cy="50" r="6" fill="#000" />
        <circle cx="50" cy="50" r="3" fill="#FFFFFF" className="animate-pulse" />
      </svg>
    </div>
  );
}
