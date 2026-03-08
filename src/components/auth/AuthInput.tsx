"use client";

import { AppInput, type AppInputProps } from "@/components/shared/AppInput";

export type { AppInputProps as AuthInputProps };

export function AuthInput(props: Omit<AppInputProps, "variant">) {
  return <AppInput variant="form" {...props} />;
}
