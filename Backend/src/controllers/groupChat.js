import {
  validateGroupChat,
  validatePartialGroupChat,
} from '../schemas/validations/groupChat.js';

class GroupChatController {
  constructor({ groupChatModel }) {
    this.groupChatModel = groupChatModel;
  }

  getAll = async (req, res) => {
    try {
      const groupChats = await this.groupChatModel.getAll();
      res.status(200).json(groupChats);
    } catch (error) {
      console.error('Error getting groupChats: ', error);
      res.status(404).json({ error: 'Error getting groupChats' });
    }
  };

  create = async (req, res) => {
    try {
      const result = validateGroupChat(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }
      const newGroupChat = await this.groupChatModel.create({
        groupChat: result.data,
      });
      res.status(201).json(newGroupChat);
    } catch (error) {
      console.error('Error creating groupChat: ', error);
      res.status(404).json({ error: 'Error creating groupChat' });
    }
  };

  update = async (req, res) => {
    try {
      const groupChatId = req.params.id;
      const result = validatePartialGroupChat(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }
      let data = result.data;
      const updatedGroupChat = await this.groupChatModel.update({
        groupChatId,
        groupChat: data,
      });
      res.status(200).json(updatedGroupChat);
    } catch (error) {
      console.error('Error updating groupChat: ', error);
      res.status(400).json({ error: 'Error updating groupChat' });
    }
  };

  delete = async (req, res) => {
    try {
      const groupChatId = req.params.id;
      const deletedgroupChat = await this.groupChatModel.delete({
        groupChatId,
      });
      res.status(200).json(deletedgroupChat);
    } catch (error) {
      console.error('Error deleting groupChat: ', error);
      res.status(404).json({ error: 'Error deleting groupChat' });
    }
  };

  getById = async (req, res) => {
    try {
      const groupChatId = req.params.id;
      const groupChats = await this.groupChatModel.getById({ groupChatId });
      res.status(200).json(groupChats);
    } catch (error) {
      console.error('Error getting groupChat: ', error);
      res.status(404).json({ error: 'Error getting groupChat' });
    }
  };

  getByUserId = async (req, res) => {
    try {
      const userId = req.params.id;
      const groupChats = await this.groupChatModel.getByUserId({ userId });
      res.status(200).json(groupChats);
    } catch (error) {
      console.error('Error getting groupChats: ', error);
      res.status(404).json({ error: 'Error getting groupChats' });
    }
  };
}

export default GroupChatController;
