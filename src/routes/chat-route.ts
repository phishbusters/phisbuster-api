import { ChatController } from '../controllers/chat-controller';
import { ChatRepository } from '../repositories/chat-repository';
import { ChatService } from '../services/chat-service';
import { phishingStatService } from './phishing-stat-route';

const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);
const chatController = ChatController(chatService, phishingStatService);

export { chatController as ChatRoutes };
