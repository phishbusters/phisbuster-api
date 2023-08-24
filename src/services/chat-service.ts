import { ChatRepository } from '../repositories/chat-repository';
import { envPrivateVars } from '../config/env-vars';
import {
  IPositiveChatCase,
  SocialNetwork,
} from '../models/positive-chat-cases';

export class ChatService {
  constructor(private chatRepository: ChatRepository) {}

  async runModel(
    notPreprocessChat: string[],
  ): Promise<{ prediction: string; confidence: string }> {
    try {
      const response = await fetch(envPrivateVars.chatFlaskService, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: notPreprocessChat.join(' ') }),
      });

      if (!response.ok) {
        throw new Error('Error al ejecutar el modelo');
      }

      const data = await response.json();
      const { prediction, confidence } = data;
      return { prediction, confidence };
    } catch (error) {
      console.error('Error al ejecutar el modelo:', error);
      throw new Error('Error al ejecutar el modelo');
    }
  }

  async savePositiveCase(
    scammerUserId: string,
    affectedUserId: string,
    socialNetwork: SocialNetwork,
  ): Promise<IPositiveChatCase> {
    return this.chatRepository.save(
      scammerUserId,
      affectedUserId,
      socialNetwork,
    );
  }
}
