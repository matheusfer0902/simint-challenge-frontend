"use client";

export function PokedexPageStyles() {
  return (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-pixel { font-family: 'Press Start 2P', 'Courier New', monospace; }

        @keyframes pokedexCardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        @keyframes mystery {
          0%,100% { opacity: 0.25; transform: scale(1);    }
          50%     { opacity: 0.55; transform: scale(1.1);  }
        }
        .animate-mystery { animation: mystery 2.6s ease-in-out infinite; }

        @keyframes statShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%);  }
        }
        .animate-statShimmer { animation: statShimmer 2s ease-in-out infinite; }

        @keyframes progressShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%);  }
        }
        .animate-progressShimmer { animation: progressShimmer 2.2s ease-in-out infinite; }
      `}</style>
  );
}
