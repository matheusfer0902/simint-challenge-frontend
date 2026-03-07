import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TestimonialCard } from "@/components/landing/TestimonialCard";

const testimonials = [
  {
    name: "Ash Ketchum",
    role: "Pokémon Trainer",
    quote: "Poke Center revolutionized how I manage my Pokémon. Incredible interface and very easy to use!",
    delay: 0,
  },
  {
    name: "Prof. Oak",
    role: "Pokémon Researcher",
    quote: "As a researcher, I need accurate data. This system offers everything I need and much more.",
    delay: 100,
  },
  {
    name: "Misty",
    role: "Gym Leader",
    quote: "Perfect organization! I can keep track of all my Water-type Pokémon without any complications.",
    delay: 200,
  },
  {
    name: "Brock",
    role: "Pokémon Trainer",
    quote: "The system's security gives me peace of mind. I know my data is protected.",
    delay: 300,
  },
  {
    name: "Nurse Joy",
    role: "Pokémon Center",
    quote: "The efficiency reminds me of our healing machines. Fast, reliable, and always working!",
    delay: 400,
  },
  {
    name: "Gary Oak",
    role: "Elite Trainer",
    quote: "Best system I've ever used. The advanced search saves me a lot of time.",
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
            Testimonials
          </Badge>
          <h2 className="font-pixel text-2xl sm:text-3xl text-poke-dark-gray mb-4">
            What the trainers say
          </h2>
          <p className="text-poke-dark-gray/70 max-w-2xl mx-auto">
            See the experience of those who already use Poke Center to manage their Pokémon.
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