import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TestimonialCard } from "@/components/landing/TestimonialCard";

const testimonials = [
  {
    name: "Ash Ketchum",
    role: "Treinador Pokémon",
    quote: "O Poke Center revolucionou como eu gerencio meus Pokémons. Interface incrível e muito fácil de usar!",
    delay: 0,
  },
  {
    name: "Prof. Oak",
    role: "Pesquisador Pokémon",
    quote: "Como pesquisador, preciso de dados precisos. Este sistema oferece tudo que eu preciso e muito mais.",
    delay: 100,
  },
  {
    name: "Misty",
    role: "Líder de Ginásio",
    quote: "Organização perfeita! Consigo acompanhar todos os meus Pokémons aquáticos sem complicação.",
    delay: 200,
  },
  {
    name: "Brock",
    role: "Treinador Pokémon",
    quote: "A segurança do sistema me dá tranquilidade. Sei que meus dados estão protegidos.",
    delay: 300,
  },
  {
    name: "Enfermeira Joy",
    role: "Centro Pokémon",
    quote: "A eficiência me lembra nossas máquinas de cura. Rápido, confiável e sempre funcionando!",
    delay: 400,
  },
  {
    name: "Gary Oak",
    role: "Treinador Elite",
    quote: "Melhor sistema que já usei. A busca avançada economiza muito do meu tempo.",
    delay: 500,
  },
];

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-poke-yellow/20 text-poke-gold border-poke-yellow/30">
            <Star className="w-3.5 h-3.5 mr-1.5" />
            Depoimentos
          </Badge>
          <h2 className="font-pixel text-2xl sm:text-3xl text-poke-dark-gray mb-4">
            O que dizem os treinadores
          </h2>
          <p className="text-poke-dark-gray/70 max-w-2xl mx-auto">
            Veja a experiência de quem já utiliza o Poke Center para gerenciar seus Pokémons.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
