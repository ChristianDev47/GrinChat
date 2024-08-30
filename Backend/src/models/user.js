import { User } from './database/schemas/schemasDB.js';

class UserModel {
  // GET ALL
  static async getAll() {
    try {
      const users = await User.find()
        .populate('contacts.contactId')
        .populate('friendRequests.fromUserId')
        .exec();
      return users;
    } catch (error) {
      throw new Error('Error getting users: ', error);
    }
  }

  // CREATE USER
  static async create({ user }) {
    try {
      const users = await User.create(user);
      return users;
    } catch (error) {
      throw new Error('Error creating user: ', error);
    }
  }

  // UPDATE USER
  static async update({ userId, user }) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, user, {
        new: true,
        runValidators: true,
      }).exec();
      if (updatedUser !== null) {
        return updatedUser;
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error('Error updating user: ', error);
    }
  }

  // DELETE USER
  static async delete({ userId }) {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (deletedUser !== null) {
        return { message: 'User deleted sucessfull' };
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error('Error deleting user: ', error);
    }
  }

  // GET USER BY ID
  static async getById({ userId }) {
    try {
      const user = await User.findById(userId)
        .populate('contacts.contactId')
        .populate('friendRequests.fromUserId')
        .exec();
      if (user !== null) {
        return user;
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error('Error getting user: ', error);
    }
  }

  // GET USER BY EMAIL
  static async verifyEmail({ userEmail }) {
    try {
      const user = await User.findOne({ email: userEmail })
        .populate('contacts.contactId')
        .populate('friendRequests.fromUserId')
        .exec();
      if (user !== null) {
        return user;
      }
    } catch (error) {
      throw new Error('Error getting user: ', error);
    }
  }
}

export default UserModel;
