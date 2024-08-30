import {
  validateChat,
  validatePartialChat,
} from '../schemas/validations/chat.js';

class ChatController {
  constructor({ chatModel }) {
    this.chatModel = chatModel;
  }

  getAll = async (req, res) => {
    try {
      const chats = await this.chatModel.getAll();
      res.status(200).json(chats);
    } catch (error) {
      console.error('Error getting chats: ', error);
      res.status(404).json({ error: 'Error getting chats' });
    }
  };

  create = async (req, res) => {
    try {
      const result = validateChat(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }
      const newChat = await this.chatModel.create({ chat: result.data });
      res.status(201).json(newChat);
    } catch (error) {
      console.error('Error creating chat: ', error);
      res.status(404).json({ error: 'Error creating chat' });
    }
  };

  update = async (req, res) => {
    try {
      const chatId = req.params.id;
      const result = validatePartialChat(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }
      let data = result.data;
      const updatedChat = await this.chatModel.update({ chatId, chat: data });
      res.status(200).json(updatedChat);
    } catch (error) {
      console.error('Error updating chat: ', error);
      res.status(400).json({ error: 'Error updating chat' });
    }
  };

  delete = async (req, res) => {
    try {
      const chatId = req.params.id;
      const deletedchat = await this.chatModel.delete({ chatId });
      res.status(200).json(deletedchat);
    } catch (error) {
      console.error('Error deleting chat: ', error);
      res.status(404).json({ error: 'Error deleting chat' });
    }
  };

  getById = async (req, res) => {
    try {
      const chatId = req.params.id;
      const chats = await this.chatModel.getById({ chatId });
      res.status(200).json(chats);
    } catch (error) {
      console.error('Error getting chat: ', error);
      res.status(404).json({ error: 'Error getting chat' });
    }
  };

  getByUserId = async (req, res) => {
    try {
      const userId = req.params.id;
      const chats = await this.chatModel.getByUserId({ userId });
      res.status(200).json(chats);
    } catch (error) {
      console.error('Error getting chats: ', error);
      res.status(404).json({ error: 'Error getting chats' });
    }
  };
}

export default ChatController;
