'use client';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import ConversationNav from './ConversationNav';
import Messages from '../Messages/Messages';
import SendMessages from '../Messages/SendMessages';
import { useConversation } from '@/src/hooks/useConversation';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  MessageFileType,
  MessageInfo,
  ResponseMessageType,
  SendFileType,
} from '@/src/types/message';
import FilePage from '../Messages/FilePage';
import ViewFilePage from '../Messages/ViewFilePage';
import { AddParticipantType } from '@/src/types/chat';

interface Props {
  setShowInfoPage: Dispatch<SetStateAction<MessageInfo>>;
  setShowInfoContact: Dispatch<SetStateAction<boolean>>;
  setShowInfoGroup: Dispatch<SetStateAction<boolean>>;
  setEditGroupPage: Dispatch<SetStateAction<AddParticipantType>>;
}

export default function Conversation({
  setShowInfoPage,
  setShowInfoContact,
  setShowInfoGroup,
  setEditGroupPage,
}: Props) {
  const { conversationData } = useConversation();
  const [responseMessage, setResponseMessage] = useState<ResponseMessageType>({
    show: false,
    message: null,
  });
  const [imageSrc, setImageSrc] = useState<SendFileType[]>([]);
  const [messageFiles, setMessageFiles] = useState<MessageFileType>({
    show: false,
    message: [],
    messageSelected: null,
  });

  return (
    <div className={styles.ChatMessages}>
      {conversationData.participants === null &&
      conversationData.chatId === null ? (
        <div className={styles.InitialConversation}>
          <p>Inicia o crea <span>una conversación</span> </p>
          <Image
            src="/images/chat1.png"
            alt=""
            width={420}
            height={0}
            style={{ width: '420px', height: 'auto' }}
            priority
          />
        </div>
      ) : (
        <div className={styles.ConversationContent}>
          <ConversationNav
            setShowInfoContact={setShowInfoContact}
            setShowInfoGroup={setShowInfoGroup}
            setEditGroupPage={setEditGroupPage}
          />
          <div
            className={`${styles.ConversationSection} ${
              imageSrc.length === 0 && styles.ShowConversation
            }`}
          >
            <Messages
              setShowInfoPage={setShowInfoPage}
              setResponseMessage={setResponseMessage}
              setMessageFiles={setMessageFiles}
            />
            <SendMessages
              setResponseMessage={setResponseMessage}
              responseMessage={responseMessage}
              setImageSrc={setImageSrc}
            />
          </div>
          <div
            className={`${styles.FileSection} ${
              imageSrc.length > 0 && styles.ShowFile
            }`}
          >
            {imageSrc !== null && (
              <FilePage
                imageSrc={imageSrc}
                setImageSrc={setImageSrc}
              />
            )}
          </div>
          <div
            className={`${styles.FileSection} ${
              messageFiles.show === true && styles.ShowFile
            }`}
          >
            {messageFiles !== null && (
              <ViewFilePage
                messageFiles={messageFiles}
                setMessageFiles={setMessageFiles}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
