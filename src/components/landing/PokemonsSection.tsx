import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PokemonCard } from "@/components/landing/PokemonCard";
import { Pokeball } from "@/components/landing/Pokeball";

const pokemons = [
  { name: "Pikachu", number: "#025", types: ["Elétrico"], image: "/pikachu.png", delay: 0 },
  { name: "Charizard", number: "#006", types: ["Fogo", "Voador"], image: "/charizard.png", delay: 100 },
  { name: "Bulbasaur", number: "#001", types: ["Planta", "Veneno"], image: "/bulbasaur.png", delay: 200 },
  { name: "Squirtle", number: "#007", types: ["Água"], image: "/squirtle.png", delay: 300 },
  { name: "Mewtwo", number: "#150", types: ["Psíquico"], image: "/mewtwo.png", delay: 400 },
  { name: "Lucario", number: "#448", types: ["Lutador", "Aço"], image: "/lucario.png", delay: 500 },
  { name: "Gengar", number: "#094", types: ["Fantasma", "Veneno"], image: "/gengar.png", delay: 600 },
];

export function PokemonsSection() {
  return (
    <section id="pokemons" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pokedex-grid opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-poke-yellow/20 text-poke-gold border-poke-yellow/30">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Galeria
          </Badge>
          <h2 className="font-pixel text-2xl sm:text-3xl text-poke-dark-gray mb-4">
            Conheça alguns Pokémons
          </h2>
          <p className="text-poke-dark-gray/70 max-w-2xl mx-auto">
            Nossa Pokédex conta com centenas de Pokémons registrados.
            Veja alguns dos mais populares que você pode gerenciar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.name} {...pokemon} />
          ))}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-poke-red/10 flex items-center justify-center">
                <Pokeball size={50} />
              </div>
              <p className="font-pixel text-sm text-poke-dark-gray mb-2">E muito mais!</p>
              <p className="text-poke-dark-gray/60 text-sm">+900 Pokémons</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
