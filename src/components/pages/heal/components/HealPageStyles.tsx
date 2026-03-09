"use client";

export function HealPageStyles() {
  return (
    <style>{`
  @keyframes slotGlow {
    0%,100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.6);  }
    50%     { box-shadow: 0 0 0 14px rgba(251,191,36,0); }
  }
  .animate-slotGlow { animation: slotGlow 0.7s ease-in-out infinite; }

  @keyframes healFloat {
    0%,100% { transform: translateY(0)  scale(1);    }
    50%     { transform: translateY(-6px) scale(1.06); }
  }
  .animate-healFloat { animation: healFloat 1.4s ease-in-out infinite; }

  @keyframes shimmerHp {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
  .animate-shimmerHp { animation: shimmerHp 1.8s ease-in-out infinite; }
`}</style>
  );
}
