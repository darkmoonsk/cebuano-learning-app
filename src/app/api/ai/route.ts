import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get("prompt");
  if (!prompt) {
    return NextResponse.json(
      { error: "Missing prompt parameter" },
      { status: 400 }
    );
  }
  const model = searchParams.get("model") || "Qwen/Qwen3-32B";
  const temperature = searchParams.get("temperature") || 0.7;
  const max_tokens = searchParams.get("max_tokens") || 1000;
  const top_p = searchParams.get("top_p") || 1;
  const frequency_penalty = searchParams.get("frequency_penalty") || 0;
  const presence_penalty = searchParams.get("presence_penalty") || 0;
  const response_format = searchParams.get("response_format");

  const response = await fetch(
    `https://api.deepinfra.com/v1/openai/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        temperature: temperature,
        max_tokens: max_tokens,
        top_p: top_p,
        frequency_penalty: frequency_penalty,
        presence_penalty: presence_penalty,
        ...(response_format === "json_object"
          ? { response_format: { type: "json_object" } }
          : {}),
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    const errorMessage =
      typeof data?.error?.message === "string"
        ? data.error.message
        : "AI provider error";
    return NextResponse.json({ error: errorMessage }, { status: response.status });
  }
  if (data?.error) {
    const errorMessage =
      typeof data.error?.message === "string"
        ? data.error.message
        : "AI provider error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
  return NextResponse.json(data);
}
