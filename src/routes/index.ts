import { UserRoutes } from './user-route';
import { ChatRoutes } from './chat-route';
import { DigitalAssetRoutes } from './digital-asset-route';

export const routes = [
  {
    route: '/user',
    controller: UserRoutes,
  },
  {
    route: '/chat',
    controller: ChatRoutes,
  },
  {
    route: '/asset',
    controller: DigitalAssetRoutes,
  },
];
