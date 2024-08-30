import { io } from 'socket.io-client';

export const socket = io('https://grinchat.onrender.com', {
  withCredentials: true,
});
