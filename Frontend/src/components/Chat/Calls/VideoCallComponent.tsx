'use client';
import Image from 'next/image';
import styles from '../../../../styles/Chat.module.css';
import { useAuth } from '@/src/hooks/useAuth';
import { useConversation } from '@/src/hooks/useConversation';
import { useEffect, useState } from 'react';
import { StreamVideo, StreamCall } from '@stream-io/video-react-sdk';
import { socket } from '@/src/config/socket';
import VideoCallComponentView from './VideoCall';
import callIcon from '../../../assets/call.svg';
import userIcon from '../../../assets/user.svg';
import muteIcon from '../../../assets/mute.svg';
import unmuteIcon from '../../../assets/unmute.svg';
import closeIcon from '../../../assets/close.svg';
import withoutVideoIcon from '../../../assets/withoutVideo.svg';
import videoIcon from '../../../assets/video.svg';
import { checkVideoPermission } from '@/src/utilities/checkPermitions';
import toast from 'react-hot-toast';

export default function VideoCallComponent() {
  const { user } = useAuth();
  const {
    client,
    call,
    roomCall,
    setVideoCallPage,
    setRoomCall,
    setCall,
    setClient,
    stopCallSound,
    stopWaitSound,
  } = useConversation();
  const [mute, setMute] = useState<boolean>(false);
  const [onCamera, setOnCamera] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<boolean>(false);
  const participant = call?.call.participants?.find(
    (participant) => participant.userId._id !== user._id
  );

  useEffect(() => {
    socket.on('call_request_canceled_by_user', () => {
      setCallStatus(true);
      setTimeout(() => {
        setVideoCallPage(false);
        setCallStatus(false);
        stopWaitSound();
        stopCallSound();
        setCall(undefined);
      }, 1000);
    });
    socket.on('call_has_been_missed', () => {
      setCall(undefined);
      setVideoCallPage(false);
      setCall(undefined);
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

  const createVideoCall = async () => {
    if (client) {
      try {
        const mycall = client.call('default', user._id);
        const callData = {
          create: true,
          data: {
            members: [{ user_id: user._id }],
            custom: {
              title: 'Video Llamada',
              description: 'User video call',
            },
          },
        };

        await mycall.join(callData);
        return mycall;
      } catch (error) {
        console.error('Error creating call:', error);
      }
    } else {
      console.error('Client not initialized');
    }
  };

  const handleRequestVideoCall = async () => {
    const hasAudioAndVideoPermission = await checkVideoPermission();
    if (hasAudioAndVideoPermission) {
      const myCall = await createVideoCall();
      if (myCall) {
        try {
          const callData = myCall.id;
          await myCall.microphone.enable();
          await myCall.camera.disable();
          const myData = {
            callId: call?.call,
            call: callData,
            startedCall: user._id
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
      toast.error('La cámara o el micrófono no están disponibles. Asegúrate de haber otorgado permisos.', {
        duration: 4000,
      });
    }

  };

  const handleCancelVideoCall = async () => {
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
      type: 'Video',
    };
    socket.emit('call_request_canceled', myData);
    setVideoCallPage(false);
    setCallStatus(false);
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
              <VideoCallComponentView
                roomCall={roomCall}
                setVideoCallPage={setVideoCallPage}
                mute={mute}
                onCamera={onCamera}
              />
            </StreamCall>
          ) : call?.userStartCalling?._id === user._id && !roomCall ? (
            <div className={styles.CallPage}>
              <p>
                {participant?.userId.name} {participant?.userId.surname}
              </p>
              <div className={styles.Image}>
                {participant?.userId && participant?.userId?.profilePicture ? (
                  <Image
                    className={styles.ImagePosition}
                    src={participant?.userId?.profilePicture}
                    alt="user"
                    width={230}
                    height={230}
                    priority
                  />
                ) : (
                  <Image src={userIcon} alt="user" width={150} height={150} priority/>
                )}
              </div>
              <div className={styles.ButtonsCall}>
                <button
                  className={styles.EndCall}
                  onClick={handleCancelVideoCall}
                  title="Cancelar llamada"
                >
                  <Image src={callIcon} alt="search" width={30} height={30} />
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
                    width={30}
                    height={30}
                  />
                </button>
                <button
                  className={styles.ButtonCall}
                  onClick={() => {
                    setOnCamera(!onCamera);
                  }}
                  title={`${onCamera ? 'Encender Camara' : 'Apagar Camara'}`}
                >
                  <Image
                    src={onCamera ? withoutVideoIcon : videoIcon}
                    alt="search"
                    width={30}
                    height={30}
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
                  <Image src={userIcon} alt="user" width={150} height={150} priority/>
                )}
              </div>
              <div className={styles.ButtonsCall}>
                <button
                  className={styles.StartCall}
                  onClick={handleRequestVideoCall}
                  title="Contestar llamada"
                >
                  <Image src={callIcon} alt="search" width={30} height={30} />
                </button>
                <button
                  className={styles.EndCall}
                  onClick={handleCancelVideoCall}
                  title="Cancelar llamada"
                >
                  <Image src={closeIcon} alt="search" width={30} height={30} />
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
                    width={30}
                    height={30}
                  />
                </button>
                <button
                  className={styles.ButtonCall}
                  onClick={() => {
                    setOnCamera(!onCamera);
                  }}
                  title={`${onCamera ? 'Encender Camara' : 'Apagar Camara'}`}
                >
                  <Image
                    src={onCamera ? withoutVideoIcon : videoIcon}
                    alt="search"
                    width={30}
                    height={30}
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
