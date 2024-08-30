import GroupChatModel from '../models/groupChat.js';
import MessageModel from '../models/message.js';
import uploadGroupImage from '../services/groupImage.js';

export const GroupSocketHandlers = (socket, io, users) => {
  socket.on('group_image', async ({ fileData, fileName }, callback) => {
    try {
      uploadGroupImage(fileData, fileName, callback);
    } catch (error) {
      console.error('Error handling group image:', error);
      callback({ success: false, error: error.message });
    }
  });

  socket.on('create_group', async (data) => {
    try {
      const { name, image, contacts, admin } = data;
      const myusers = [...contacts, admin];
      const participants = myusers.map((user) => {
        if (user._id === admin._id) {
          return {
            userId: user._id,
            role: 'Admin',
          };
        } else {
          return {
            userId: user._id,
          };
        }
      });
      const newGroup = await GroupChatModel.create({
        groupChat: { name, image, participants },
      });
      const groupData = await GroupChatModel.getById({
        groupChatId: newGroup._id,
      });

      groupData.participants.map(async (participant) => {
        if (participant.role === 'Admin') {
          io.to(users[participant.userId._id]).emit('update_chat', {
            participants: groupData.participants,
            chatId: groupData._id,
          });
        } else {
          io.to(users[participant.userId._id]).emit('update_chat');
          const message = {
            chatId: groupData._id,
            senderId: admin._id,
            content: participant.userId._id,
            messageType: 'AddGroupParticipant',
            status: 'Read',
          };
          await MessageModel.create({ message });
        }
      });
    } catch (error) {
      console.error('Error creating group:', error);
    }
  });

  socket.on('add_participant', async (data) => {
    try {
      const { admin, new_participants, all_participants, chatId } = data;

      const newGroup = await GroupChatModel.update({
        groupChatId: chatId,
        groupChat: { participants: all_participants },
      });
      const groupData = await GroupChatModel.getById({
        groupChatId: newGroup._id,
      });

      new_participants.map(async (participant) => {
        const message = {
          chatId: groupData._id,
          senderId: admin._id,
          content: participant.userId._id,
          messageType: 'AddGroupParticipant',
          status: 'Read',
        };
        io.to(users[participant.userId._id]).emit('update_chat');
        const messageWithData = await MessageModel.create({ message });
        all_participants.map((part) => {
          io.to(users[part.userId._id]).emit('message_sent', messageWithData);
          io.to(users[part.userId._id]).emit('update_participants', {
            chatId: groupData._id,
            participants: groupData.participants,
          });
        });
      });
    } catch (error) {
      console.error('Error creating group:', error);
    }
  });

  socket.on('delete_participant', async (data) => {
    try {
      const { admin, all_participants, deleted_participants, chatId } = data;
      const newGroup = await GroupChatModel.update({
        groupChatId: chatId,
        groupChat: { participants: all_participants },
      });
      const groupData = await GroupChatModel.getById({
        groupChatId: newGroup._id,
      });

      deleted_participants.map(async (participant) => {
        const message = {
          chatId: groupData._id,
          senderId: admin._id,
          content: participant.userId,
          messageType: 'DeleteGroupParticipant',
          status: 'Read',
        };
        const messageWithData = await MessageModel.create({ message });
        all_participants.map((part) => {
          io.to(users[part.userId._id]).emit('message_sent', messageWithData);
          io.to(users[part.userId._id]).emit('update_participants', {
            chatId: groupData._id,
            participants: groupData.participants,
          });
        });
      });
    } catch (error) {
      console.error('Error creating group:', error);
    }
  });

  socket.on('out_participant', async (data) => {
    try {
      const { chatId, newParticipants, outUser } = data;
      const newGroup = await GroupChatModel.update({
        groupChatId: chatId,
        groupChat: { participants: newParticipants },
      });
      const groupData = await GroupChatModel.getById({
        groupChatId: newGroup._id,
      });
      const message = {
        chatId: groupData._id,
        senderId: outUser,
        content: outUser,
        messageType: 'DeleteGroupParticipant',
        status: 'Read',
      };
      const messageWithData = await MessageModel.create({ message });
      groupData.participants.map((part) => {
        io.to(users[part.userId._id]).emit('message_sent', messageWithData);
        io.to(users[part.userId._id]).emit('update_participants', {
          chatId: groupData._id,
          participants: groupData.participants,
        });
      });
    } catch (error) {
      console.error('Error creating group:', error);
    }
  });
};
