import { useContext } from 'react';
import { filterInitialState, FiltersContext } from '../context/chatFilters';
import { ChatType } from '../types/chat';
import { useAuth } from './useAuth';

export function useFilters() {
  const context = useContext(FiltersContext);

  if (!context) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  const { filters, setFilters } = context;
  const { user } = useAuth();

  const filterChat = (chats: ChatType[]) => {
    let filteredChats = chats;
    if (filters.type === 'Group') {
      filteredChats = filteredChats.filter(
        (chat) => chat.type === filters.type
      );
    }
    if (filters.not_read) {
      filteredChats = filteredChats.filter((chat: ChatType) => {
        const messagesDontReaded = chat.messages.filter(
          (message) =>
            message.status === 'Delivered' && message.senderId !== user._id
        );
        return messagesDontReaded.length > 0;
      });
    }

    return filteredChats;
  };
  return { filters, filterChat, setFilters, filterInitialState };
}
