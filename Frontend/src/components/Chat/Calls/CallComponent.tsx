'use client';
import Image from 'next/image';
import styles from '../../../../styles/Chat.module.css';
import { useAuth } from '@/src/hooks/useAuth';
import { useConversation } from '@/src/hooks/useConversation';
import { useEffect, useState } from 'react';
import { StreamVideo, StreamCall } from '@stream-io/video-react-sdk';
import { socket } from '@/src/config/socket';
import VoiceCallComponent from './VoiceCall';
import userIcon from '../../../assets/user.svg';
import callIcon from '../../../assets/call.svg';
import muteIcon from '../../../assets/mute.svg';
import unmuteIcon from '../../../assets/unmute.svg';
import closeIcon from '../../../assets/close.svg';
import { checkAudioPermission } from '@/src/utilities/checkPermitions';
import toast from 'react-hot-toast';

export default function CallComponent() {
  const { user } = useAuth();
  const {
    client,
    call,
    roomCall,
    setRoomCall,
    setCall,
    setCallPage,
    setClient,
    stopCallSound,
    stopWaitSound,
  } = useConversation();
  const [mute, setMute] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<boolean>(false);
  const participant = call?.call.participants?.find(
    (participant) => participant.userId._id !== user._id
  );

  useEffect(() => {
    socket.on('call_request_canceled_by_user', () => {
      setCallStatus(true);
      setTimeout(() => {
        setCallPage(false);
        setCallStatus(false);
        stopWaitSound();
        stopCallSound();
        setCall(undefined);
      }, 1000);
    });
    socket.on('call_has_been_missed', () => {
      setCall(undefined);
      setCallPage(false);
      setRoomCall(undefined);
      setClient(undefined);
      stopCallSound();
      stopWaitSound();
    });
    return () => {
      socket.off('call_request_canceled_by_user');
      socket.off('call_has_been_missed');
    };
  }, []);

  const createCall = async () => {
    if (client) {
      try {
        const mycall = client.call('audio_room', user._id);
        const callData = {
          create: true,
          data: {
            members: [{ user_id: user._id }],
            custom: {
              title: 'Llamada',
              description: 'User audio call',
            },
          },
        };
        await mycall.join(callData);
        return mycall;
      } catch (error) {
        console.error('Error creating or joining call:', error);
      }
    } else {
      console.error('Client not initialized');
    }
  };

  const handlerequestCall = async () => {
    const hasAudioPermission = await checkAudioPermission();
    if (hasAudioPermission) {
      const myCall = await createCall();
      if (myCall) {
        try {
          await myCall.goLive();
          await myCall.microphone.enable();
          const callData = myCall.id;
          const myData = {
            callId: call?.call,
            call: callData,
            startedCall: user._id,
          };

          socket.emit('call_request_accepted', myData);
          setRoomCall(myCall);
          setCallStatus(false);
          stopCallSound();
          stopWaitSound();
        } catch (error) {
          console.error('Error during call setup:', error);
        }
      }
    } else {
      toast.error(
        'El microfono no están disponibles. Asegúrate de haber otorgado permisos.',
        {
          duration: 4000,
        }
      );
    }
  };

  const handleCancelCall = async () => {
    const myData = {
      callStarted: call?.call.participants.find(
        (part) => part.userId._id === user._id
      ),
      chatId: call?.call.chatId,
      callId: call?.call._id,
      participantsForNotify: call?.call.participants,
      participants: call?.call.participants.filter(
        (participant) => participant.userId._id !== user._id
      ),
      type: 'Audio',
    };
    socket.emit('call_request_canceled', myData);
    setCallPage(false);
    stopCallSound();
    stopWaitSound();
    setClient(undefined);
    setCall(undefined);
  };
  return (
    <>
      {client && (
        <StreamVideo client={client}>
          {roomCall ? (
            <StreamCall call={roomCall}>
              <VoiceCallComponent
                roomCall={roomCall}
                setCallPage={setCallPage}
                mute={mute}
              />
            </StreamCall>
          ) : call?.userStartCalling?._id === user._id && !roomCall ? (
            <div className={styles.CallPage}>
              <p>
                {participant?.userId.name} {participant?.userId.surname}
              </p>
              <div className={styles.Image}>
                {participant?.userId && participant?.userId.profilePicture ? (
                  <Image
                    className={styles.ImagePosition}
                    src={participant?.userId.profilePicture}
                    alt="user"
                    width={230}
                    height={230}
                    priority
                  />
                ) : (
                  <Image
                    src={userIcon}
                    alt="user"
                    width={150}
                    height={150}
                    priority
                  />
                )}
              </div>
              <div className={styles.ButtonsCall}>
                <button
                  className={styles.EndCall}
                  onClick={handleCancelCall}
                  title="Cancelar llamada"
                >
                  <Image
                    src={callIcon}
                    alt="search"
                    width={25}
                    height={25}
                    priority
                  />
                </button>
                <button
                  className={styles.ButtonCall}
                  onClick={() => {
                    setMute(!mute);
                  }}
                  title={`${mute === false ? 'mutear' : 'desmutear'}`}
                >
                  <Image
                    src={mute === false ? unmuteIcon : muteIcon}
                    alt="search"
                    width={25}
                    height={25}
                  />
                </button>
              </div>
              <p>{!callStatus ? 'Llamando..' : 'Llamada rechazada'}</p>
            </div>
          ) : (
            <div className={styles.CallPage}>
              <p>
                {call?.userStartCalling?.name} {call?.userStartCalling?.surname}
              </p>
              <div className={styles.Image}>
                {call?.userStartCalling &&
                call?.userStartCalling?.profilePicture ? (
                  <Image
                    className={styles.ImagePosition}
                    src={call?.userStartCalling?.profilePicture}
                    alt="user"
                    width={230}
                    height={230}
                    priority
                  />
                ) : (
                  <Image
                    src={userIcon}
                    alt="user"
                    width={150}
                    height={150}
                    priority
                  />
                )}
              </div>
              <div className={styles.ButtonsCall}>
                <button
                  className={styles.StartCall}
                  onClick={handlerequestCall}
                  title="Contestar llamada"
                >
                  <Image src={callIcon} alt="search" width={25} height={25} />
                </button>
                <button
                  className={styles.EndCall}
                  onClick={handleCancelCall}
                  title="Cancelar llamada"
                >
                  <Image src={closeIcon} alt="search" width={25} height={25} />
                </button>
                <button
                  className={styles.ButtonCall}
                  onClick={() => {
                    setMute(!mute);
                  }}
                  title={`${mute === false ? 'mutear' : 'desmutear'}`}
                >
                  <Image
                    src={mute === false ? unmuteIcon : muteIcon}
                    alt="search"
                    width={25}
                    height={25}
                  />
                </button>
              </div>
            </div>
          )}
        </StreamVideo>
      )}
    </>
  );
}
