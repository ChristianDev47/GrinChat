'use client';

import Image from 'next/image';
import styles from '../../../../../styles/Chat.module.css';
import { useAuth } from '@/src/hooks/useAuth';
import TypeChatMessages from './TypeMessage';
import ChatDontReadMessages from './ChatDontReadMessage';
import { ChatType, Message, ParticipantsTypes } from '@/src/types/chat';
import { User } from '@/src/types/user';
import userIcon from '../../../../assets/user.svg';
import CheckMessages from '../CheckMessages';

interface Props {
  chat: ChatType;
  message: Message;
  messagesDontReaded: Message[];
  participnat: User;
}

export default function ChatComponent({
  chat,
  participnat,
  message,
  messagesDontReaded,
}: Props) {
  const { user } = useAuth();

  return (
    <>
      <div className={styles.Image}>
        {participnat !== null && participnat.profilePicture ? (
          <Image
            className={styles.ImagePosition}
            src={participnat.profilePicture}
            alt="user"
            width={100}
            height={100}
            priority
          />
        ) : (
          <Image src={userIcon} alt="user" width={30} height={30} priority/>
        )}
      </div>
      <div className={styles.Info}>
        <div>
          {chat.participants.map((particpant: ParticipantsTypes) => {
            if (particpant.userId._id !== user._id) {
              return (
                <div key={particpant.userId._id}>
                  <h3>
                    {particpant.userId.name} {particpant.userId.surname}
                  </h3>
                  {message && (
                    <div className={styles.LastMessage}>
                      <TypeChatMessages message={message} />
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
        <div className={styles.ChatInfoMessageIcons}>
        <ChatDontReadMessages
          chat={chat}
          message={message}
          messagesDontReaded={messagesDontReaded}
        />
        {
          user._id === message.senderId &&
          <CheckMessages message={message} />
        }
        </div>
      </div>
    </>
  );
}
