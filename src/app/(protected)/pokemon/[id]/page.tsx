import { Suspense } from "react";
import { PokemonDetailPage } from "@/components/pages/pokemon-detail";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PokemonDetailPage />
    </Suspense>
  );
}
