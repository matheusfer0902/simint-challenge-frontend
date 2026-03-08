"use client";

import { Pokeball } from "@/components/landing/Pokeball";
import { AppButton } from "@/components/shared/AppButton";

interface AuthButtonProps {
  isPending: boolean;
  label: string;
  icon?: React.ReactNode;
}

export function AuthButton({ isPending, label, icon }: AuthButtonProps) {
  return (
    <AppButton
      type="submit"
      variant="primary"
      size="lg"
      fullWidth
      loading={isPending}
      loadingIndicator={
        <>
          <span className="h-4 w-4 animate-spin">
            <Pokeball size={16} animate={false} />
          </span>
          <span>Wait...</span>
        </>
      }
      trailingIcon={icon}
    >
      {label}
    </AppButton>
  );
}
