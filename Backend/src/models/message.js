import { Message } from './database/schemas/schemasDB.js';

class MessageModel {
  // GET ALL
  static async getAll() {
    try {
      const messages = await Message.find().populate('response').exec();
      return messages;
    } catch (error) {
      throw new Error('Error getting messages: ', error);
    }
  }

  // CREATE MESSAGE
  static async create({ message }) {
    try {
      const messages = await Message.create(message);
      return messages;
    } catch (error) {
      throw new Error('Error creating message: ', error);
    }
  }

  // UPDATE MESSAGE
  static async update({ messageId, message }) {
    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        message,
        { new: true, runValidators: true }
      );
      if (updatedMessage !== null) {
        return updatedMessage;
      } else {
        throw new Error('Message not found');
      }
    } catch (error) {
      throw new Error('Error updating message: ', error);
    }
  }

  // DELETE MESSAGE
  static async delete({ messageId }) {
    try {
      const deletedMessage = await Message.findByIdAndDelete(messageId);
      if (deletedMessage !== null) {
        return { message: 'Message deleted sucessfull' };
      } else {
        throw new Error('Message not found');
      }
    } catch (error) {
      throw new Error('Error deleting message: ', error);
    }
  }

  // GET MESSAGE BY ID
  static async getById({ messageId }) {
    try {
      const message = await Message.findById(messageId)
        .populate('response')
        .exec();
      if (message !== null) {
        return message;
      } else {
        throw new Error('Message not found');
      }
    } catch (error) {
      throw new Error('Error getting message: ', error);
    }
  }

  // GET MESSAGE BY CHAT
  static async getByChatId({ chatId }) {
    try {
      const message = await Message.find({ chatId })
        .populate('response')
        .exec();
      if (message !== null) {
        return message;
      }
    } catch (error) {
      throw new Error('Error getting message: ', error);
    }
  }
}

export default MessageModel;
