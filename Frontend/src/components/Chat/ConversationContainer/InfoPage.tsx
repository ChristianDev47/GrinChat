'use client';
import { Dispatch, SetStateAction } from 'react';
import styles from '../../../../styles/Chat.module.css';
import { MessageInfo } from '@/src/types/message';
import Image from 'next/image';
import { formatDate, getTime } from '@/src/utilities/dateFormat';
import CheckMessages from '../ChatContainer/CheckMessages';
import closeIcon from '../../../assets/close.svg';
import checksIcon from '../../../assets/checks.svg';
import checksBlueIcon from '../../../assets/checksBlue.svg';
import { useMessages } from '@/src/hooks/useMessages';
import { useAuth } from '@/src/hooks/useAuth';
import docxIcon from '../../../assets/docx.svg';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface Props {
  setShowInfoPage: Dispatch<SetStateAction<MessageInfo>>;
  showInfoPage: MessageInfo;
}

export default function InfoPage({ setShowInfoPage, showInfoPage }: Props) {
  const data = showInfoPage.message;
  const { chat } = useMessages();
  const { user } = useAuth();
  let myUserOfGroup;
  if (chat?.type === 'Group') {
    myUserOfGroup = chat?.participants.find(
      (part) => part.userId._id === data?.senderId
    );
  }
  if (data) {
    return (
      <div className={styles.ShowInfoPageData}>
        <div className={styles.ContactListNav}>
          <button
            onClick={() => setShowInfoPage({ message: null, showPage: false })}
          >
            <Image src={closeIcon} alt="search" width={22} height={22} />
          </button>
          <p>Información del mensaje</p>
        </div>
        <div className={styles.ShowInfoPageDataContent}>
          <div className={styles.MessageOwner}>
            <div className={`${styles.MessageBox} ${styles.MessageBoxInfo}`}>
              <div className={styles.MessageBoxContent}>
                {chat?.type === 'Group' ? (
                  user._id === myUserOfGroup?.userId._id ? (
                    <p className={styles.GroupParticipant}>Tu</p>
                  ) : (
                    <p className={styles.GroupParticipant}>
                      {myUserOfGroup?.userId.name}{' '}
                      {myUserOfGroup?.userId.surname}
                    </p>
                  )
                ) : (
                  <></>
                )}
                <>
                  {data.fileUrl && (
                    <>
                      {data.messageType?.startsWith('Image') ? (
                        <Image
                          className={styles.Image}
                          src={data.fileUrl}
                          alt=""
                          width={400}
                          height={400}
                          style={{ width: 'auto', height: '200px' }}
                        />
                      ) : data.messageType?.startsWith('Video') ? (
                        <video
                          src={data.fileUrl}
                          muted
                          className={styles.Image}
                          autoPlay={false}
                          style={{
                            width: 'auto',
                            height: '200px',
                            objectFit: 'cover',
                          }}
                        />
                      ) : data.messageType?.startsWith('Document') ? (
                        <div className={styles.FileDocument}>
                          <div className={styles.Content}>
                            <Image
                              src={docxIcon}
                              alt="user"
                              width={25}
                              height={25}
                            />
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
                    </>
                  )}
                </>
                {
                  <div className={styles.MessageTimeAndChecInformation}>
                    <p>{data.content ?? ''}</p>
                    <div>
                      <p className={styles.Time}>{getTime(data.createdAt)}</p>
                      <CheckMessages message={data} />
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        <ul className={styles.InfoDataMessage}>
          <li>
            <div>
              <Image src={checksBlueIcon} alt="user" width={20} height={20} />
              <p>Leido</p>
            </div>
            <p>{data?.ReadTime ? formatDate(data?.ReadTime) : '--'}</p>
          </li>
          <li>
            <div>
              <Image src={checksIcon} alt="user" width={20} height={20} />
              <p>Entregado</p>
            </div>
            <p>{data?.DeliverTime ? formatDate(data?.DeliverTime) : '--'}</p>
          </li>
        </ul>
      </div>
    );
  }
}
