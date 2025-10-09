"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Button } from "@/presentation/components/ui/button";

const schema = z
  .object({
    token: z.string().min(1),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const candidate = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    const parsed = schema.safeParse({
      token,
      newPassword: candidate.newPassword,
      confirmPassword: candidate.confirmPassword,
    });
    if (!parsed.success) {
      setError("Please provide valid passwords and ensure they match");
      return;
    }

    setError(null);
    setMessage(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: parsed.data.token,
          newPassword: parsed.data.newPassword,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result?.error ?? "Failed to reset password");
        return;
      }

      setMessage(
        "Password updated. You can now sign in with your new password."
      );
      setTimeout(() => {
        router.replace("/login");
        router.refresh();
      }, 2000);
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
      <Button type="submit" className="w-full" disabled={isPending || !token}>
        {isPending ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}
