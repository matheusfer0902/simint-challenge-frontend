"use client";

export function TrainPageStyles() {
  return (
    <style>{`
  @keyframes pokeBreath {
    0%,100% { transform: scale(1)    translateY(0px); }
    50%     { transform: scale(1.05) translateY(-8px); }
  }
  .animate-pokeBreath { animation: pokeBreath 3.2s ease-in-out infinite; }

  @keyframes pokeBounce {
    0%   { transform: scale(1)    translateY(0);    }
    15%  { transform: scale(0.85) translateY(0);    }
    45%  { transform: scale(1.18) translateY(-36px);}
    65%  { transform: scale(0.95) translateY(-10px);}
    80%  { transform: scale(1.05) translateY(-4px); }
    100% { transform: scale(1)    translateY(0);    }
  }
  .animate-pokeBounce { animation: pokeBounce 0.65s cubic-bezier(0.36,0.07,0.19,0.97) forwards; }

  @keyframes levelPop {
    0%,100% { transform: scale(1);    }
    30%     { transform: scale(0.80); }
    60%     { transform: scale(1.25); }
    80%     { transform: scale(0.95); }
  }
  .animate-levelPop { animation: levelPop 0.5s ease-out; }

  @keyframes levelPopBig {
    0%   { transform: scale(0);    opacity: 0; }
    60%  { transform: scale(1.25); opacity: 1; }
    100% { transform: scale(1);    opacity: 1; }
  }
  .animate-levelPopBig { animation: levelPopBig 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }

  @keyframes levelBlink {
    0%,100% { opacity: 1;   transform: scale(1);    }
    50%     { opacity: 0.3; transform: scale(1.06); }
  }
  .animate-levelBlink { animation: levelBlink 0.55s ease-in-out infinite; }

  @keyframes confettiFall {
    0%   { transform: translateY(0)    rotate(0deg);   opacity: 1; }
    100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
  }
  .animate-confettiFall { animation: confettiFall linear forwards; }

  @keyframes xpShimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(300%);  }
  }
  .animate-xpShimmer { animation: xpShimmer 2s ease-in-out infinite; }

  @keyframes floatAway {
    0%   { opacity: 1; transform: translateY(0)    scale(1);    }
    80%  { opacity: 1; transform: translateY(-28px) scale(1.05); }
    100% { opacity: 0; transform: translateY(-50px) scale(0.9);  }
  }
  .animate-floatAway { animation: floatAway 1.8s ease-out forwards; }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`}</style>
  );
}
