import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { useCases } from "@/infrastructure/container";
import { z } from "zod";

const settingsSchema = z.object({
  sessionLimit: z.number().int().positive().default(30),
  newDailyCap: z.number().int().min(0).default(30),
  dailyReviewCap: z.number().int().positive().default(300),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await useCases
    .getUserSettings()
    .execute({ userId: session.user.id });
  const response = {
    sessionLimit: settings.sessionLimit,
    newDailyCap: settings.newDailyCap,
    dailyReviewCap: settings.dailyReviewCap,
  };
  return NextResponse.json(response);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const json = await request.json().catch(() => ({}));
  const parsed = settingsSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid settings" }, { status: 400 });
  }
  const updated = await useCases
    .updateUserSettings()
    .execute({ userId: session.user.id, settings: parsed.data });
  const response = {
    sessionLimit: updated.sessionLimit,
    newDailyCap: updated.newDailyCap,
    dailyReviewCap: updated.dailyReviewCap,
  };
  return NextResponse.json(response);
}
