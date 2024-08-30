import { useEffect } from 'react';
import { socket } from '@/src/config/socket';
import { Message, PropConversation, CallType, User } from '@/src/types/chat';
import { useChatActions } from './useChatActions';
import { useCallManagement } from './useCallManagement';
import { useAuth } from '@/src/hooks/useAuth';
import { useConversation } from './useConversation';
import useSound from 'use-sound';
import { usePathname } from 'next/navigation';
import { stopUsingMediaDevices } from '../utilities/checkPermitions';

export const useSocketListeners = () => {
  const { user, addUser, updateUsers } = useAuth();
  const {
    addMessage,
    updateStatusMessage,
    getChatsByUser,
    addConversationData,
  } = useChatActions();
  const { startCall } = useCallManagement();
  const {
    setClient,
    client,
    setCall,
    call,
    roomCall,
    setRoomCall,
    setCallPage,
    setVideoCallPage,
    stopWaitSound,
    stopCallSound,
    conversationData,
  } = useConversation();
  const [play] = useSound('/audio/notification.mp3', { volume: 0.25 });
  const pathname = usePathname();


  useEffect(() => {
    if (user.email !== '') {
      socket.emit('connected', { origin: user._id });
    }

    socket.on('message_sent', (data: Message) => {
      addMessage(data);
      if (data.senderId !== user._id && pathname === '/chat') {
        play();
      }
    });

    socket.on('message_status', (data: Message) => {
      updateStatusMessage(data);
    });

    socket.on('update_users_existen', (data: User) => {
      addUser(data);
      updateUsers();
    });

    socket.on('update_chat', async (data: PropConversation) => {
      getChatsByUser();
      if (data.chatId) {
        addConversationData({
          chatId: data.chatId,
          participants: data.participants,
        });
      }
    });

    socket.on('update_participants', (data: PropConversation) => {
      getChatsByUser();
      if (data.chatId === conversationData.chatId) {
        addConversationData({
          chatId: data.chatId,
          participants: data.participants,
        });
      }
    });

    socket.on('calling_has_started', async (data: CallType) => {
      setCall(data);
      startCall(data);
  });

    socket.on('call_request_accepted_by_user', async (data: {call: string, startedCall: string}) => {
      if (client && data.startedCall !== user._id) {
        const call = client?.call('audio_room', data.call);
        await call?.join();
        setRoomCall(call);
        stopWaitSound();
      }
    });

    socket.on('videocall_request_accepted_by_user', async (data: {call: string, startedCall: string})  => {
      if (client && data.startedCall !== user._id) {
        const call = client?.call('default', data.call);
        await call?.join();
        setRoomCall(call);
        stopWaitSound();
      }
    });

    socket.on('call_request_ended_by_user', async () => {
      await roomCall?.endCall();
      setCallPage(false);
      setVideoCallPage(false);
      setClient(undefined);
      setCall(undefined);
      setRoomCall(undefined);
      stopWaitSound();
      stopCallSound();
      stopUsingMediaDevices();
    });

    return () => {
      socket.off('message_sent');
      socket.off('message_status');
      socket.off('update_users_existen');
      socket.off('update_chat');
      socket.off('update_participants');
      socket.off('calling_has_started');
      socket.off('call_request_accepted_by_user');
      socket.off('videocall_request_accepted_by_user');
      socket.off('call_request_ended_by_user');
    };
  }, [
    user,
    addUser,
    addMessage,
    getChatsByUser,
    addConversationData,
    setClient,
    client,
    call,
    setCall,
    roomCall,
    setRoomCall,
    conversationData,
  ]);
};
