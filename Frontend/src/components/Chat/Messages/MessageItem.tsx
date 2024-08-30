'use client';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import MessageModal from './MessageModal';
import { Message, ParticipantsTypes } from '@/src/types/chat';
import { Dispatch, SetStateAction } from 'react';
import {
  MessageFileType,
  MessageInfo,
  ResponseMessageType,
} from '@/src/types/message';
import { useMessages } from '@/src/hooks/useMessages';
import CheckMessages from '../ChatContainer/CheckMessages';
import MessageFile from './FileTypeMessage';
import { getFormattedDateMessages, getTime } from '@/src/utilities/dateFormat';
import MessageResponse from './MessageResponse';
import callOutgoingIcon from '../../../assets/call_outgoing.svg';
import callMissedIcon from '../../../assets/call_missed.svg';
import callIncomingIcon from '../../../assets/call_incoming.svg';
import videoIcon from '../../../assets/video.svg';
import videoMissedIcon from '../../../assets/video_missed.svg';
import videoCancelledIcon from '../../../assets/video_cancelled.svg';
import bottonArrowIcon from '../../../assets/bottonArrow.svg';
import ModalToggle from '@/src/utilities/ModalToggle';
import userIcon from '../../../assets/user.svg';


interface Props {
  data: Message;
  setShowInfoPage: Dispatch<SetStateAction<MessageInfo>>;
  setResponseMessage: Dispatch<SetStateAction<ResponseMessageType>>;
  setMessageFiles: Dispatch<SetStateAction<MessageFileType>>;
  groupParticipant: ParticipantsTypes | undefined;
  myUserOfGroup: ParticipantsTypes | undefined;
  groupParticipantOut: ParticipantsTypes | undefined;
  index: number;
  prevMessage: Message | undefined;
  myMessage: string;
  setMyMessage: Dispatch<SetStateAction<string>>;
}

