import { Suspense } from "react";
import { TeamDetailPage } from "@/components/pages/team-detail";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TeamDetailPage />
    </Suspense>
  );
}
