'use client';
import Image from 'next/image';
import styles from '../../../../styles/Chat.module.css';
import {
  ParticipantsAudio,
  useCallStateHooks,
  Call,
  useCall,
} from '@stream-io/video-react-sdk';
import { useAuth } from '@/src/hooks/useAuth';
import { useEffect, useRef, useState } from 'react';
import { socket } from '@/src/config/socket';
import { useConversation } from '@/src/hooks/useConversation';
import closeIcon from '../../../assets/close.svg';
import userIcon from '../../../assets/user.svg';
import muteIcon from '../../../assets/mute.svg';
import unmuteIcon from '../../../assets/unmute.svg';
import { callDuraction } from '@/src/utilities/dateFormat';
import { stopUsingMediaDevices } from '@/src/utilities/checkPermitions';

interface VoiceCallComponentProps {
  roomCall: Call;
  mute: boolean;
  setCallPage: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function VoiceCallComponent({
  roomCall,
  setCallPage,
  mute,
}: VoiceCallComponentProps) {
  const { useParticipants, useMicrophoneState } = useCallStateHooks();
  const participants = useParticipants();
  const { microphone, isMute } = useMicrophoneState();
  const { call } = useConversation();
  const { user } = useAuth();
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const myCall = useCall();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);
    if (myCall) {
      if (mute) {
        myCall.microphone.disable();
      }else{
        myCall.microphone.enable();
      }
    }

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    };
  }, [setCallPage]);

  const handleMuteButton = async () => {
    if (isMute) {
      await microphone?.enable();
    } else {
      await microphone?.disable();
    }
  };

  const handleEndCall = async () => {
    const endTime = new Date().toISOString();
    if (call) {
      const myData = {
        callStarted: user._id,
        chatId: call?.call.chatId,
        callId: call?.call._id,
        participants: call?.call.participants,
        content: callDuraction(recordingTime),
        endTime,
        type: 'Audio',
      };
      setCallPage(false);
      stopUsingMediaDevices();

      socket.emit('call_request_end', myData);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const myParticipant = participants.find((part) => part.userId !== user._id);
  const myPartic = user.contacts?.find(
    (ptn) => ptn.contactId._id === myParticipant?.userId
  );
  return (
    <>
      {roomCall && (
        <div className={styles.CallPage}>
          <>
            <ParticipantsAudio participants={participants} />
            <div key={myPartic?.contactId._id} className={styles.ImageCallPage}>
              <div>
                <span>
                  {myPartic?.contactId.name} {myPartic?.contactId.surname}
                </span>
              </div>
              <div className={styles.Image}>
                {myPartic?.contactId.profilePicture ? (
                  <Image
                    className={styles.ImagePosition}
                    src={myPartic?.contactId.profilePicture}
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
            </div>
            <div className={styles.ButtonsCall}>
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
            </div>
            <p>En llamada</p>
            <p>{formatTime(recordingTime)}</p>
          </>
        </div>
      )}
    </>
  );
}
