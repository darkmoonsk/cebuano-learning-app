import { NextResponse } from "next/server";
import { z } from "zod";
import { useCases } from "@/infrastructure/container";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = registerSchema.parse(payload);

    const user = await useCases.registerUser().execute(data);

    return NextResponse.json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid payload", details: error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const message =
      error instanceof Error && error.message === "Email already registered"
        ? "Email already registered"
        : "Failed to register user";

    const status = message === "Email already registered" ? 409 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
