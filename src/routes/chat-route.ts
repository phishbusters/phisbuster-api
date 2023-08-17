import { ChatController } from '../controllers/chat-controller';
import { ChatRepository } from '../repositories/chat-repository';
import { ChatService } from '../services/chat-service';

const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);
const chatController = ChatController(chatService);

export { chatController as ChatRoutes };
