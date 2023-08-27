import express from 'express';
import { ChatService } from '../services/chat-service';
import { SocialNetwork } from '../models/positive-chat-cases';
import authenticated from '../middleware/authenticated';
import { defineBodyRoute } from '../helpers/define-route';
import { PhishingStatService } from '../services/phishing-stat-service';

interface AnalyzeRequestBody {
  messages: string[];
  profile?: string | null;
  profileName?: string | null;
}

export function ChatController(
  chatService: ChatService,
  phishingStatService: PhishingStatService,
) {
  const router = express.Router();

  router.post(
    '/analyze',
    authenticated,
    defineBodyRoute<AnalyzeRequestBody>(async (req, res) => {
      try {
        const { messages, profile, profileName } = req.body;
        const { username } = req.user!;
        if (!messages || messages.length === 0) {
          return res.status(400).json({ error: 'No messages sent' });
        }

        const { prediction, confidence } = await chatService.runModel(messages);
        if (prediction === 'phishing') {
          phishingStatService.incrementPhishingChats(new Date());
          chatService.savePositiveCase(
            profile || profileName || 'unknown',
            username,
            SocialNetwork.Twitter,
          );
        }

        res.status(200).json({ prediction, confidence });
      } catch (error: any) {
        res.status(400).send({ error: error.message });
      }
    }),
  );

  return router;
}
