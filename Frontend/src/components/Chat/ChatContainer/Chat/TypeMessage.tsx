'use client';
import { Message } from '@/src/types/chat';
import Image from 'next/image';
import styles from '../../../../../styles/Chat.module.css';
import imageIcon from '../../../../assets/image.svg';
import videoIcon from '../../../../assets/video.svg';
import fileIcon from '../../../../assets/file.svg';
import audioIcon from '../../../../assets/audio.svg';
import callIcon from '../../../../assets/call.svg';
import { useAuth } from '@/src/hooks/useAuth';

export default function TypeChatMessages({ message }: { message: Message }) {
  const { user } = useAuth();
  const renderMessage = () => {
    switch (message.messageType) {
      case 'Text':
        return (
          <p className={styles.SenderMessage}>
            {message.senderId === user._id && (
              <span className={styles.Sender}>Tu: </span>
            )}
            <span>{message.content}</span>
          </p>
        );

      case 'Image':
        return (
          <>
            <p className={styles.SenderMessage}>
            {message.senderId === user._id && (
              <span className={styles.Sender}>Tu: </span>
            )}
            <p className={styles.FilesTypes}><Image src={imageIcon} alt="user" width={18} height={18} /></p>
            <span>{message.content ?? 'Imagen'}</span>
          </p>
          </>
        );

      case 'Video':
        return (
          <>
            <p className={styles.SenderMessage}>
            {message.senderId === user._id && (
              <span className={styles.Sender}>Tu: </span>
            )}
            <p className={styles.FilesTypes}><Image src={videoIcon} alt="user" width={18} height={18} /></p>
            <span>{message.content ?? 'Video'}</span>
          </p>
          </>
        );

      case 'Document':
        return (
          <>
            <p className={styles.SenderMessage}>
            {message.senderId === user._id && (
              <span className={styles.Sender}>Tu: </span>
            )}
            <p className={styles.FilesTypes}><Image src={fileIcon} alt="user" width={18} height={18} /></p>
            <span>{message.content ?? 'Documento'}</span>
          </p>
          </>
        );

      case 'Audio':
        return (
          <>
            <p className={styles.SenderMessage}>
            {message.senderId === user._id && (
              <span className={styles.Sender}>Tu: </span>
            )}
            <p className={styles.FilesTypes}><Image src={audioIcon} alt="user" width={18} height={18} /></p>
            <span>{message.content ?? 'Audio'}</span>
          </p>
          </>
        );

      case 'Call_Ended':
      case 'Call_Cancelled':
      case 'Call_Missed':
        return (
          <>
            <p className={styles.SenderMessage}>
            {message.senderId === user._id && (
              <span className={styles.Sender}>Tu: </span>
              
            )}
             <p className={styles.FilesTypes}><Image src={callIcon} alt="user" width={18} height={18} /></p>
             <span>
              {message.messageType === 'Call_Ended'
                ? 'Llamada'
                : message.messageType === 'Call_Cancelled'
                ? 'Llamada Cancelada'
                : 'Llamada Perdida'}
             </span>
            </p>
          </>
        );

      case 'VideoCall_Ended':
      case 'VideoCall_Cancelled':
      case 'VideoCall_Missed':
        return (
          <>
            <p className={styles.SenderMessage}>
              {message.senderId === user._id && (
                <span className={styles.Sender}>Tu: </span>
              )}
              <p className={styles.FilesTypes}><Image src={videoIcon} alt="user" width={18} height={18} /></p>
              <span>
              {message.messageType === 'VideoCall_Ended'
                ? 'Video Llamada'
                : message.messageType === 'VideoCall_Cancelled'
                ? 'Video Llamada Cancelada'
                : 'Video Llamada Perdida'}
              </span>
            </p>
          </>
        );

      default:
        return null;
    }
  };

  return <>{renderMessage()}</>;
}
