'use client';
import Image from 'next/image';
import styles from '../../../../styles/Chat.module.css';
import {
  useCallStateHooks,
  Call,
  useCall,
  ParticipantView,
  StreamTheme,
  Avatar,
} from '@stream-io/video-react-sdk';
import { useEffect, useRef } from 'react';
import { socket } from '@/src/config/socket';
import { useConversation } from '@/src/hooks/useConversation';
import { formatTimeDifference } from '@/src/utilities/dateFormat';
import closeIcon from '../../../assets/close.svg';
import userIcon from '../../../assets/user.svg';
import muteIcon from '../../../assets/mute.svg';
import unmuteIcon from '../../../assets/unmute.svg';
import withoutVideoIcon from '../../../assets/withoutVideo.svg';
import videoIcon from '../../../assets/video.svg';
import { useAuth } from '@/src/hooks/useAuth';

interface VoiceCallComponentProps {
  roomCall: Call;
  mute: boolean;
  onCamera: boolean;
  setVideoCallPage: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function VideoCallComponentView({
  roomCall,
  setVideoCallPage,
  mute,
  onCamera,
}: VoiceCallComponentProps) {
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const { useLocalParticipant, useRemoteParticipants } = useCallStateHooks();
  const participant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const { microphone, isMute } = useMicrophoneState();
  const { call } = useConversation();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const myCall = useCall();
  const { camera, isMute: isCamera } = useCameraState();
  const { user } = useAuth();

  useEffect(() => {
    if (myCall) {
      const camData = async () => {
        myCall.microphone.enable();
        myCall.camera.enable();
        if (mute) {
          await microphone?.disable();
        }
        if (onCamera) {
          await camera.disable();
        }
      };
      camData();
    }

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    };
  }, [setVideoCallPage]);

  const handleMuteButton = async () => {
    if (isMute) {
      await microphone?.enable();
    } else {
      await microphone?.disable();
    }
  };

  const handleCameraButton = async () => {
    if (isCamera) {
      await camera.enable();
    } else {
      await camera.disable();
    }
  };

  const handleEndCall = async () => {
    if (call) {
      const myData = {
        callStarted: user._id,
        chatId: call?.call.chatId,
        callId: call?.call._id,
        participants: call?.call.participants,
        content: formatTimeDifference(
          call.call.startTime,
          new Date().toISOString()
        ),
        endTime: new Date().toISOString(),
        type: 'Video',
      };
      await camera.disable();
      await microphone.disable();
      setVideoCallPage(false);

      socket.emit('call_request_end', myData);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  return (
    <>
      {roomCall && (
        <div className={styles.CallVideoPage}>
          <>
            <StreamTheme>
              {remoteParticipants.map((myParticipant) => {
                const myPartic = user.contacts?.find(
                  (ptn) => ptn.contactId._id === myParticipant.userId
                );

                return (
                  <div
                    key={myPartic?.contactId._id}
                    className={styles.VideoCallPage}
                  >
                    <p className={styles.NameParticipant}>
                      {myPartic?.contactId.name} {myPartic?.contactId.surname}
                    </p>
                    <div className={styles.VideoParticipant}>
                      <ParticipantView
                        participant={myParticipant}
                        className={styles.Video}
                      />
                      <div>
                        <Avatar
                          className={styles.ImageVideoCallPage}
                          imageSrc={
                            myPartic?.contactId.profilePicture ?? userIcon
                          }
                          style={{
                            width: '250px',
                            height: '250px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className={styles.ButtonsVideoCall}>
                <button
                  className={styles.EndCall}
                  onClick={handleEndCall}
                  title="Finalizar llamada"
                >
                  <Image src={closeIcon} alt="search" width={30} height={30} />
                </button>
                <button
                  className={styles.ButtonCall}
                  onClick={handleMuteButton}
                  title={`${isMute ? 'Desmutear' : 'Mutear'}`}
                >
                  <Image
                    src={isMute ? muteIcon : unmuteIcon}
                    alt="search"
                    width={30}
                    height={30}
                  />
                </button>
                <button
                  className={styles.ButtonCall}
                  onClick={handleCameraButton}
                  title={`${isCamera ? 'Encender Camara' : 'Apagar Camara'}`}
                >
                  <Image
                    src={isCamera ? withoutVideoIcon : videoIcon}
                    alt="search"
                    width={30}
                    height={30}
                  />
                </button>
              </div>
              {participant && (
                <div className={styles.LocalVideoCall}>
                  <p className={styles.NameLocalCallRemote}>
                    {user.name} {user.surname}
                  </p>
                  <div className={styles.VideoParticipant}>
                    {!isCamera ? (
                      <ParticipantView
                        participant={participant}
                        className={styles.LocalVideoCallVideo}
                      />
                    ) : (
                      <div className={styles.LocalVideoCallVideo}>
                        <Avatar
                          className={styles.ImageVideoCallPage}
                          imageSrc={user.profilePicture ?? userIcon}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </StreamTheme>
          </>
        </div>
      )}
    </>
  );
}
