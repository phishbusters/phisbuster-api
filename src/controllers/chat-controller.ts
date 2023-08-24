import express from 'express';
import { ChatService } from '../services/chat-service';
import { SocialNetwork } from '../models/positive-chat-cases';
import authenticated from '../middleware/authenticated';

export function ChatController(chatService: ChatService) {
  const router = express.Router();

  router.post('/analyze', authenticated, async (req, res) => {
    try {
      const { chatContent, scammerUserId } = req.body;
      const { username } = req.user!;
      if (!chatContent || chatContent.length === 0) {
        return res.status(400).json({ error: 'No messages sent' });
      }

      const { prediction, confidence } = await chatService.runModel(
        chatContent,
      );

      if (prediction === 'phishing') {
        chatService.savePositiveCase(
          scammerUserId,
          username,
          SocialNetwork.Twitter,
        );
      }

      res.status(200).json({ prediction, confidence, message: 'success' });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  });

  return router;
}
