'use client';
import { useConversation } from '@/src/hooks/useConversation';
import styles from '../../../../styles/Chat.module.css';
import { useChat } from '@/src/hooks/useChat';
import { AddParticipantType } from '@/src/types/chat';
import { useAuth } from '@/src/hooks/useAuth';

interface Props {
  setShowInfoContact: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInfoGroup: React.Dispatch<React.SetStateAction<boolean>>;
  setEditGroupPage: React.Dispatch<React.SetStateAction<AddParticipantType>>;
  closeModal: () => void

}

export default function ConversationModal({setShowInfoContact, setShowInfoGroup, setEditGroupPage, closeModal}: Props) {
  const { user } = useAuth();
  const { conversationData } = useConversation();
  const { chatId, participants } = conversationData;
  const { chatData } = useChat();
  const myChat = chatData.chats.find((chat) => chat._id === chatId);
  const myParticipant =
    participants &&
    participants.find((participant) => participant.userId._id === user._id);

  return (
    <div
    className={`${styles.ShowModalInfoContact}`}
  >
    <ul className={styles.FilesModal}>
      {myChat?.type === 'Chat' ? (
        <button
          onClick={() => {
            setShowInfoContact(true);
            closeModal();
          }}
        >
          Info. del contacto
        </button>
      ) : (
        <>
          <button
            onClick={() => {
              setShowInfoGroup(true);
              closeModal(); 
            }}
          >
            Info. del grupo
          </button>
          {myParticipant?.role === 'Admin' && (
            <>
              <button
                onClick={() => {
                  setEditGroupPage({
                    show: true,
                    participants: [],
                    type: 'add',
                  }); closeModal();}
                }
              >
                Agregar participantes
              </button>
              <button
                onClick={() => {
                  setEditGroupPage({
                    show: true,
                    participants: [],
                    type: 'delete',
                  }); closeModal();}
                }
              >
                Eliminar participantes
              </button>
            </>
          )}
        </>
      )}
    </ul>
  </div>
  );
    
}
