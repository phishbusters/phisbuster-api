import { UserController } from '../controllers/user-controller';
import { UserService } from '../services/user-service';
import { UserRepository } from '../repositories/user-repository';

const userRepository = new UserRepository();
export const userService = new UserService(userRepository);
const userController = UserController(userService);

export { userController as UserRoutes };
