export class AIService {
  async getWordExplain(word: string) {
    const prompt = `In a short setence explain a following cebuano word in english: ${word}`;
    const response = await fetch(`/api/ai?prompt=${prompt}`);
    const data = await response.json();
    return data.choices[0].message.content;
  }
}
