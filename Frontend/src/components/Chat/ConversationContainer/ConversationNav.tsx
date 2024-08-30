'use client';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import { useConversation } from '@/src/hooks/useConversation';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { socket } from '@/src/config/socket';
import { useChat } from '@/src/hooks/useChat';
import { AddParticipantType } from '@/src/types/chat';
import { useAuth } from '@/src/hooks/useAuth';
import callIcon from '../../../assets/call.svg';
import userIcon from '../../../assets/user.svg';
import videoCallIcon from '../../../assets/videoCall.svg';
import menuIcon from '../../../assets/menu.svg';
import ModalToggle from '@/src/utilities/ModalToggle';
import ConversationModal from './ConversationModal';
import toast from 'react-hot-toast';
import {
  checkAudioPermission,
  checkVideoPermission,
} from '@/src/utilities/checkPermitions';

interface UsersData {
  [key: string]: string;
}

interface Props {
  setShowInfoContact: Dispatch<SetStateAction<boolean>>;
  setShowInfoGroup: Dispatch<SetStateAction<boolean>>;
  setEditGroupPage: Dispatch<SetStateAction<AddParticipantType>>;
}

export default function ConversationNav({
  setShowInfoContact,
  setShowInfoGroup,
  setEditGroupPage,
}: Props) {
  const { user } = useAuth();
  const {
    conversationData,
    roomCall,
    call,
    playWaitSound,
    stopWaitSound,
    setCall,
    setClient,
  } = useConversation();
  const { participants, chatId } = conversationData;
  const { chatData } = useChat();

  const myChat = chatData.chats.find((chat) => chat._id === chatId);
  const participant =
    participants &&
    participants.find((participant) => participant.userId._id !== user._id);
  const myParticipant =
    participants &&
    participants.find((participant) => participant.userId._id === user._id);
  const [conected, setConected] = useState<boolean>(false);

  useEffect(() => {
    socket.emit('request-users');
    if (participant && participant.userId.email !== '') {
      const handleGetUsers = (data: UsersData) => {
        if (data[participant.userId._id]) {
          setConected(true);
        } else {
          setConected(false);
        }
      };

      socket.on('get-users', handleGetUsers);

      return () => {
        socket.off('get-users', handleGetUsers);
      };
    }
  }, [participants]);

  const sortedParticipants =
    participants &&
    participants
      .filter(
        (participant) =>
          participant.status !== 'Eliminated' && participant.status !== 'Out'
      )
      .sort((a, b) => a.userId.name.localeCompare(b.userId.name));

  const callRef = useRef(call);
  const roomRef = useRef(roomCall);

  useEffect(() => {
    callRef.current = call;
  }, [call]);

  useEffect(() => {
    roomRef.current = roomCall;
  }, [roomCall]);

  const handelStartCall = (type: string) => {
    if (myParticipant?.status === 'Active') {
      socket.emit('start_call', {
        chatId: myChat?._id,
        callType: type,
        participants,
        startCallingParticipant: user,
      });
      playWaitSound();

      setTimeout(() => {
        if (!roomRef.current && callRef.current?.call) {
          setCall(undefined);
          setClient(undefined);
          socket.emit('called_missed', {
            chatId: myChat?._id,
            callId: callRef.current?.call._id,
            callType: 'Missed',
            startCallingParticipant: user,
            type,
          });
          stopWaitSound();
        }
      }, 30000);
    }
  };

  return (
    <div className={styles.ConversationNav}>
      {myChat && (
        <>
          <div className={styles.ParticipantInfo}>
            <div className={styles.Image}>
              {myChat?.type === 'Group' ? (
                myChat && myChat.image ? (
                  <Image
                    className={styles.ImagePosition}
                    src={myChat.image}
                    alt="user"
                    width={100}
                    height={100}
                  />
                ) : (
                  <Image src={userIcon} alt="user" width={30} height={30} />
                )
              ) : participant && participant.userId.profilePicture ? (
                <Image
                  className={styles.ImagePosition}
                  src={participant.userId.profilePicture}
                  alt="user"
                  width={100}
                  height={100}
                />
              ) : (
                <Image src={userIcon} alt="user" width={30} height={30} />
              )}
            </div>
            <div>
              {myChat?.type === 'Group' ? (
                <>
                  <p>{myChat?.name}</p>
                  <div className={styles.GroupParticipants}>
                    <span>Tu{', '}</span>
                    {sortedParticipants
                      ?.filter(
                        (participant) => participant.userId._id !== user._id
                      ) // Filtramos al usuario actual
                      .map((participant, index, array) => {
                        const isLastParticipant = index === array.length - 1; // Se ajusta al array filtrado

                        return (
                          <span key={participant._id}>
                            {`${participant.userId.name} ${participant.userId.surname}`}
                            {!isLastParticipant && ', '}
                          </span>
                        );
                      })}
                  </div>
                </>
              ) : (
                participant && (
                  <>
                    <p>
                      {participant.userId.name} {participant.userId.surname}
                    </p>
                    <p className={styles.OnlineStatus}>
                      {conected === true && 'En linea'}
                    </p>
                  </>
                )
              )}
            </div>
          </div>
          <div className={styles.Options}>
            {myChat?.type === 'Chat' &&
              participant?.status !== 'Bloqued' &&
              myParticipant?.status !== 'Bloqued' && (
                <>
                  <button
                    onClick={async () => {
                      const hasAudioPermission = await checkAudioPermission();
                      if (hasAudioPermission) {
                        handelStartCall('Audio');
                      } else {
                        toast.error(
                          'El micrófono no está disponible. Asegúrate de haber otorgado permisos.',
                          {
                            duration: 4000,
                          }
                        );
                      }
                    }}
                  >
                    <Image
                      src={callIcon}
                      alt="user"
                      width={25}
                      height={25}
                      title="Iniciar llamada de voz"
                    />
                  </button>

                  <button
                    onClick={async () => {
                      const hasVideoPermission = await checkVideoPermission();
                      if (hasVideoPermission) {
                        handelStartCall('Video');
                      } else {
                        toast.error(
                          'La cámara o el micrófono no están disponibles. Asegúrate de haber otorgado permisos.',
                          {
                            duration: 4000,
                          }
                        );
                      }
                    }}
                  >
                    <Image
                      src={videoCallIcon}
                      alt="user"
                      width={25}
                      height={25}
                      title="Iniciar video llamada"
                    />
                  </button>
                </>
              )}
            <ModalToggle
              modalId="info-modal"
              toggleButtonId="info-toggle-btn"
              ModalComponent={ConversationModal}
              title={<Image src={menuIcon} alt="info" width={25} height={25} />}
              setShowInfoContact={setShowInfoContact}
              setShowInfoGroup={setShowInfoGroup}
              setEditGroupPage={setEditGroupPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
