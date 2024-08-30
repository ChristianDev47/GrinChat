import { Router } from 'express';
import LogoutController from '../controllers/logout.js';

function LogoutRouter({ userModel }) {
  const logoutRoutes = Router();
  const logoutController = new LogoutController({ userModel });

  // DOCUMENTATION
  /**
   * @openapi
   * paths:
   *   /api/logout:
   *     post:
   *       summary: Logout
   *       tags: [Logout]
   *       description: Lgout user.
   *       responses:
   *         '200':
   *           description: Logout successful
   *         '401':
   *           description: Unauthorized
   */

  // RUTAS
  logoutRoutes.post('/', logoutController.logout);
  return logoutRoutes;
}

export default LogoutRouter;
