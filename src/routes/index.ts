import { UserRoutes } from './user-route';
import { ChatRoutes } from './chat-route';

export const routes = [
  {
    route: '/user',
    controller: UserRoutes,
  },
  {
    route: '/chat',
    controller: ChatRoutes,
  },
];
