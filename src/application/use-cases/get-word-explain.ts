import { AIService } from "@/domain/services/ai";

export interface GetWordExplainWithAIInput {
  word: string;
}

export class GetWordExplainWithAIUseCase {
  constructor(private readonly aiService: AIService) {}

  async execute(input: GetWordExplainWithAIInput) {
    return this.aiService.getWordExplain(input.word);
  }
}
