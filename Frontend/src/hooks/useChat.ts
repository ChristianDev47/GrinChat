import { useContext } from 'react';
import { ChatsContext } from '../context/chats';

export const useChat = () => {
  const context = useContext(ChatsContext);

  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  return context;
};
