'use client';

import styles from '../../../../../styles/Chat.module.css';
import { useConversation } from '@/src/hooks/useConversation';
import { useAuth } from '@/src/hooks/useAuth';
import { getDayOfWeek } from '@/src/utilities/dateFormat';
import { ChatType, Message } from '@/src/types/chat';

interface Props {
  chat: ChatType;
  message: Message;
  messagesDontReaded: Message[];
}

export default function ChatDontReadMessages({
  chat,
  message,
  messagesDontReaded,
}: Props) {
  const { user } = useAuth();
  const { conversationData } = useConversation();
  const { chatId } = conversationData;

  return (
    <>
      {message && (
        <div className={styles.InfoMessages}>
          <p>{getDayOfWeek(message.createdAt)}</p>
          {messagesDontReaded.length > 0 &&
            message.senderId !== user._id &&
            chatId !== chat._id && (
              <div className={styles.MessagesNumber}>
                <div className={styles.Number}>{messagesDontReaded.length}</div>
              </div>
            )}
        </div>
      )}
    </>
  );
}
