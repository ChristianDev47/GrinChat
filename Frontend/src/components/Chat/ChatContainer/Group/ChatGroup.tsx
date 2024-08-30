'use client';

import Image from 'next/image';
import styles from '../../../../../styles/Chat.module.css';
import { useAuth } from '@/src/hooks/useAuth';
import CheckMessages from '../CheckMessages';
import { ChatType, Message } from '@/src/types/chat';
import { User } from '@/src/types/user';
import GroupTypeChatMessages from './GroupTypeMessages';
import ChatDontReadMessages from '../Chat/ChatDontReadMessage';
import userIcon from '../../../../assets/user.svg';

interface Props {
  chat: ChatType;
  message: Message;
  messagesDontReaded: Message[];
  participnat: User;
}

export default function ChatGroupComponent({
  chat,
  participnat,
  message,
  messagesDontReaded,
}: Props) {
  const { user } = useAuth();
  const adminGroup = chat.participants.find((userG) => userG.role === 'Admin');

  return (
    <>
      <div className={styles.Image}>
        {chat.image ? (
          <Image
            className={styles.ImagePosition}
            src={chat.image}
            alt="user"
            width={100}
            height={100}
          />
        ) : (
          <Image src={userIcon} alt="user" width={30} height={30} />
        )}
      </div>
      <div className={styles.Info}>
        <div>
          {chat.participants && chat.participants.map((particpant) => {
  console.log(particpant); 

            if (message && particpant.userId._id === message.senderId) {
              return (
                <div key={particpant.userId._id}>
                  <h3>{chat.name}</h3>
                  {message && adminGroup && (
                    <div className={styles.LastMessage}>                                <GroupTypeChatMessages
                        message={message}
                        adminGroup={adminGroup}
                        chat={chat}
                        particpant={particpant}
                      />
                    </div>
                  )}
                </div>
              );
            } else {
              if (!message && particpant.userId._id === user._id) {
                if (user._id === adminGroup?.userId._id) {
                  return (
                    <p key={participnat._id}>Has creado el grupo {chat.name}</p>
                  );
                } else {
                  return (
                    <p key={participnat._id}>
                      {adminGroup?.userId.name} {adminGroup?.userId.surname} te
                      ha agregado al grupo
                    </p>
                  );
                }
              }
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
