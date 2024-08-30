import { Call } from './database/schemas/schemasDB.js';

class CallModel {
  // GET ALL
  static async getAll() {
    try {
      const calls = await Call.find().populate('participants.userId').exec();
      return calls;
    } catch (error) {
      throw new Error('Error getting calls: ', error);
    }
  }

  // CREATE CALL
  static async create({ call }) {
    try {
      const calls = await Call.create(call);
      return calls;
    } catch (error) {
      throw new Error('Error creating call: ', error);
    }
  }

  // UPDATE CALL
  static async update({ callId, call }) {
    try {
      const updatedCall = await Call.findByIdAndUpdate(callId, call, {
        new: true,
        runValidators: true,
      });
      if (updatedCall !== null) {
        return updatedCall;
      } else {
        throw new Error('Call not found');
      }
    } catch (error) {
      throw new Error('Error updating call: ', error);
    }
  }

  // DELETE CALL
  static async delete({ callId }) {
    try {
      const deletedCall = await Call.findByIdAndDelete(callId);
      if (deletedCall !== null) {
        return { message: 'Call deleted sucessfull' };
      } else {
        throw new Error('Call not found');
      }
    } catch (error) {
      throw new Error('Error deleting call: ', error);
    }
  }

  // GET CALL BY ID
  static async getById({ callId }) {
    try {
      const call = await Call.findById(callId)
        .populate('participants.userId')
        .exec();
      if (call !== null) {
        return call;
      } else {
        throw new Error('Call not found');
      }
    } catch (error) {
      throw new Error('Error getting call: ', error);
    }
  }

  // GET CALL BY PARTICIPANT
  static async getByUserId({ userId }) {
    try {
      const call = await Call.find({ 'participants.userId': userId })
        .populate('participants.userId')
        .exec();
      if (call !== null) {
        return call;
      } else {
        throw new Error('Call not found');
      }
    } catch (error) {
      throw new Error('Error getting call: ', error);
    }
  }
}

export default CallModel;
