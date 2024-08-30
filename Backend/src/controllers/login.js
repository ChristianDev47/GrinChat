import { comparePasswords } from '../services/authService.js';
import { serialize } from 'cookie';
import { client } from '../services/stream-client.js';

class LoginController {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Verifiy email and user
      const user = await this.userModel.verifyEmail({ userEmail: email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const passwordCorrect = await comparePasswords(password, user.password);
      if (!passwordCorrect) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;

      const token = client.createToken(user._id.toString(), expiry);

      const newTokenData = { access_token: token, expiration: expiry };
      const updatedToken = await this.userModel.update({
        userId: user._id,
        user: newTokenData,
      });
      if (!updatedToken) {
        return res.status(500).json({ error: 'Token was not updated' });
      }

      // Serialice token
      const serialized = serialize('sesion_security_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        path: '/',
      });

      res.setHeader('Set-Cookie', serialized);

      return res.json(updatedToken);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export default LoginController;
