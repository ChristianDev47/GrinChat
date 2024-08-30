'use client';
import { useEffect } from 'react';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import { useConversation } from '@/src/hooks/useConversation';
import { useChat } from '@/src/hooks/useChat';
import { MessageFileType } from '@/src/types/message';
import { formatDate } from '@/src/utilities/dateFormat';
import { downloadFile } from '@/src/utilities/downloadFile';
import userIcon from '../../../assets/user.svg';
import downloadIcon from '../../../assets/download.svg';
import docxIcon from '../../../assets/docx.svg';
import closeIcon from '../../../assets/close.svg';

interface Props {
  messageFiles: MessageFileType;
  setMessageFiles: React.Dispatch<React.SetStateAction<MessageFileType>>;
}

export default function ViewFilePage({ messageFiles, setMessageFiles }: Props) {
  const { conversationData } = useConversation();
  const { chatId, participants } = conversationData;
  const { chatData } = useChat();
  const chat = chatData.chats.find((chat) => chat._id === chatId);

  useEffect(() => {
    if (chat) {
      const newData = chat.messages.filter((message) => {
        return (
          message.messageType === 'Image' || message.messageType === 'Video'
        );
      });
      if (newData.length) {
        setMessageFiles((prevState) => ({ ...prevState, message: newData }));
      }
    }
  }, [chat]);

  const messageWithFile = messageFiles.message.find(
    (message) => message._id === messageFiles.messageSelected
  );
  const user = participants?.find(
    (myuser) => myuser.userId._id === messageWithFile?.senderId
  );
  const myUser = user?.userId;
  return (
    <div className={styles.FilePageView}>
      <div className={styles.Content}>
        <div className={styles.FilePageViewNav}>
          <div className={styles.ParticipantInfo}>
            <div className={styles.Image}>
              {myUser && myUser.profilePicture ? (
                <Image
                  src={myUser.profilePicture}
                  alt="user"
                  width={100}
                  height={100}
                  priority
                />
              ) : (
                <Image src={userIcon} alt="user" width={25} height={25} priority/>
              )}
            </div>
            <div>
              <p>
                {myUser?.name} {myUser?.surname}
              </p>
              <p>{messageWithFile && formatDate(messageWithFile?.createdAt)}</p>
            </div>
          </div>
          <div>
            {messageWithFile && (
              <button
                onClick={() =>
                  downloadFile(
                    messageWithFile?.fileUrl,
                    messageWithFile?.fileName
                  )
                }
                title="Descargar"
              >
                <Image src={downloadIcon} alt="" width={30} height={30} />
              </button>
            )}
            <button
              onClick={() =>
                setMessageFiles((prevState) => ({
                  ...prevState,
                  show: false,
                  messageSelected: null,
                }))
              }
              title="Cerrar"
            >
              <Image src={closeIcon} alt="" width={30} height={30} />
            </button>
          </div>
        </div>
        <div className={styles.FilePageViewContent}>
          {messageWithFile && (
            <>
              {messageWithFile.messageType?.startsWith('Image') ? (
                <div style={{ width: 'auto', height: '50vh' }}>
                  <Image
                    src={messageWithFile.fileUrl}
                    alt=""
                    sizes="20vw"
                    width={800}
                    height={800}
                    style={{ width: 'auto', height: '100%' }}
                  />
                </div>
              ) : (
                messageWithFile.messageType?.startsWith('Video') && (
                  <video controls style={{ width: 'auto', height: '480px' }}>
                    <source src={messageWithFile.fileUrl} />
                  </video>
                )
              )}
              <p>{messageWithFile?.content ?? messageWithFile.fileName}</p>
            </>
          )}
        </div>
        <div className={styles.FilePageViewFoot}>
          <div>
            {messageFiles.message.map((image, index) => {
              const fileUrl = image.fileUrl;
              return (
                <button
                  className={styles.Files}
                  key={index}
                  onClick={() =>
                    setMessageFiles((prevState) => ({
                      ...prevState,
                      messageSelected: image._id,
                    }))
                  }
                >
                  {image.messageType?.startsWith('Image') && (
                    <div
                      className={styles.ImagePreview}
                      style={{ backgroundImage: `url(${fileUrl})` }}
                    />
                  )}
                  {image.messageType?.startsWith('Video') ? (
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
          </div>
        </div>
      </div>
    </div>
  );
}
