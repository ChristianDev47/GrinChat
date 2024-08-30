import {
  validateMessage,
  validatePartialMessage,
} from '../schemas/validations/message.js';

class MessageController {
  constructor({ messageModel }) {
    this.messageModel = messageModel;
  }

  getAll = async (req, res) => {
    try {
      const messages = await this.messageModel.getAll();
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error getting messages: ', error);
      res.status(404).json({ error: 'Error getting messages' });
    }
  };

  create = async (req, res) => {
    try {
      const result = validateMessage(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }
      let newMessage = { ...req.body };
      if (req.file) {
        newMessage.fileUrl = req.file.path;
        newMessage.fileName = req.file.originalname;
      }
      const createdMessage = await this.messageModel.create({
        message: newMessage,
      });
      res.status(201).json(createdMessage);
    } catch (error) {
      console.error('Error creating message: ', error);
      res.status(404).json({ error: 'Error creating message' });
    }
  };

  update = async (req, res) => {
    try {
      const messageId = req.params.id;
      const result = validatePartialMessage(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }
      let data = result.data;
      const updatedMessage = await this.messageModel.update({
        messageId,
        message: data,
      });
      res.status(200).json(updatedMessage);
    } catch (error) {
      console.error('Error updating message: ', error);
      res.status(400).json({ error: 'Error updating message' });
    }
  };

  delete = async (req, res) => {
    try {
      const messageId = req.params.id;
      const deletedmessage = await this.messageModel.delete({ messageId });
      res.status(200).json(deletedmessage);
    } catch (error) {
      console.error('Error deleting message: ', error);
      res.status(404).json({ error: 'Error deleting message' });
    }
  };

  getById = async (req, res) => {
    try {
      const messageId = req.params.id;
      const messages = await this.messageModel.getById({ messageId });
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error getting message: ', error);
      res.status(404).json({ error: 'Error getting message' });
    }
  };

  getByChatId = async (req, res) => {
    try {
      const chatId = req.params.id;
      const messages = await this.messageModel.getByChatId({ chatId });
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error getting messages: ', error);
      res.status(404).json({ error: 'Error getting messages' });
    }
  };
}

export default MessageController;
