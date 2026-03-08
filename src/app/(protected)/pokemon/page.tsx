import { Suspense } from "react";
import { PokemonPage } from "@/components/pages/pokemon";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PokemonPage />
    </Suspense>
  );
}
