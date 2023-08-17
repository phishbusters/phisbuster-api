import {
  IPositiveChatCase,
  PositiveChatCase,
  SocialNetwork,
} from '../models/positive-chat-cases';

export class ChatRepository {
  async save(
    scammerUserId: string,
    affectedUserId: string,
    socialNetwork: SocialNetwork,
  ): Promise<IPositiveChatCase> {
    const positiveCase = new PositiveChatCase({
      scammerUserId,
      affectedUserId,
      socialNetwork,
    });

    return positiveCase.save();
  }
}
