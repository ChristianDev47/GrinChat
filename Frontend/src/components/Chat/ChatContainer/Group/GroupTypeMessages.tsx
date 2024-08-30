'use client';
import { useAuth } from '@/src/hooks/useAuth';
import { ChatType, Message, ParticipantsTypes } from '@/src/types/chat';
import Image from 'next/image';
import imageIcon from '../../../../assets/image.svg';
import videoIcon from '../../../../assets/video.svg';
import fileIcon from '../../../../assets/file.svg';
import audioIcon from '../../../../assets/audio.svg';
import styles from '../../../../../styles/Chat.module.css';

interface Props {
  chat: ChatType;
  message: Message;
  particpant?: ParticipantsTypes;
  adminGroup?: ParticipantsTypes;
}

export default function GroupTypeChatMessages({
  chat,
  message,
  particpant,
  adminGroup,
}: Props) {
  const { user } = useAuth();

  let groupParticipant: ParticipantsTypes | undefined;
  if (
    chat.type === 'Group' &&
    message &&
    (message.messageType === 'AddGroupParticipant' ||
      message.messageType === 'DeleteGroupParticipant')
  ) {
    groupParticipant = chat.participants.find(
      (part) => part.userId._id === message.content
    );
  }

  let groupParticipantOut: ParticipantsTypes | undefined;
  if (
    message.messageType === 'DeleteGroupParticipant' &&
    message.content === message.senderId
  ) {
    groupParticipantOut = chat.participants.find(
      (part) => part.userId._id === message.content
    );
  }

  const renderMessage = () => {
    if(particpant) {
      switch (message.messageType) {
        case 'Text':
          return (
            <p className={styles.SenderMessage}>
              {particpant.userId._id === user._id
                ? 'Tu'
                : `${particpant.userId.name} ${particpant.userId.surname}`}
              : {message.content}
            </p>
          );
  
        case 'Image':
          return (
            <>
              <p className={styles.SenderMessage}>
                {particpant.userId._id === user._id
                  ? 'Tu'
                  : `${particpant.userId.name} ${particpant.userId.surname}`}
                : <p className={styles.FilesTypes}><Image src={imageIcon} alt="user" width={18} height={18} /></p>
                <span>{message.content ?? 'Imagen'}</span>
              </p>
            </>
          );
  
        case 'Video':
          return (
            <>
              <p className={styles.SenderMessage}>
                {particpant.userId._id === user._id
                  ? 'Tu'
                  : `${particpant.userId.name} ${particpant.userId.surname}`}
                : <p className={styles.FilesTypes}><Image src={videoIcon} alt="user" width={18} height={18} /></p>
                <span>{message.content ?? 'Video'}</span>
              </p>
            </>
          );
  
        case 'Document':
          return (
            <>
              <p className={styles.SenderMessage}>
                {particpant.userId._id === user._id
                  ? 'Tu'
                  : `${particpant.userId.name} ${particpant.userId.surname}`}
                : <p className={styles.FilesTypes}><Image src={fileIcon} alt="user" width={18} height={18} /></p>
                <span>{message.content ?? 'Documento'}</span>
              </p>
            </>
          );
  
        case 'Audio':
          return (
            <>
              <p className={styles.SenderMessage}>
                {particpant.userId._id === user._id
                  ? 'Tu'
                  : `${particpant.userId.name} ${particpant.userId.surname}`}
                : <p className={styles.FilesTypes}><Image src={audioIcon} alt="user" width={18} height={18} /></p>
                <span>{message.content ?? 'Audio'}</span>
              </p>
            </>
          );
  
        case 'AddGroupParticipant':
          return (
            <p className={styles.SenderMessage}>
              {user._id === adminGroup?.userId._id && groupParticipant ? (
                <>
                  Haz agregado a {groupParticipant?.userId.name}{' '}
                  {groupParticipant?.userId.surname}
                </>
              ) : user._id === message.content ? (
                <>
                  {adminGroup?.userId.name} {adminGroup?.userId.surname} te ha
                  agregado al grupo
                </>
              ) : (
                <>
                  {adminGroup?.userId.name} {adminGroup?.userId.surname} ha
                  agregado a {groupParticipant?.userId.name}{' '}
                  {groupParticipant?.userId.surname}
                </>
              )}
            </p>
          );
  
        case 'DeleteGroupParticipant':
          return (
            <p className={styles.SenderMessage}>
              {user._id === adminGroup?.userId._id &&
              groupParticipant &&
              message.content !== message.senderId ? (
                <>
                  Haz eliminado a {groupParticipant?.userId.name}{' '}
                  {groupParticipant?.userId.surname}
                </>
              ) : user._id === message.content &&
                message.content !== message.senderId ? (
                <>
                  {adminGroup?.userId.name} {adminGroup?.userId.surname} te ha
                  eliminado del grupo
                </>
              ) : message.content === message.senderId &&
                message.senderId === user._id ? (
                <>Haz salido del grupo</>
              ) : message.content === message.senderId ? (
                <>
                  {groupParticipantOut?.userId.name}{' '}
                  {groupParticipantOut?.userId.surname} ha salido del grupo
                </>
              ) : (
                <>
                  {adminGroup?.userId.name} {adminGroup?.userId.surname} ha
                  eliminado del grupo a {groupParticipant?.userId.name}{' '}
                  {groupParticipant?.userId.surname}
                </>
              )}
            </p>
          );
  
        default:
          return null;
      }
    }
  };

  return <>{renderMessage()}</>;
}
