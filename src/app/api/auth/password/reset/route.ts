import { NextResponse } from "next/server";
import { z } from "zod";
import { useCases } from "@/infrastructure/container";

const schema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = schema.parse(payload);

    await useCases.resetPassword().execute(data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid payload", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to reset password";
    const status = message === "Invalid or expired token" ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
