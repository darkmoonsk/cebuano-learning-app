import { UserRepository } from "@/domain/repositories/user-repository";
import {
  UserSettings,
  normalizeUserSettings,
} from "@/domain/value-objects/user-settings";

export interface UpdateUserSettingsInput {
  userId: string;
  settings: Partial<UserSettings>;
}

export class UpdateUserSettingsUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: UpdateUserSettingsInput): Promise<UserSettings> {
    const next = normalizeUserSettings(input.settings);
    await this.userRepository.updateSettings(input.userId, next);
    return next;
  }
}
