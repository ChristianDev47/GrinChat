'use client';
import { Dispatch, SetStateAction } from 'react';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import { useConversation } from '@/src/hooks/useConversation';
import { useAuth } from '@/src/hooks/useAuth';
import { socket } from '@/src/config/socket';
import closeIcon from '../../../assets/close.svg';
import userIcon from '../../../assets/user.svg';

interface Props {
  setShowInfoContact: Dispatch<SetStateAction<boolean>>;
}

export default function InfoContact({ setShowInfoContact }: Props) {
  const { user } = useAuth();
  const { conversationData } = useConversation();
  const { participants, chatId } = conversationData;
  const participant =
    participants &&
    participants.find((participant) => participant.userId._id !== user._id);
  const myParticipant =
    participants &&
    participants.find((participant) => participant.userId._id === user._id);

  const handleBloqUser = () => {
    const newParticipants = participants?.map((participant) => {
      if (participant.userId._id !== user._id) {
        return {
          ...participant,
          status: 'Bloqued',
        };
      }
      return participant;
    });
    socket.emit('update_user_chat', {
      user,
      chatId,
      newParticipants,
      status: 'Bloqued',
    });
  };

  const handleDeleteChat = () => {
    const newParticipants = participants?.map((participant) => {
      if (participant.userId._id === user._id) {
        return {
          ...participant,
          status: myParticipant?.status === 'Bloqued' ? 'Out' : 'Delete',
        };
      }
      return participant;
    });
    socket.emit('update_user_chat', {
      user,
      chatId,
      newParticipants,
      status: myParticipant?.status === 'Bloqued' ? 'Out' : 'Delete',
    });
    setShowInfoContact(false);
  };

  const handleUnBloquedUser = () => {
    const newParticipants = participants?.map((participant) => {
      if (participant.userId._id !== user._id) {
        return {
          ...participant,
          status: 'Active',
        };
      }
      return participant;
    });
    socket.emit('update_user_chat', {
      user,
      chatId,
      newParticipants,
      status: 'Active',
    });
  };
  const handleActiveUser = () => {
    const newParticipants = participants?.map((participant) => {
      if (participant.userId._id === user._id) {
        return {
          ...participant,
          status: 'Active',
        };
      }
      return participant;
    });
    socket.emit('update_user_chat', {
      user,
      chatId,
      newParticipants,
      status: 'Active',
    });
  };

  const renderButton = () => {
    if (participant && myParticipant) {
      const buttons = [];

      const IsActive = myParticipant.status === 'Active';
      const IsDeleted = myParticipant.status === 'Delete';
      const IsBloqued = myParticipant.status === 'Bloqued';
      const IsOut = myParticipant.status === 'Out';

      if (
        (IsActive || IsDeleted) &&
        (participant.status === 'Active' || participant.status === 'Delete')
      ) {
        buttons.push(
          <button
            onClick={handleBloqUser}
            className={styles.ContactButton}
            key="bloquear"
          >
            <Image src={closeIcon} alt="bloquear" width={15} height={15} />
            <p>Bloquear</p>
          </button>
        );
      }

      if (
        (IsActive || IsDeleted) &&
        (participant.status === 'Bloqued' || participant.status === 'Out')
      ) {
        buttons.push(
          <button
            onClick={handleUnBloquedUser}
            className={styles.ContactButton}
            key="desbloquear"
          >
            <Image src={closeIcon} alt="desbloquear" width={15} height={15} />
            <p>Desbloquear</p>
          </button>
        );
      }

      if (IsBloqued || IsOut || IsActive) {
        buttons.push(
          <button
            onClick={handleDeleteChat}
            className={styles.ContactButton}
            key="eliminar"
          >
            <Image src={closeIcon} alt="eliminar" width={15} height={15} />
            <p>Eliminar Chat</p>
          </button>
        );
      }

      if (IsDeleted || IsOut) {
        buttons.push(
          <button
            onClick={handleActiveUser}
            className={styles.ContactButton}
            key="mostrar"
          >
            <Image src={closeIcon} alt="mostrar" width={15} height={15} />
            <p>Mostrar Chat</p>
          </button>
        );
      }

      return buttons;
    }

    return null;
  };

  return (
    <div className={styles.ShowInfoPageContact}>
      <div className={styles.ContactListNav}>
        <button onClick={() => setShowInfoContact(false)}>
          <Image src={closeIcon} alt="search" width={22} height={22} />
        </button>
        <p>Información de contacto</p>
      </div>
      {participant && (
        <div className={styles.ContactListContent}>
          <div className={styles.ContactListImage}>
            <div className={styles.Image}>
              {participant.userId.profilePicture ? (
                <Image
                  className={styles.ImagePosition}
                  src={participant.userId.profilePicture}
                  alt="search"
                  width={302}
                  height={302}
                  priority
                />
              ) : (
                <Image src={userIcon} alt="user" width={150} height={150} priority />
              )}
            </div>
            <p>
              {participant.userId.name} {participant.userId.surname}
            </p>
          </div>
          <div className={styles.ContactState}>
            <h3 className={styles.ContactTitle}>Estado</h3>
            <p>{participant.userId.status}</p>
          </div>
          <div className={styles.ContactOptions}>
            <h3 className={styles.ContactTitle}>Opciones</h3>
            <div>{renderButton()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
