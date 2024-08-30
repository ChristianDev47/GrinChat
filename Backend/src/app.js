import express from 'express';
import { config } from 'dotenv';
import connectDB from './config/database.js';
import MessageRouter from './routes/messageRoutes.js';
import MessageModel from './models/message.js';
import ChatRouter from './routes/chatRoutes.js';
import ChatModel from './models/chat.js';
import GroupChatRouter from './routes/groupChatRoutes.js';
import GroupChatModel from './models/groupChat.js';
import UserModel from './models/user.js';
import CallRouter from './routes/callRoutes.js';
import CallModel from './models/call.js';
import LoginRouter from './routes/loginRoutes.js';
import LogoutRouter from './routes/logoutRoutes.js';
import UserRouter from './routes/userRoutes.js';
import verifyToken from './Middlewares/userVerify.js';
import cookieParser from 'cookie-parser';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import swaggerDocs from '../documentation/swagger.js';
import { corsMiddlewares } from './Middlewares/cors.js';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { ChatSocketHandlers } from './sockets/chatSocket.js';
import { GroupSocketHandlers } from './sockets/groupSocket.js';
import { UserSocketHandlers } from './sockets/userSocket.js';
import { CallSocketHandlers } from './sockets/callSocket.js';
import { FileSocketHandlers } from './sockets/fileSocket.js';
import bodyParser from 'body-parser';

connectDB();

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN_IO,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
  connectionStateRecovery: {},
});

app.use(cookieParser());
app.use(corsMiddlewares());

app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
config();

app.use('/api/login', LoginRouter({ userModel: UserModel }));
app.use('/api/logout', LogoutRouter({ userModel: UserModel }));
app.use('/api/users', UserRouter({ userModel: UserModel }));
app.use('/api/users/images',express.static(join(CURRENT_DIR, '../src/public/user/profile')));
app.use('/api/messages', MessageRouter({ messageModel: MessageModel }));
app.use('/api/chats', ChatRouter({ chatModel: ChatModel }));
app.use('/api/groupChats', GroupChatRouter({ groupChatModel: GroupChatModel }));
app.use('/api/calls', CallRouter({ callModel: CallModel }));

const users = {};

io.on('connection', (socket) => {
  UserSocketHandlers(socket, io, users);
  ChatSocketHandlers(socket, io, users);
  GroupSocketHandlers(socket, io, users);
  CallSocketHandlers(socket, io, users);
  FileSocketHandlers(socket);
});

server.listen(process.env.PORT, () => {
  console.log(`🚀 Server listening`); 
  swaggerDocs(app);
});
