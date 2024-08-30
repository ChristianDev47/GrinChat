import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import path from 'node:path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const createUploadStream = (options, callback) => {
  return cloudinary.uploader.upload_stream(options, callback);
};

const convertWebmToMp3 = (webmBuffer, callback) => {
  const bufferStream = new Readable();
  bufferStream.push(webmBuffer);
  bufferStream.push(null);

  let mp3Buffer = Buffer.alloc(0);

  ffmpeg(bufferStream)
    .outputFormat('mp3')
    .on('error', (err) => {
      console.error('Error converting file:', err);
      callback(err, null);
    })
    .on('end', () => {
      callback(null, mp3Buffer);
    })
    .pipe(
      new Readable({
        read() {
          this.push(mp3Buffer);
          this.push(null);
        },
      })
    )
    .on('data', (chunk) => {
      mp3Buffer = Buffer.concat([mp3Buffer, chunk]);
    });
};

const uploadFile = (fileData, fileName, callback) => {
  const extension = path.extname(fileName);
  if (extension === '.webm') {
    if (!(fileData instanceof Buffer)) {
      return callback({ success: false, error: 'Invalid file data' });
    }
    convertWebmToMp3(fileData, (err, mp3Buffer) => {
      if (err) {
        console.error('Error during conversion:', err);
        return callback({ success: false, error: err.message });
      }

      const bufferStream = new Readable();
      bufferStream.push(mp3Buffer);
      bufferStream.push(null);

      const uploadOptions = {
        folder: 'projects/chat_online/files',
        public_id: `file_${Date.now()}`,
        resource_type: 'auto',
      };

      const uploadStream = createUploadStream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Error uploading file:', error);
            return callback({ success: false, error: error.message });
          }
          const fileUrl = result.secure_url;
          callback({ success: true, fileUrl, fileName });
        }
      );

      bufferStream.pipe(uploadStream);
    });
  } else {
    const bufferStream = new Readable();
    bufferStream.push(fileData);
    bufferStream.push(null);

    const uploadOptions = {
      folder: 'projects/chat_online/files',
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
  }
};

export default uploadFile;