export default function MessageItem({
  data,
  groupParticipant,
  groupParticipantOut,
  setShowInfoPage,
  setResponseMessage,
  setMessageFiles,
  index,
  prevMessage,
  myUserOfGroup,
  setMyMessage,
}: Props) {
  const { chat, user } = useMessages();
  const adminGroup =
    chat && chat.participants.find((userG) => userG.role === 'Admin');

  const current = new Date(data.createdAt);
  const previous =
    index > 0 && prevMessage ? new Date(prevMessage.createdAt) : null;

  const shouldDisplayDate =
    !previous || current.getDate() !== previous.getDate();

  return (
    <>
      {shouldDisplayDate && (
        <div className={styles.GroupParticipantData}>
          <p>{getFormattedDateMessages(data.createdAt)}</p>
        </div>
      )}
      {chat &&
      chat.type === 'Group' &&
      data.messageType === 'AddGroupParticipant' ? (
        <div className={styles.GroupParticipantData}>
          {user._id === adminGroup?.userId._id && 
            data.content !== data.senderId ?(
            <p>
              {' '}
              Haz agregado a {groupParticipant?.userId.name}{' '}
              {groupParticipant?.userId.surname}
            </p>
          ) : user._id === data.content ? (
            <p>
              {adminGroup?.userId.name} {adminGroup?.userId.surname} te ha
              agregado al grupo
            </p>
          ) : (
            <p>
              {adminGroup?.userId.name} {adminGroup?.userId.surname} ha agregado
              a {groupParticipant?.userId.name}{' '}
              {groupParticipant?.userId.surname}
            </p>
          )}
        </div>
      ) : chat &&
        chat.type === 'Group' &&
        data.messageType === 'DeleteGroupParticipant' ? (
        <div className={styles.GroupParticipantData}>
          {user._id === adminGroup?.userId._id &&
          data.content !== data.senderId ? (
            <p>
              {' '}
              Haz eliminado a {groupParticipant?.userId.name}{' '}
              {groupParticipant?.userId.surname}
            </p>
          ) : user._id === data.content && data.content !== data.senderId ? (
            <p>
              {adminGroup?.userId.name} {adminGroup?.userId.surname} te ha
              eliminado del grupo
            </p>
          ) : data.content === data.senderId && data.senderId === user._id ? (
            <p>Haz salido del grupo</p>
          ) : data.content === data.senderId ? (
            <p>
              {groupParticipantOut?.userId.name}{' '}
              {groupParticipantOut?.userId.surname} ha salido del grupo
            </p>
          ) : (
            <p>
              {adminGroup?.userId.name} {adminGroup?.userId.surname} ha
              eliminado a {groupParticipant?.userId.name}{' '}
              {groupParticipant?.userId.surname}
            </p>
          )}
        </div>
      ) : (
        <div
          className={
            data.senderId === user._id
              ? styles.MessageOwner
              : styles.MessageDestination
          }
        >
          <div className={styles.MessageBox}>
            {data.response && (
              <div className={styles.MessageResponse}>
                <MessageResponse data={data.response} />
              </div>
            )}
            <div className={styles.MessageBoxContent}>
              {
                chat?.type === 'Group' && myUserOfGroup?.userId._id !== user._id &&
                <div className={styles.ImageGroupProfile}>
                {myUserOfGroup?.userId !== null && myUserOfGroup?.userId.profilePicture ? (
                  <Image
                    className={styles.ImagePosition}
                    src={myUserOfGroup?.userId.profilePicture}
                    alt="user"
                    width={100}
                    height={100}
                    priority
                  />
                ) : (
                  <Image src={userIcon} alt="user" width={30} height={30} priority/>
                )}
              </div>
              }
             <div className='w-full'>
             {chat?.type === 'Group' ? (
                user._id === myUserOfGroup?.userId._id ? (
                  <p className={styles.GroupParticipant}>Tu</p>
                ) : (
                  <p className={styles.GroupParticipant}>
                    {myUserOfGroup?.userId.name} {myUserOfGroup?.userId.surname}
                  </p>
                )
              ) : (
                <></>
              )}
              <MessageFile data={data} setMessageFiles={setMessageFiles} />
              {data.messageType?.startsWith('Call_Ended') ||
              data.messageType?.startsWith('Call_Cancelled') ||
              data.messageType?.startsWith('Call_Missed') ? (
                <div className={styles.CallType}>
                  <div className={styles.Content}>
                    <Image
                      src={
                        data.messageType?.startsWith('Call_Ended')
                          ? callOutgoingIcon
                          : data.messageType?.startsWith('Call_Cancelled')
                          ? callMissedIcon
                          : data.messageType?.startsWith('Call_Missed') &&
                            callIncomingIcon
                      }
                      alt="user"
                      width={25}
                      height={25}
                    />
                  </div>
                  <div className={styles.ContentCall}>
                    <p>
                      {data.messageType?.startsWith('Call_Ended')
                        ? 'Llamada'
                        : data.messageType?.startsWith('Call_Cancelled')
                        ? 'Llamada Cancelada'
                        : data.messageType?.startsWith('Call_Missed') &&
                          'Llamada Perdida'}
                    </p>
                    <p>{data.content}</p>
                  </div>
                </div>
              ) : data.messageType?.startsWith('VideoCall_Ended') ||
                data.messageType?.startsWith('VideoCall_Cancelled') ||
                data.messageType?.startsWith('VideoCall_Missed') ? (
                <div className={styles.CallType}>
                  <div className={styles.Content}>
                    <Image
                      src={
                        data.messageType?.startsWith('VideoCall_Ended')
                          ? videoIcon
                          : data.messageType?.startsWith('VideoCall_Cancelled')
                          ? videoMissedIcon
                          : data.messageType?.startsWith('VideoCall_Missed') &&
                            videoCancelledIcon
                      }
                      alt="user"
                      width={25}
                      height={25}
                    />
                  </div>
                  <div className={styles.ContentCall}>
                    <p>
                      {data.messageType?.startsWith('VideoCall_Ended')
                        ? 'Video Llamada'
                        : data.messageType?.startsWith('VideoCall_Cancelled')
                        ? 'Video Llamada Cancelada'
                        : data.messageType?.startsWith('VideoCall_Missed') &&
                          'Video Llamada Perdida'}
                    </p>
                    <p>{data.content}</p>
                  </div>
                </div>
              ) : (
                <div className={styles.MessageTimeAndChecInformation}>
                  <p>{data.content ?? ''}</p>
                  <div>
                    <span className={styles.Time}>{getTime(data.createdAt)}</span>
                    <CheckMessages message={data} />
                  </div>
                </div>
              )}

              <>
                {data.messageType !== 'Call_Ended' &&
                  data.messageType !== 'Call_Cancelled' &&
                  data.messageType !== 'Call_Missed' &&
                  data.messageType !== 'VideoCall_Ended' &&
                  data.messageType !== 'VideoCall_Cancelled' &&
                  data.messageType !== 'VideoCall_Missed' && (
                    <div onClick={() => { setMyMessage(data._id); }}>
                      <ModalToggle
                        modalId="user-modal"
                        toggleButtonId="user-toggle-btn"
                        ModalComponent={MessageModal}
                        title={
                          <Image
                            src={bottonArrowIcon}
                            alt="user"
                            width={18}
                            height={18}
                          />
                        }
                        className={styles.InfoModal}
                        setShowInfoPage={setShowInfoPage}
                        data={data}
                        setResponseMessage={setResponseMessage}
                      />
                    </div>
                  )}
              </>
             </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
