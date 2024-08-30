'use client';
import {
  ReactNode,
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { CallType, PropConversation } from '../types/chat';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import { Call, StreamVideoClient } from '@stream-io/video-react-sdk';
import useSound from 'use-sound';

// Define the context type
interface ConversationContextType {
  conversationData: PropConversation;
  addConversationData: (data: Partial<PropConversation>) => void;
  client: StreamVideoClient | undefined;
  setClient: (client: StreamVideoClient | undefined) => void;
  call: CallType | undefined;
  setCall: (call: CallType | undefined) => void;
  roomCall: Call | undefined;
  setRoomCall: (call: Call | undefined) => void;
  callPage: boolean;
  setCallPage: React.Dispatch<React.SetStateAction<boolean>>;
  videoCallPage: boolean;
  setVideoCallPage: React.Dispatch<React.SetStateAction<boolean>>;
  playWaitSound: () => void;
  stopWaitSound: () => void;
  playCallSound: () => void;
  stopCallSound: () => void;
}

// Context
export const ConversationContext = createContext<ConversationContextType>({
  conversationData: {
    participants: null,
    chatId: null,
  },
  addConversationData: () => {},
  client: undefined,
  setClient: () => {},
  call: undefined,
  setCall: () => {},
  roomCall: undefined,
  setRoomCall: () => {},
  videoCallPage: false,
  setVideoCallPage: () => {},
  callPage: false,
  setCallPage: () => {},
  playWaitSound: () => {},
  stopWaitSound: () => {},
  playCallSound: () => {},
  stopCallSound: () => {},
});

// Provider
export function ConversationProvider({ children }: { children: ReactNode }) {
  const { chatData } = useChat();
  const { user } = useAuth();
  const [client, setClient] = useState<StreamVideoClient | undefined>();
  const [call, setCall] = useState<CallType | undefined>();
  const [roomCall, setRoomCall] = useState<Call | undefined>();
  const [callPage, setCallPage] = useState<boolean>(false);
  const [videoCallPage, setVideoCallPage] = useState<boolean>(false);
  const [playWaitSound, { stop: stopWaitSound }] = useSound(
    '/audio/wait_sound.mp3',
    { volume: 0.25 }
  );
  const [playCallSound, { stop: stopCallSound }] = useSound(
    '/audio/call_sound.mp3',
    { volume: 0.5 }
  );
  const [conversationData, setConversationData] = useState<PropConversation>({
    participants: null,
    chatId: null,
  });

  const addConversationData = useCallback(
    (data: Partial<PropConversation>) => {
      if (data.participants && data.participants?.length < 2) {
        const participant = data.participants?.find(
          (participant) => participant.userId._id !== user._id
        );
        if (participant) {
          const dataChat = chatData.chats.find(
            (chat) =>
              chat.type === 'Chat' &&
              chat.participants.some(
                (myparticipant) =>
                  myparticipant.userId._id === participant.userId._id
              )
          );
          if (dataChat) {
            data = {
              participants: dataChat.participants,
              chatId: dataChat._id,
            };
          }
        }
      }

      setConversationData({
        participants: data.participants,
        chatId: data.chatId ?? null,
      });
    },
    [chatData, user._id]
  );

  const value = useMemo(
    () => ({
      addConversationData,
      conversationData,
      client,
      setClient,
      call,
      setCall,
      roomCall,
      setRoomCall,
      callPage,
      setCallPage,
      videoCallPage,
      setVideoCallPage,
      playWaitSound,
      stopWaitSound,
      playCallSound,
      stopCallSound,
    }),
    [
      addConversationData,
      conversationData,
      client,
      call,
      roomCall,
      setCall,
      setClient,
      setRoomCall,
      callPage,
      setCallPage,
      videoCallPage,
      setVideoCallPage,
      stopCallSound,
      playCallSound,
      stopWaitSound,
      playWaitSound,
    ]
  );

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}
