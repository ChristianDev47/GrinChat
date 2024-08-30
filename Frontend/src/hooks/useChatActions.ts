import { useChat } from '@/src/hooks/useChat';
import { useConversation } from './useConversation';

export const useChatActions = () => {
  const { chatData, addMessage, updateStatusMessage, getChatsByUser } =
    useChat();
  const { addConversationData } = useConversation();

  return {
    chatData,
    addMessage,
    updateStatusMessage,
    getChatsByUser,
    addConversationData,
  };
};
