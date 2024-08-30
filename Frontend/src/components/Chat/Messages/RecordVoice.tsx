'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import styles from '../../../../styles/Chat.module.css';
import microphoneIcon from '../../../assets/microphone.svg';
import recordingIcon from '../../../assets/sendRecording.svg';
import cancelRecordingIcon from '../../../assets/cancelRecording.svg';
import { socket } from '@/src/config/socket';
import { useAuth } from '@/src/hooks/useAuth';
import { useConversation } from '@/src/hooks/useConversation';

interface UploadResponse {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  error?: string;
}

export default function RecordVoice() {
  const { user } = useAuth();
  const { conversationData } = useConversation();
  const { participants, chatId } = conversationData;

  const [voiceModule, setVoiceModule] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setVoiceModule(true);

      intervalRef.current = setInterval(
        () => setRecordingTime((time) => time + 1),
        1000
      );
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setVoiceModule(false);
    }
  };

  const stopRecording = () => {
    return new Promise<void>((resolve) => {
      if (
        mediaRecorder.current &&
        mediaRecorder.current.state === 'recording'
      ) {
        mediaRecorder.current.onstop = () => {
          resolve();
        };
        mediaRecorder.current.stop();
      } else {
        resolve();
      }

      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => track.stop());
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setRecordingTime(0);
      setIsRecording(false);
    });
  };

  const cancelRecording = async () => {
    await stopRecording();
    chunks.current = [];
    setVoiceModule(false);
    setIsRecording(false);
  };

  const saveRecording = async () => {
    await stopRecording();

    if (chunks.current.length > 0) {
      const recordedBlob = new Blob(chunks.current, { type: 'audio/webm' });
      const file = new File([recordedBlob], 'voice_recording.webm', {
        type: 'audio/webm',
      });

      socket.emit(
        'file_upload',
        { fileData: file, fileName: file.name },
        (response: UploadResponse) => {
          if (response.success) {
            const messageType =
              file.type.split('/')[0].charAt(0).toUpperCase() +
              file.type.split('/')[0].slice(1);

            socket.emit('message_sent', {
              origin: user._id,
              message: null,
              destination: participants,
              fileUrl: response.fileUrl,
              fileName: response.fileName,
              messageType,
              chatId,
            });
          }
        }
      );
    }

    chunks.current = [];
    setVoiceModule(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className={styles.VoiceModule}>
      {voiceModule ? (
        <div className={styles.VoiceModuleRecording}>
          <button onClick={cancelRecording}>
            <Image
              src={cancelRecordingIcon}
              alt="Cancel recording"
              width={25}
              height={25}
              title="Cancelar"
            />
          </button>
          <div>
            <Image
              src="/images/recording.gif"
              alt="Recording..."
              width={15}
              height={15}
            />
            <p>{formatTime(recordingTime)}</p>
          </div>
          <button onClick={saveRecording}>
            <Image
              src={recordingIcon}
              alt="Send recording"
              width={25}
              height={25}
              title="Enviar"
            />
          </button>
        </div>
      ) : (
        <button onClick={startRecording} disabled={isRecording}>
          <Image
            src={microphoneIcon}
            alt="Start recording"
            width={25}
            height={25}
          />
        </button>
      )}
    </div>
  );
}
