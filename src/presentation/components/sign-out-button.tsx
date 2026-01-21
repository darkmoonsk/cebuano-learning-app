"use client";

import { Button } from "@/presentation/components/ui/button";
import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  readonly className?: string;
}

export function SignOutButton({ className }: SignOutButtonProps) {
  const baseClassName: string =
    "rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20";
  const mergedClassName: string = className
    ? `${baseClassName} ${className}`
    : baseClassName;
  return (
    <Button
      variant="outline"
      size="sm"
      className={mergedClassName}
      onClick={() => {
        signOut({ callbackUrl: "/" });
      }}
    >
      Sign out
    </Button>
  );
}
