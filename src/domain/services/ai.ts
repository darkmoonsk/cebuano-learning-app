interface AIChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
      reasoning_content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

interface GeneratedPhrase {
  cebuano: string;
  english: string;
}

interface GeneratedPhrasesResponse {
  phrases: GeneratedPhrase[];
}

interface GeneratePhrasesInput {
  count: number;
  minWordCount: number;
}

export class AIService {
  async getWordExplain(word: string): Promise<string> {
    const prompt: string = `In a short sentence explain the following Cebuano word in English: ${word}`;
    const baseUrl: string =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const url: string = `${baseUrl}/api/ai?prompt=${encodeURIComponent(prompt)}`;
    const response: Response = await fetch(url);
    const data: AIChatResponse = (await response.json()) as AIChatResponse;
    if (!response.ok) {
      const message: string =
        typeof data.error?.message === "string"
          ? data.error.message
          : `AI API returned status ${response.status}`;
      throw new Error(message);
    }
    if (data.error?.message) {
      throw new Error(data.error.message);
    }
    const content: string | undefined = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error(`No content in AI response: ${JSON.stringify(data)}`);
    }
    return content;
  }

  async generatePhrases(
    input: GeneratePhrasesInput
  ): Promise<GeneratedPhrase[]> {
    const baseUrl: string =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const prompt: string = `Generate exactly ${input.count} Cebuano phrases for language learning. Each Cebuano phrase must have at least ${input.minWordCount} words. Every phrase must describe a real-life, everyday situation. Return ONLY a valid JSON object with this exact structure:
{
  "phrases": [
    { "cebuano": "phrase in Cebuano", "english": "phrase in English" }
  ]
}

Rules:
- Each Cebuano phrase must contain at least ${input.minWordCount} words.
- Use everyday, beginner-friendly phrases about real-life situations (home, school, work, travel, shopping, directions, greetings, food, health, time).
- Avoid abstract ideas, proverbs, fictional scenarios, or metaphors.
- Provide a clear English translation for each.
- Return ONLY the JSON object, no additional text or explanation.`;
    const url: string = `${baseUrl}/api/ai?prompt=${encodeURIComponent(
      prompt
    )}&max_tokens=800&response_format=json_object`;
    const response: Response = await fetch(url, { cache: "no-store" });
    const data: AIChatResponse = (await response.json()) as AIChatResponse;
    if (!response.ok) {
      const message: string =
        typeof data.error?.message === "string"
          ? data.error.message
          : `AI API returned status ${response.status}`;
      throw new Error(message);
    }
    if (data.error?.message) {
      throw new Error(data.error.message);
    }
    const message = data.choices?.[0]?.message;
    const content: string | undefined = message?.content;
    const reasoningContent: string | undefined = message?.reasoning_content;
    const rawText: string | undefined = content || reasoningContent;
    if (!rawText) {
      throw new Error(`No content in AI response: ${JSON.stringify(data)}`);
    }
    const jsonMatch: RegExpMatchArray | null = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON object found in AI response");
    }
    const parsed = JSON.parse(jsonMatch[0]) as GeneratedPhrasesResponse | GeneratedPhrase[];
    const phrases: GeneratedPhrase[] = Array.isArray(parsed)
      ? parsed
      : parsed.phrases;
    if (!Array.isArray(phrases)) {
      throw new Error("Invalid phrases payload in AI response");
    }
    const validPhrases: GeneratedPhrase[] = phrases.filter((phrase) => {
      const cebuano: string = String(phrase.cebuano || "").trim();
      const english: string = String(phrase.english || "").trim();
      const wordCount: number = cebuano.split(/\s+/).filter(Boolean).length;
      return cebuano.length > 0 && english.length > 0 && wordCount >= input.minWordCount;
    });
    if (validPhrases.length < input.count) {
      throw new Error("AI did not return enough valid phrases");
    }
    return validPhrases.slice(0, input.count).map((phrase) => ({
      cebuano: String(phrase.cebuano).trim(),
      english: String(phrase.english).trim(),
    }));
  }
}
