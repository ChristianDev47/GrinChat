import {
  validateCall,
  validatePartialCall,
} from '../schemas/validations/call.js';

class CallController {
  constructor({ callModel }) {
    this.callModel = callModel;
  }

  getAll = async (req, res) => {
    try {
      const calls = await this.callModel.getAll();
      res.status(200).json(calls);
    } catch (error) {
      console.error('Error getting calls: ', error);
      res.status(404).json({ error: 'Error getting calls' });
    }
  };

  create = async (req, res) => {
    try {
      const result = validateCall(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }
      const newCall = await this.callModel.create({ call: result.data });
      res.status(201).json(newCall);
    } catch (error) {
      console.error('Error creating call: ', error);
      res.status(404).json({ error: 'Error creating call' });
    }
  };

  update = async (req, res) => {
    try {
      const callId = req.params.id;
      const result = validatePartialCall(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }
      let data = result.data;
      const updatedCall = await this.callModel.update({ callId, call: data });
      res.status(200).json(updatedCall);
    } catch (error) {
      console.error('Error updating call: ', error);
      res.status(400).json({ error: 'Error updating call' });
    }
  };

  delete = async (req, res) => {
    try {
      const callId = req.params.id;
      const deletedcall = await this.callModel.delete({ callId });
      res.status(200).json(deletedcall);
    } catch (error) {
      console.error('Error deleting call: ', error);
      res.status(404).json({ error: 'Error deleting call' });
    }
  };

  getById = async (req, res) => {
    try {
      const callId = req.params.id;
      const calls = await this.callModel.getById({ callId });
      res.status(200).json(calls);
    } catch (error) {
      console.error('Error getting call: ', error);
      res.status(404).json({ error: 'Error getting call' });
    }
  };

  getByUserId = async (req, res) => {
    try {
      const userId = req.params.id;
      const calls = await this.callModel.getByUserId({ userId });
      res.status(200).json(calls);
    } catch (error) {
      console.error('Error getting calls: ', error);
      res.status(404).json({ error: 'Error getting calls' });
    }
  };
}

export default CallController;
