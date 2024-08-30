import { Chat } from './database/schemas/schemasDB.js';

class ChatModel {
  // GET ALL
  static async getAll() {
    try {
      const chats = await Chat.find().populate('participants.userId').exec();
      return chats;
    } catch (error) {
      throw new Error('Error getting chats: ', error);
    }
  }

  // CREATE CHAT
  static async create({ chat }) {
    try {
      const chats = await Chat.create(chat);
      return chats;
    } catch (error) {
      throw new Error('Error creating chat: ', error);
    }
  }

  // UPDATE CHAT
  static async update({ chatId, chat }) {
    try {
      const updatedChat = await Chat.findByIdAndUpdate(chatId, chat, {
        new: true,
        runValidators: true,
      });
      if (updatedChat !== null) {
        return updatedChat;
      } else {
        throw new Error('Chat not found');
      }
    } catch (error) {
      throw new Error('Error updating chat: ', error);
    }
  }

  // DELETE CHAT
  static async delete({ chatId }) {
    try {
      const deletedChat = await Chat.findByIdAndDelete(chatId);
      if (deletedChat !== null) {
        return { message: 'Chat deleted sucessfull' };
      } else {
        throw new Error('Chat not found');
      }
    } catch (error) {
      throw new Error('Error deleting chat: ', error);
    }
  }

  // GET CHAT BY ID
  static async getById({ chatId }) {
    try {
      const chat = await Chat.findById(chatId)
        .populate('participants.userId')
        .exec();
      if (chat !== null) {
        return chat;
      } else {
        throw new Error('Chat not found');
      }
    } catch (error) {
      throw new Error('Error getting chat: ', error);
    }
  }

  // GET CHAT BY PARTICIPANT
  static async getByUserId({ userId }) {
    try {
      const chat = await Chat.find({ 'participants.userId': userId })
        .populate('participants.userId')
        .exec();
      if (chat !== null) {
        return chat;
      } else {
        throw new Error('Chat not found');
      }
    } catch (error) {
      throw new Error('Error getting chat: ', error);
    }
  }
}

export default ChatModel;
