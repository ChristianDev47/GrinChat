'use client';
import { useState } from 'react';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import { SendFileType } from '@/src/types/message';
import { socket } from '@/src/config/socket';
import { useAuth } from '@/src/hooks/useAuth';
import { useConversation } from '@/src/hooks/useConversation';
import closeIcon from '../../../assets/close.svg';
import sendIcon from '../../../assets/send.svg';
import plusIcon from '../../../assets/plus.svg';
import docxIcon from '../../../assets/docx.svg';

interface Props {
  imageSrc: SendFileType[];
  setImageSrc: React.Dispatch<React.SetStateAction<SendFileType[]>>;
}

interface UploadResponse {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  error?: string;
}

const allowedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'video/mp4',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
  'application/xml',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
  'application/vnd.ms-excel', 
  'text/plain',
  'application/zip',
  'application/x-rar-compressed',
];

export default function FilePage({
  imageSrc,
  setImageSrc,
}: Props) {
  const [imageView, setImageView] = useState<number>(0);
  const { user } = useAuth();
  const { conversationData } = useConversation();
  const { participants, chatId } = conversationData;

  const handleSavefile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file && allowedFileTypes.includes(file.type)) {
        const imageUrl = URL.createObjectURL(file);
        setImageSrc((prevState) => [
          ...prevState,
          { data: file, content: null, file: imageUrl },
        ]);
      } else {
        console.error(
          'Invalid file type. Please select a valid file type: JPG, PNG, WEBP, PDF, TXT, DOCX, XLSX, or PPTX.'
        );
      }
    }
  };

  const UpdloadImages = () => {
    imageSrc.map(async (image) => {
      const fileBuffer = await image.data.arrayBuffer();
      const fileData = new Uint8Array(fileBuffer);
      socket.emit(
        'file_upload',
        { fileData, fileName: image.data.name },
        (response: UploadResponse) => {
          if (response.success) {
            let mainType = image.data.type.split('/')[0];
            if (
              image.data.type.split('/')[0] === 'application' ||
              image.data.type.split('/')[1] === 'text'
            ) {
              mainType = 'Document';
            }
            socket.emit('message_sent', {
              origin: user._id,
              message: image.content ?? null,
              destination: participants,
              fileUrl: response.fileUrl,
              fileName: response.fileName,
              messageType: mainType.charAt(0).toUpperCase() + mainType.slice(1),
              chatId: chatId,
            });
            setImageSrc([]);
          }
        }
      );
    });
  };

  const currentFile = imageSrc[imageView]?.data;
  const fileType = currentFile?.type;

  return (
    <div className={styles.FilePageView}>
      <div className={styles.Content}>
        <div className={styles.FilePageNav}>
          <button
            onClick={() => {
              setImageSrc([]);
            }}
          >
            <Image src={closeIcon} alt="" width={30} height={30} />
          </button>
        </div>
        <div className={styles.FilePageContent}>
          {imageSrc[imageView] && (
            <>
              {fileType?.startsWith('image/') ? (
                <div style={{ width: 'auto', height: '50vh' }}>
                  <Image
                    src={URL.createObjectURL(currentFile)}
                    alt=""
                    width={0}
                    height={0}
                    style={{ width: 'auto', height: '100%' }}
                  />
                </div>
              ) : fileType?.startsWith('video/') ? (
                <video controls style={{ width: 'auto', height: '380px' }}>
                  <source
                    src={URL.createObjectURL(currentFile)}
                    type={fileType}
                  />
                </video>
              ) : (
                <div className={styles.Documents}>
                  <Image src={docxIcon} alt="user" width={60} height={60} />
                  <p>{imageSrc[imageView].data.name}</p>
                  <p>
                    {imageSrc[imageView].data.size} -{' '}
                    {imageSrc[imageView].data.name.split('.').pop()}
                  </p>
                </div>
              )}
              <div className={styles.FileContent}>
                <input
                  value={imageSrc[imageView].content ?? ''}
                  onChange={(e) => {
                    setImageSrc(
                      imageSrc.map((image) => {
                        if (image.file === imageSrc[imageView].file) {
                          return {
                            ...image,
                            content: e.target.value,
                          };
                        }
                        return image;
                      })
                    );
                  }}
                  type="text"
                  name=""
                  id=""
                  placeholder="Añade un comentario"
                />
              </div>
            </>
          )}
        </div>
        <div className={styles.FilePageFoot}>
          <div>
            {imageSrc.map((image, index) => {
              const fileUrl = image.file;
              return (
                <button
                  className={styles.Files}
                  key={index}
                  onClick={() => setImageView(index)}
                >
                  {image.data.type.startsWith('image/') && (
                    <div
                      className={styles.ImagePreview}
                      style={{ backgroundImage: `url(${fileUrl})` }}
                    />
                  )}
                  {image.data.type.startsWith('video/') ? (
                    <div className={styles.VideoPreview}>
                      <video
                        src={fileUrl}
                        muted
                        autoPlay={false}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  ) : (
                    <Image src={docxIcon} alt="user" width={25} height={25} />
                  )}
                </button>
              );
            })}
            <div className={styles.AddFile}>
              <label
                htmlFor="file"
                className="menu-item"
                role="button"
                aria-label="Destacar"
              >
                <Image src={plusIcon} alt="" width={30} height={30} />
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  accept="image/jpeg,image/png,video/mp4"
                  onChange={(e) => handleSavefile(e)}
                />
              </label>
            </div>
          </div>
          <button
            onClick={() => {
              UpdloadImages();
            }}
            className={styles.sentFiles}
          >
            <Image src={sendIcon} alt="" width={30} height={30} />
          </button>
        </div>
      </div>
    </div>
  );
}
