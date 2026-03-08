import { Suspense } from "react";
import { UsersPage } from "@/components/pages/users";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <UsersPage />
    </Suspense>
  );
}
