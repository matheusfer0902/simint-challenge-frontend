import { Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pokeball } from "@/components/landing/Pokeball";

export function CTASection() {
  return (
    <section className="py-24 bg-poke-gray/30 relative overflow-hidden">
      <div className="absolute inset-0 pokedex-grid opacity-50" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-gradient-to-br from-poke-red to-poke-dark-red rounded-3xl p-8 sm:p-12 text-center shadow-poke-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="flex justify-center mb-6">
              <Pokeball size={70} />
            </div>

            <h2 className="font-pixel text-xl sm:text-2xl text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Join thousands of trainers and researchers who already use
              Poke Center to manage their Pokémon.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-poke-red hover:bg-poke-gray text-base px-8 shadow-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Create Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-base px-8"
              >
                <Lock className="w-5 h-5 mr-2" />
                Login
              </Button>
            </div>

            <p className="text-white/60 text-sm mt-6">
              Restricted system • Authorized access only
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}