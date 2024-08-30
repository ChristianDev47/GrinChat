import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';

const createUploadStream = (options, callback) => {
  return cloudinary.uploader.upload_stream(options, callback);
};

const uploadGroupImage = (fileData, fileName, callback) => {
  const bufferStream = new Readable();
  bufferStream.push(Buffer.from(fileData));
  bufferStream.push(null);

  const uploadOptions = {
    folder: 'projects/chat_online/group_image',
    public_id: `file_${Date.now()}`,
    resource_type: 'auto',
  };

  const uploadStream = createUploadStream(uploadOptions, (error, result) => {
    if (error) {
      console.error('Error uploading file:', error);
      return callback({ success: false, error: error.message });
    }
    const fileUrl = result.secure_url;
    callback({ success: true, fileUrl, fileName });
  });

  bufferStream.pipe(uploadStream);
};

export default uploadGroupImage;
