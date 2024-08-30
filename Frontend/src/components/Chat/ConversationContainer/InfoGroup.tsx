'use client';
import { Dispatch, SetStateAction } from 'react';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import { useConversation } from '@/src/hooks/useConversation';
import { useChat } from '@/src/hooks/useChat';
import { useAuth } from '@/src/hooks/useAuth';
import { socket } from '@/src/config/socket';
import closeIcon from '../../../assets/close.svg';

interface Props {
  setShowInfoGroup: Dispatch<SetStateAction<boolean>>;
}

export default function InfoGroup({ setShowInfoGroup }: Props) {
  const { user } = useAuth();
  const { conversationData } = useConversation();
  const { chatId, participants } = conversationData;
  const { chatData } = useChat();
  const myChat = chatData.chats.find((chat) => chat._id === chatId);
  const admin =
    myChat?.type === 'Group' &&
    participants?.find((participant) => participant.role === 'Admin');
  const myParticipant =
    myChat?.type === 'Group' &&
    participants?.find((participant) => participant.userId._id === user._id);

  const handleOutGroup = () => {
    const newParticipants = participants?.map((participant) => {
      if (participant.userId._id === user._id) {
        return {
          ...participant,
          status: 'Eliminated',
        };
      }
      return participant;
    });
    socket.emit('out_participant', {
      chatId,
      newParticipants,
      outUser: user._id,
    });
  };

  const handleDeleteChatGroup = () => {
    const newParticipants = participants?.map((participant) => {
      if (participant.userId._id === user._id) {
        return {
          ...participant,
          status: 'Out',
        };
      }
      return participant;
    });
    socket.emit('delete_chat', {
      chatId,
      newParticipants,
      outUser: user._id,
    });
  };

  const sortedParticipants =
    participants &&
    participants
      .filter((participant) => participant.status !== 'Eliminated')
      .sort((a, b) => a.userId.name.localeCompare(b.userId.name));

  return (
    <div className={styles.ShowInfoPageContact}>
      <div className={styles.ContactListNav}>
        <button onClick={() => setShowInfoGroup(false)}>
          <Image src={closeIcon} alt="search" width={22} height={22} />
        </button>
        <p>Información del grupo</p>
      </div>
      {myChat && (
        <div className={styles.ContactListContent}>
          {myChat.image && (
            <div className={styles.ContactListImage}>
              <Image
                src={myChat.image}
                alt="search"
                width={302}
                height={302}
                style={{
                  width: '230px',
                  height: '230px',
                  objectFit: 'cover',
                  borderRadius: '10rem',
                }}
              />
              <p>{myChat.name}</p>
            </div>
          )}
          <div className={styles.ContactState}>
            <h3 className={styles.ContactTitle}>Participantes</h3>
            <p>
              <span>Tu {', '}</span>
              {sortedParticipants
                ?.filter((participant) => participant.userId._id !== user._id)
                .map((participant, index, array) => (
                  <span key={participant._id}>
                    {`${participant.userId.name} ${participant.userId.surname}`}
                    {index < array.length - 1 && ', '}
                  </span>
                ))}
            </p>
          </div>
          <div className={styles.ContactOptions}>
            {admin && admin.userId._id !== user._id && (
              <>
                <h3 className={styles.ContactTitle}>Opciones</h3>
                <div>
                  {myParticipant && myParticipant.status === 'Eliminated' ? (
                    <button
                      onClick={() => handleDeleteChatGroup()}
                      className={styles.ContactButton}
                    >
                      <Image
                        src={closeIcon}
                        alt="search"
                        width={15}
                        height={15}
                      />
                      <p>Eliminar grupo</p>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOutGroup()}
                      className={styles.ContactButton}
                    >
                      <Image
                        src={closeIcon}
                        alt="search"
                        width={15}
                        height={15}
                      />
                      <p>Salir del grupo</p>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
