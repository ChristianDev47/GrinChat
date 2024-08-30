import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

class LogoutController {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  logout = async (req, res) => {
    const { sesion_security_token } = req.cookies;
    if (!sesion_security_token) {
      return res.status(401).json({ error: 'user not authenticated' });
    }
    try {
      res.setHeader(
        'Set-Cookie',
        'sesion_security_token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict'
      );
      return res.status(200).json({ message: 'Logout successfully' });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

export default LogoutController;
