import { UserRoutes } from './user-route';
import { ChatRoutes } from './chat-route';
import { DigitalAssetRoutes } from './digital-asset-route';
import { PhishingStatRoute } from './phishing-stat-route';
import { ProfileRoutes } from './profile-route';
import { TakeDownRoutes } from './take-down-route';

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
    route: '/assets',
    controller: DigitalAssetRoutes,
  },
  {
    route: '/phishing-stats',
    controller: PhishingStatRoute,
  },
  {
    route: '/profile',
    controller: ProfileRoutes,
  },
  {
    route: '/take-downs',
    controller: TakeDownRoutes,
  },
];
