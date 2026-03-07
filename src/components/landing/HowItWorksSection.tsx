import { Heart, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProcessStep } from "@/components/landing/ProcessStep";
import { Pokeball } from "@/components/landing/Pokeball";

const pokemonList = [
  { name: "Pikachu", hp: 100, color: "from-poke-yellow to-orange-400", image: "/pikachu.png" },
  { name: "Charizard", hp: 85, color: "from-poke-red to-orange-500", image: "/charizard.png" },
  { name: "Squirtle", hp: 92, color: "from-blue-400 to-blue-600", image: "/squirtle.png" },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 bg-poke-gray/30 relative overflow-hidden">
      <div className="absolute top-20 right-0 w-64 h-64 bg-poke-red/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-poke-cyan/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="mb-4 bg-poke-cyan/20 text-poke-blue border-poke-cyan/30">
              <Activity className="w-3.5 h-3.5 mr-1.5" />
              Como Funciona
            </Badge>
            <h2 className="font-pixel text-2xl sm:text-3xl text-poke-dark-gray mb-6">
              Comece em 4 passos
            </h2>
            <p className="text-poke-dark-gray/70 mb-8">
              Processo simples e rápido inspirado na eficiência dos Centros Pokémon.
              Comece a gerenciar sua coleção em minutos.
            </p>

            <div className="space-y-2">
              <ProcessStep
                number={1}
                title="Crie sua conta"
                description="Registre-se como treinador ou pesquisador para obter acesso ao sistema."
              />
              <ProcessStep
                number={2}
                title="Adicione Pokémons"
                description="Cadastre seus Pokémons com todas as informações necessárias."
              />
              <ProcessStep
                number={3}
                title="Organize sua coleção"
                description="Crie categorias, filtros e organize do seu jeito."
              />
              <ProcessStep
                number={4}
                title="Acompanhe estatísticas"
                description="Monitore o progresso e evolução dos seus Pokémons."
                isLast
              />
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-poke-gray/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-poke-red flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-pixel text-sm text-poke-dark-gray">Máquina de Cura</h4>
                  <p className="text-poke-dark-gray/60 text-sm">Restaurando Pokémons...</p>
                </div>
              </div>

              <div className="space-y-4">
                {pokemonList.map((pokemon) => (
                  <div key={pokemon.name} className="bg-poke-gray/50 rounded-xl p-4 flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      className="w-12 h-12 object-contain"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-poke-dark-gray text-sm">{pokemon.name}</span>
                        <span className="text-poke-cyan text-sm font-medium">{pokemon.hp}% HP</span>
                      </div>
                      <div className="h-2 bg-poke-gray rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${pokemon.color} transition-all duration-1000`}
                          style={{ width: `${pokemon.hp}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-poke-cyan/20 animate-ping absolute inset-0" />
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-poke-cyan to-poke-light-blue flex items-center justify-center relative">
                    <Heart className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6">
              <Pokeball size={50} />
            </div>
            <div className="absolute -bottom-4 -left-4 opacity-60">
              <Pokeball size={40} className="animate-float" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
