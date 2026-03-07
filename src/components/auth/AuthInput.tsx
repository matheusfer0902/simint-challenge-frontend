"use client";

import { AppInput, type AppInputProps } from "@/components/shared/AppInput";

export type { AppInputProps as AuthInputProps };

/**
 * Auth-flavoured input.
 * Thin wrapper around AppInput with variant="form" locked in.
 * All AppInputProps are forwarded transparently.
 */
export function AuthInput(props: Omit<AppInputProps, "variant">) {
  return <AppInput variant="form" {...props} />;
}
