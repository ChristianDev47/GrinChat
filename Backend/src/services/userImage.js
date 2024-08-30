import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'projects/chat_online/profile_pictures',
    format: async (req, file) => {
      'jpg', 'png', 'jpeg';
    },
    public_id: (req, file) => `profile_${Date.now()}`,
  },
});

export const uploadProfileImage = multer({ storage: storage });
