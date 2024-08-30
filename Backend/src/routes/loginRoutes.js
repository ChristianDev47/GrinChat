import { Router } from 'express';
import LoginController from '../controllers/login.js';

function LoginRouter({ userModel }) {
  const loginRoutes = Router();
  const loginController = new LoginController({ userModel });

  // DOCUMENTATION
  /**
   * @openapi
   * paths:
   *   /api/login:
   *     post:
   *       summary: Login
   *       tags: [Authentication]
   *       description: Authenticate a user with email and password.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 email:
   *                   type: string
   *                 password:
   *                   type: string
   *                   format: password
   *       responses:
   *         '200':
   *           description: Login successful
   *         '401':
   *           description: Unauthorized - Invalid email or password
   */

  // RUTAS
  loginRoutes.post('/', loginController.login);

  return loginRoutes;
}

export default LoginRouter;
