"use client";

import { Button } from "@/presentation/components/ui/button";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        signOut({ callbackUrl: "/" });
      }}
    >
      Sign out
    </Button>
  );
}
