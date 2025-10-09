import { NextResponse } from "next/server";
import { z } from "zod";
import { services, useCases } from "@/infrastructure/container";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { email } = schema.parse(payload);

    const result = await useCases.requestPasswordReset().execute({ email });

    // Build reset link using env or request origin
    const origin =
      process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const token = "token" in result ? result.token : undefined;
    if (token) {
      const resetLink = `${origin}/reset-password?token=${encodeURIComponent(
        token
      )}`;
      await services.email.sendPasswordResetEmail({
        toEmail: email,
        resetLink,
      });
    }

    // Do not reveal whether user exists; return generic success
    // Optionally, result.token can be used by an email service
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid payload", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
