import { GroupChat } from './database/schemas/schemasDB.js';

class GroupChatModel {
  // GET ALL
  static async getAll() {
    try {
      const groupChats = await GroupChat.find()
        .populate('participants.userId')
        .exec();
      return groupChats;
    } catch (error) {
      throw new Error('Error getting groupChats: ', error);
    }
  }

  // CREATE GROUP CHAT
  static async create({ groupChat }) {
    try {
      const groupChats = await GroupChat.create(groupChat);
      return groupChats;
    } catch (error) {
      throw new Error('Error creating groupChat: ', error);
    }
  }

  // UPDATE GROUP CHAT
  static async update({ groupChatId, groupChat }) {
    try {
      const updatedGroupChat = await GroupChat.findByIdAndUpdate(
        groupChatId,
        groupChat,
        { new: true, runValidators: true }
      );
      if (updatedGroupChat !== null) {
        return updatedGroupChat;
      } else {
        throw new Error('GroupChat not found');
      }
    } catch (error) {
      throw new Error('Error updating groupChat: ', error);
    }
  }

  // DELETE GROUP CHAT
  static async delete({ groupChatId }) {
    try {
      const deletedGroupChat = await GroupChat.findByIdAndDelete(groupChatId);
      if (deletedGroupChat !== null) {
        return { message: 'GroupChat deleted sucessfull' };
      } else {
        throw new Error('GroupChat not found');
      }
    } catch (error) {
      throw new Error('Error deleting groupChat: ', error);
    }
  }

  // GET GROUP CHAT BY ID
  static async getById({ groupChatId }) {
    try {
      const groupChat = await GroupChat.findById(groupChatId)
        .populate('participants.userId')
        .exec();
      if (groupChat !== null) {
        return groupChat;
      } else {
        throw new Error('GroupChat not found');
      }
    } catch (error) {
      throw new Error('Error getting groupChat: ', error);
    }
  }

  // GET GROUPCHAT BY PARTICIPANT
  static async getByUserId({ userId }) {
    try {
      const groupChat = await GroupChat.find({ 'participants.userId': userId })
        .populate('participants.userId')
        .exec();
      if (groupChat !== null) {
        return groupChat;
      } else {
        throw new Error('GroupChat not found');
      }
    } catch (error) {
      throw new Error('Error getting GroupChat: ', error);
    }
  }
}

export default GroupChatModel;
