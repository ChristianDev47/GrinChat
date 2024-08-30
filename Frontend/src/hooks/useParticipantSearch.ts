import { useState, useEffect } from 'react';
import { useChat } from '@/src/hooks/useChat';
import { ChatType } from '@/src/types/chat';
import { useFilters } from '@/src/hooks/useChatFilter';
import { User } from '@/src/types/user';
import { useAuth } from './useAuth';

export const useUserSearch = () => {
  const { user } = useAuth();
  const { chatData } = useChat();
  const { filterChat } = useFilters();
  const [findUsers, setFindUsers] = useState<ChatType[] | []>([]);

  useEffect(() => {
    setFindUsers(filterChat(chatData.chats));
  }, [chatData]);

  const handleSearch = (searchTerm: string) => {
    if (chatData.chats.length > 0) {
      const usersFind = chatData.chats.filter((chat) => {
        if (chat.type === 'Chat') {
          const myuser: User | undefined = chat.participants.find(
            (userP) => userP.userId._id !== user._id
          )?.userId;
          if (myuser) {
            const fullname = `${myuser.name} ${myuser.surname}`;
            return fullname.toLowerCase().startsWith(searchTerm.toLowerCase());
          }
        } else if (chat.type === 'Group' && chat.name) {
          return chat.name.toLowerCase().startsWith(searchTerm.toLowerCase());
        }
        return false;
      });
      setFindUsers(usersFind.length > 0 ? usersFind : []);
    }

    if (searchTerm === '') {
      setFindUsers(chatData.chats);
    }
  };

  const sortedAndFilteredChats = (findUsers && filterChat(findUsers))
    .filter((chat) => chat.messages.length > 0) 
    .sort((a, b) => {
      const lastMessageA = a.messages[a.messages.length - 1];
      const lastMessageB = b.messages[b.messages.length - 1];

      return (
        new Date(lastMessageB.createdAt).getTime() -
        new Date(lastMessageA.createdAt).getTime()
      );
    });

  return {
    findUsers,
    handleSearch,
    sortedAndFilteredChats,
  };
};
