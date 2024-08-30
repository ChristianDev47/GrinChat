import { useEffect, useState } from 'react';
import { socket } from '@/src/config/socket';
import { useConversation } from '@/src/hooks/useConversation';
import { useAuth } from '@/src/hooks/useAuth';
import { useChat } from '@/src/hooks/useChat';
import { Message } from '@/src/types/chat';
import { DeleteMessageType } from '@/src/types/message';

export const useMessages = () => {
  const { conversationData } = useConversation();
  const { chatData, addMessage, deleteMessage, updateStatusMessage } =
    useChat();
  const { user } = useAuth();
  const [myMessage, setMyMessage] = useState<string>('');
  const [deleteModal, setDeleteModal] = useState<DeleteMessageType>({
    show: false,
    message: null,
  });
  const { chatId, participants } = conversationData;
  const chat = chatData.chats.find((chat) => chat._id === chatId);

  useEffect(() => {
    if (chatId !== null && chat) {
      if (
        chat.messages.length > 0 &&
        user._id !== chat.messages[chat.messages.length - 1].senderId
      ) {
        chat.messages.forEach((message: Message) => {
          if (message.status === 'Delivered') {
            socket.emit('message_update_status', {
              messageId: message._id,
              origin: user._id,
              destination: participants,
            });
            message.status = 'Read';
            updateStatusMessage({
              ...message,
              status: 'Read',
            });
          }
        });
      }
    }

    const handleChatMessage = (data: Message) => {
      addMessage(data);
    };
    const handleMessageStatus = (data: Message) => updateStatusMessage(data);
    const handleDeleteMessage = (data: Message) => deleteMessage(data);

    socket.on('chat_message', handleChatMessage);
    socket.on('message_status', handleMessageStatus);
    socket.on('message_status_read', handleMessageStatus);
    socket.on('message_deleted', handleDeleteMessage);

    return () => {
      socket.off('chat_message', handleChatMessage);
      socket.off('message_status', handleMessageStatus);
      socket.off('message_status_read', handleMessageStatus);
      socket.off('message_deleted', handleDeleteMessage);
    };
  }, [
    user,
    chatId,
    chat,
    conversationData,
    addMessage,
    updateStatusMessage,
    deleteMessage,
  ]);

  const handleDeleteMessage = () => {
    if (deleteModal.message !== null) {
      socket.emit('delete_message', {
        message: deleteModal.message,
        origin: deleteModal.message.senderId,
        destination: participants,
      });
      setDeleteModal({ show: false, message: null });
    }
  };

  return {
    chat,
    user,
    participants,
    myMessage,
    setMyMessage,
    deleteModal,
    setDeleteModal,
    handleDeleteMessage,
  };
};
