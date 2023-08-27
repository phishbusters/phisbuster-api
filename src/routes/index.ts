import { UserRoutes } from './user-route';
import { ChatRoutes } from './chat-route';
import { DigitalAssetRoutes } from './digital-asset-route';
import { PhishingStatRoute } from './phishing-stat-route';

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
  {
    route: '/phishing-stats',
    controller: PhishingStatRoute,
  },
];
