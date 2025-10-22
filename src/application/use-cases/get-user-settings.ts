import { UserRepository } from "@/domain/repositories/user-repository";
import { UserSettings } from "@/domain/value-objects/user-settings";

export interface GetUserSettingsInput {
  userId: string;
}

export class GetUserSettingsUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: GetUserSettingsInput): Promise<UserSettings> {
    return this.userRepository.getSettings(input.userId);
  }
}
