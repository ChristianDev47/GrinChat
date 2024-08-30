import ChatModel from '../models/chat.js';
import GroupChatModel from '../models/groupChat.js';
import MessageModel from '../models/message.js';

export const ChatSocketHandlers = (socket, io, users) => {
  socket.on('message_sent', async (data) => {
    const user = users[data.origin];
    if (user) {
      try {
        let chatId = data.chatId;
        if (!chatId) {
          const participants = data.destination.map((user) => {
            return {
              userId: user.userId._id,
            };
          });
          const chatParticipant = [...participants, { userId: data.origin }];
          const newChat = await ChatModel.create({
            chat: { participants: chatParticipant },
          });
          const myChat = await ChatModel.getById({ chatId: newChat._id });
          myChat.participants.map((user) => {
            if (user.userId._id.toString() !== data.origin) {
              io.to(users[data.origin]).emit('update_chat', {
                participants: myChat.participants,
                chatId: newChat._id,
              });
              io.to(users[user.userId._id]).emit('update_chat');
            }
          });

          chatId = newChat._id;
        }

        let message = {
          chatId: chatId,
          senderId: data.origin,
          content: data.message,
          status: 'Sent',
        };

        if (data.fileUrl) {
          message = {
            ...message,
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            messageType: data.messageType,
          };
        }

        if (data.response) {
          message = {
            ...message,
            response: data.response,
          };
        }

        const newMessage = await MessageModel.create({ message });
        const messageWithData = await MessageModel.getById({
          messageId: newMessage._id,
        });
        data.destination.map((user) => {
          const socketId = users[user.userId._id];
          if (user.userId._id !== data.origin) {
            io.to(socketId).emit('message_sent', messageWithData);
          }
        });
        io.to(user).emit('message_sent', messageWithData);

        setTimeout(async () => {
          const delveredMessage = await MessageModel.update({
            messageId: newMessage._id,
            message: {
              status: 'Delivered',
              DeliverTime: new Date().toISOString(),
            },
          });
          const messageWithData = await MessageModel.getById({
            messageId: delveredMessage._id,
          });
          io.to(user).emit('message_status', messageWithData);
          data.destination.map((user) => {
            const socketId = users[user.userId._id];
            if (user.userId._id !== data.origin) {
              io.to(socketId).emit('message_status', messageWithData);
            }
          });
        }, 1000);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }
  });

  socket.on('message_update_status', async (data) => {
    try {
      const { messageId, origin, destination } = data;
      const updatedMessage = await MessageModel.update({
        messageId,
        message: { status: 'Read', ReadTime: new Date().toISOString() },
      });
      const messageWithData = await MessageModel.getById({
        messageId: updatedMessage._id,
      });
      io.to(users[origin]).emit('message_status_read', messageWithData);
      destination.map((participant) => {
        if (participant.userId._id !== origin) {
          io.to(users[participant.userId._id]).emit(
            'message_status_read',
            messageWithData
          );
        }
      });
    } catch (error) {
      console.error('Error updating message status to Read:', error);
    }
  });

  socket.on('delete_message', async (data) => {
    try {
      const { message, origin, destination } = data;
      await MessageModel.delete({ messageId: message._id });
      io.to(users[origin]).emit('message_deleted', message);
      destination.map((participant) => {
        if (participant.userId._id !== origin) {
          io.to(users[participant.userId._id]).emit('message_deleted', message);
        }
      });
    } catch (error) {
      console.error('Error deleting message status to Read:', error);
    }
  });

  socket.on('delete_chat', async (data) => {
    try {
      const { chatId, newParticipants, outUser } = data;
      const newGroup = await GroupChatModel.update({
        groupChatId: chatId,
        groupChat: { participants: newParticipants },
      });
      await GroupChatModel.getById({ groupChatId: newGroup._id });
      io.to(users[outUser]).emit('update_chat');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  });

  socket.on('update_user_chat', async (data) => {
    try {
      const { chatId, newParticipants, user, status } = data;
      const newChat = await ChatModel.update({
        chatId,
        chat: { participants: newParticipants },
      });
      const chatData = await ChatModel.getById({ chatId: newChat._id });
      const myParticiant = chatData.participants.find(
        (part) => part.userId._id.toString() === user._id
      );
      if (status === 'Delete' || status === 'Out') {
        io.to(users[myParticiant.userId._id]).emit('update_participants', {
          participants: chatData.participants,
          chatId: chatData._id,
        });
      } else {
        chatData.participants.map((participant) => {
          io.to(users[participant.userId._id]).emit('update_participants', {
            participants: chatData.participants,
            chatId: chatData._id,
          });
        });
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  });
};
