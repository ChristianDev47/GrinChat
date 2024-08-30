import cors from 'cors';

const ACCEPTED_ORIGINS = [
  'http://localhost:3001',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'https://grinchat.onrender.com',
  'https://grinchat.vercel.app',
];

export const corsMiddlewares = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });
