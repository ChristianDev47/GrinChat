import uploadFile from '../services/files.js';

export const FileSocketHandlers = (socket) => {
  socket.on('file_upload', async ({ fileData, fileName }, callback) => {
    try {
      uploadFile(fileData, fileName, callback);
    } catch (error) {
      console.error('Error handling file upload:', error);
      callback({ success: false, error: error.message });
    }
  });
};
