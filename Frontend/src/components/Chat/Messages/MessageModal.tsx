'use client';

import { MessageInfo, ResponseMessageType } from '@/src/types/message';
import styles from '../../../../styles/Chat.module.css';
import { Message } from '@/src/types/chat';
import { useAuth } from '@/src/hooks/useAuth';

interface Props {
  data: Message;
  setShowInfoPage: React.Dispatch<React.SetStateAction<MessageInfo>>;
  setResponseMessage: React.Dispatch<React.SetStateAction<ResponseMessageType>>;
  closeModal: () => void
}

export default function MessageModal({
  setShowInfoPage,
  setResponseMessage,
  closeModal,
  data,
}: Props) {
  const { user } = useAuth();

  return (
    <div className={`${styles.MessageModal} ${styles.ShowMessageModal}`}>
      <ul className={styles.MessageBoxModal}>
        <li
          onClick={() => {
            closeModal();
            setResponseMessage({ show: true, message: data });
          }}
          className="menu-item"
          role="button"
          aria-label="Responder"
        >
          Responder
        </li>
        {data.senderId === user._id && (
          <li
            onClick={() => {
              closeModal();
              setShowInfoPage({ showPage: true, message: data });
            }}
            className="menu-item"
            role="button"
            aria-label="Destacar"
          >
            Información
          </li>
        )}
      </ul>
    </div>
  );
}
