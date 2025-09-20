import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get("prompt");
  const model = searchParams.get("model") || "openai/gpt-oss-120b";
  const temperature = searchParams.get("temperature") || 0.7;
  const max_tokens = searchParams.get("max_tokens") || 1000;
  const top_p = searchParams.get("top_p") || 1;
  const frequency_penalty = searchParams.get("frequency_penalty") || 0;
  const presence_penalty = searchParams.get("presence_penalty") || 0;

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
      }),
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
