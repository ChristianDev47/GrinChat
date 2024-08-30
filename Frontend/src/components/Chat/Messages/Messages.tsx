'use client';
import styles from '../../../../styles/Chat.module.css';
import { Message } from '@/src/types/chat';
import { animated, useTransition } from 'react-spring';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import {
  MessageFileType,
  MessageInfo,
  ResponseMessageType,
} from '@/src/types/message';
import ModalDelete from './ModalDelete';
import { useMessages } from '@/src/hooks/useMessages';
import GroupParticipantData from './GroupParticipantMessage';
import MessageItem from './MessageItem';

interface Props {
  setShowInfoPage: Dispatch<SetStateAction<MessageInfo>>;
  setResponseMessage: Dispatch<SetStateAction<ResponseMessageType>>;
  setMessageFiles: Dispatch<SetStateAction<MessageFileType>>;
}

export default function Messages({
  setShowInfoPage,
  setResponseMessage,
  setMessageFiles,
}: Props) {
  const {
    chat,
    deleteModal,
    setDeleteModal,
    handleDeleteMessage,
    myMessage,
    setMyMessage,
  } = useMessages();

  const transitions = useTransition(deleteModal.show, {
    from: { opacity: 0, transform: 'translateY(-40px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(-40px)' },
  });
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chat?.messages]);

  return (
    <>
      <div className={styles.Messages} ref={messagesContainerRef}>
        <GroupParticipantData chat={chat} />
        {chat &&
          chat.messages.map((data: Message, index: number) => {
            let groupParticipant;
            if (
              chat.type === 'Group' &&
              (data.messageType === 'AddGroupParticipant' ||
                data.messageType === 'DeleteGroupParticipant')
            ) {
              groupParticipant = chat.participants.find(
                (part) => part.userId._id === data.content
              );
            }
            let groupParticipantOut;
            if (
              data.messageType === 'DeleteGroupParticipant' &&
              data.content === data.senderId
            ) {
              groupParticipantOut = chat.participants.find(
                (part) => part.userId._id === data.content
              );
            }
            let myUserOfGroup;
            if (chat.type === 'Group') {
              myUserOfGroup = chat.participants.find(
                (part) => part.userId._id === data.senderId
              );
            }
            return (
              <MessageItem
                data={data}
                setResponseMessage={setResponseMessage}
                setShowInfoPage={setShowInfoPage}
                groupParticipant={groupParticipant}
                setMessageFiles={setMessageFiles}
                groupParticipantOut={groupParticipantOut}
                index={index}
                prevMessage={index > 0 ? chat.messages[index - 1] : undefined}
                key={index}
                myUserOfGroup={myUserOfGroup}
                myMessage={myMessage}
                setMyMessage={setMyMessage}
              />
            );
          })}
        <div />
      </div>
      {transitions((style, item) =>
        item ? (
          <animated.div
            style={style}
            className={`${styles.DeleteModal} ${
              deleteModal.show === true && styles.DeleteModalShow
            }`}
          >
            <ModalDelete
              setDeleteModal={setDeleteModal}
              handleDeleteMessage={handleDeleteMessage}
            />
          </animated.div>
        ) : null
      )}
    </>
  );
}
