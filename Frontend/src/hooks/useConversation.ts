'use client';
import { useContext } from 'react';
import { ConversationContext } from '../context/conversation';

export const useConversation = () => {
  const context = useContext(ConversationContext);

  if (context === undefined) {
    throw new Error('useConversation must be used within a ChatProvider');
  }

  return context;
};
