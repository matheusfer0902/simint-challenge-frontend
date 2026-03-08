import { Suspense } from "react";
import { TeamsPage } from "@/components/pages/teams";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TeamsPage />
    </Suspense>
  );
}
