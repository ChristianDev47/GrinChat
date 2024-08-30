import cloudinary from '../config/cloudinary.js';
import {
  validateUser,
  validatePartialUser,
} from '../schemas/validations/user.js';
import { hashPassword } from '../services/encryptPassword.js';
import generateToken from '../services/generateJWT.js';
import { client } from '../services/stream-client.js';

class UserController {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  getAll = async (req, res) => {
    try {
      const users = await this.userModel.getAll();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error getting users: ', error);
      res.status(404).json({ error: 'Error getting users' });
    }
  };

  create = async (req, res) => {
    try {
      const result = validateUser(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }

      const { email, password } = result.data;
      const existEmail = await this.userModel.verifyEmail({ userEmail: email });
      if (existEmail) {
        return res
          .status(401)
          .json({ error: 'Email is used in another account' });
      }

      const hashedPassword = await hashPassword(password);
      let newUser = {
        ...result.data,
        password: hashedPassword,
      };

      if (req.file) {
        newUser.profilePicture = req.file.path;
      }

      const user = await this.userModel.create({ user: newUser });

      const { token, expiration, serializedCookie } = await generateToken({
        user,
      });

      const myUser = {
        access_token: token,
        expiration,
      };

      const updatedToken = validatePartialUser(myUser);
      if (!updatedToken.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(updatedToken.error.message) });
      }

      const userCreated = await this.userModel.update({
        userId: user._id,
        user: myUser,
      });

      const myNewUser = {
        id: userCreated._id.toString(),
        name: userCreated.name,
        surname: userCreated.surname,
        profilePicture: userCreated.profilePicture,
      };

      await client.upsertUsers({ users: { [userCreated._id]: myNewUser } });

      res.setHeader('Set-Cookie', serializedCookie);
      res.status(201).json(userCreated);
    } catch (error) {
      console.error('Error creating user: ', error);
      res.status(500).json({ error: 'Error creating user' });
    }
  };

  update = async (req, res) => {
    try {
      const userId = req.params.id;
      // Image Verification updated
      let data = req.body;
      if (req.file) {
        // Getting old image to delete
        const user = await this.userModel.getById({ userId });
        if (
          user.profilePicture &&
          user.profilePicture.includes('cloudinary.com')
        ) {
          const publicId = user.profilePicture.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(
            `projects/chat_online/files/profile_picture/${publicId}`
          );
        }
        // Uploading the data of the new image
        // Upload Image
        const newImagePath = req.file.path;
        data = {
          ...data,
          profilePicture: newImagePath,
        };
      }
      const result = validatePartialUser(data);

      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }
      const { email, password } = result.data;
      if (password) {
        result.data.password = await hashPassword(password);
      }
      if (email) {
        const existEmail = await this.userModel.verifyEmail({
          userEmail: email,
        });
        if (existEmail) {
          return res
            .status(401)
            .json({ error: 'Email is used in other account' });
        }
      }
      const users = await this.userModel.update({ userId, user: result.data });
      res.status(200).json(users);
    } catch (error) {
      console.error('Error updating user: ', error);
      res.status(400).json({ error: 'Error updating user' });
    }
  };

  delete = async (req, res) => {
    try {
      const userId = req.params.id;
      // Getting old image to delete
      const user = await this.userModel.getById({ userId });
      if (user.profile && user.profile.includes('cloudinary.com')) {
        const publicId = user.profile.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(
          `projects/chat_online/files/profile_picture/${publicId}`
        );
      }
      const users = await this.userModel.delete({ userId });
      res.status(200).json(users);
    } catch (error) {
      console.error('Error deleting user: ', error);
      res.status(404).json({ error: 'Error deleting user' });
    }
  };

  getById = async (req, res) => {
    try {
      const userId = req.params.id;
      const users = await this.userModel.getById({ userId });
      res.status(200).json(users);
    } catch (error) {
      console.error('Error getting user: ', error);
      res.status(404).json({ error: 'Error getting user' });
    }
  };
}

export default UserController;
