'use client';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import { useMessages } from '@/src/hooks/useMessages';
import { Message } from '@/src/types/message';
import AudioPlayer from 'react-h5-audio-player';
import docxIcon from '../../../assets/docx.svg';
import 'react-h5-audio-player/lib/styles.css';

interface Props {
  data: Message;
}

export default function MessageResponse({ data }: Props) {
  const { user, participants } = useMessages();

  return (
    <>
      {data && (
        <div className={styles.ResponseMessageContent}>
          <div className={styles.ResponseMessageContentData}>
            <p className={styles.ResponseColor}>
              {user._id !== data.senderId
                ? participants?.map((participant) => {
                    if (participant.userId._id === data.senderId) {
                      return `${participant.userId?.name} ${participant.userId?.surname}`;
                    }
                  })
                : 'Tu'}
            </p>
            {data.content && <p>{data.content}</p>}
          </div>
          {data?.fileUrl && (
            <div className={styles.ResponseMessageContentDataFile}>
              {data?.messageType?.startsWith('Image') ? (
                <Image
                  className={styles.Image}
                  src={data.fileUrl}
                  alt=""
                  width={400}
                  height={400}
                  style={{ width: 'auto', height: '100px' }}
                />
              ) : data.messageType?.startsWith('Video') ? (
                <video
                  src={data.fileUrl}
                  muted
                  className={styles.Image}
                  autoPlay={false}
                  style={{ width: 'auto', height: '100px', objectFit: 'cover' }}
                />
              ) : data.messageType?.startsWith('Document') ? (
                <div className={styles.FileDocument}>
                  <div className={styles.Content}>
                    <Image src={docxIcon} alt="user" width={25} height={25} />
                    <div>
                      <p>{data.fileName}</p>
                      <p>{data.fileName.split('.').pop()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                data.messageType?.startsWith('Audio') && (
                  <div className={styles.Audio}>
                    <AudioPlayer
                      style={{ borderRadius: '1rem' }}
                      src={data.fileUrl}
                      preload="auto"
                    />
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
