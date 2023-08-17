import { ChatRepository } from '../repositories/chat-repository';
import { envPrivateVars } from '../config/env-vars';
import {
  IPositiveChatCase,
  SocialNetwork,
} from '../models/positive-chat-cases';

export class ChatService {
  constructor(private chatRepository: ChatRepository) {}

  async runModel(notPreprocessChat: string[]): Promise<string> {
    try {
      const response = await fetch(envPrivateVars.chatFlaskService, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatContent: notPreprocessChat }),
      });

      if (!response.ok) {
        throw new Error('Error al ejecutar el modelo');
      }

      const data = await response.json();
      return data.classification; // Asumiendo que la respuesta incluye una propiedad 'classification'
    } catch (error) {
      console.error('Error al ejecutar el modelo:', error);
      throw new Error('Error al ejecutar el modelo');
    }
  }

  savePositiveCase(
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
