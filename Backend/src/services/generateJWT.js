import { serialize } from 'cookie';
import { client } from '../services/stream-client.js';

export default async function generateToken({ user }) {
  try {
    const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
    const token = client.createToken(user._id.toString(), expiry);

    const serializedCookie = serialize('sesion_security_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return { token, expiration: expiry.toString(), serializedCookie };
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Internal server error');
  }
}
