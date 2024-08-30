'use client';
import { createContext, ReactNode, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth.ts';
import { Call, ChatType, Message } from '../types/chat.ts';
import { chatReducer } from '../reducers/chats.tsx';
import {
  deleteChat,
  getCalls,
  getChats,
  getGroups,
  getMessagesByChat,
} from '../services/chats.tsx';

// Contexto
interface ChatContextProps {
  chatData: {
    chats: ChatType[];
    myChat: ChatType;
    calls: Call[];
  };
  getChatsByUser: () => void;
  getCallsByUser: () => void;
  getChatById: (chatId: string) => void;
  deletechat: (chatId: string) => void;
  // Messages
  addMessage: (message: Message) => void;
  updateStatusMessage: (message: Message) => void;
  deleteMessage: (message: Message) => void;
}

export const ChatsContext = createContext<ChatContextProps | undefined>(
  undefined
);

const chatInitialState = {
  chats: [] as ChatType[],
  myChat: {} as ChatType,
  calls: [] as Call[],
};

function useChats() {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(chatReducer, chatInitialState);

  // CHATS
  const getChatsByUser = async () => {
    try {
      const chats = await getChats({ idUser: user._id });
      const groups = await getGroups({ idUser: user._id });

      const chatsWithMessagesPromises = chats.map(async (chat: ChatType) => {
        const messages = await getMessagesByChat({ chatId: chat._id });
        return {
          ...chat,
          type: 'Chat',
          messages,
        };
      });

      const groupsWithMessagesPromises = groups.map(async (group: ChatType) => {
        const messages = await getMessagesByChat({ chatId: group._id });
        return {
          ...group,
          name: group.name,
          image: group.image,
          type: 'Group',
          messages,
        };
      });
      const allPromises = [
        ...chatsWithMessagesPromises,
        ...groupsWithMessagesPromises,
      ];
      const chatsWithMessages = await Promise.all(allPromises);

      dispatch({ type: 'GET_CHAT_BY_USER', payload: chatsWithMessages });
    } catch (error) {
      console.error('Error fetching chats and groups:', error);
    }
  };

  const getChatById = (chatId: string) => {
    const chat = state.chats.find((chat) => chat._id === chatId);
    if (chat) {
      dispatch({ type: 'GET_CHAT_BY_ID', payload: chat });
    }
  };

  const deletechat = async (chatId: string) => {
    await deleteChat({ id: chatId });
    dispatch({ type: 'DELETE_CHAT', payload: chatId });
  };

  const addMessage = async (message: Message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  const updateStatusMessage = async (message: Message) => {
    dispatch({ type: 'UPDATE_STATUS_MESSAGE', payload: message });
  };

  const deleteMessage = async (message: Message) => {
    dispatch({ type: 'DELETE_MESSAGE', payload: message });
  };

  const getCallsByUser = async () => {
    const myCalls = await getCalls({ idUser: user._id });
    if (myCalls) {
      dispatch({ type: 'GET_CALLS_BY_USER', payload: myCalls });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user._id && user._id !== '') {
        await getChatsByUser();
        await getCallsByUser();
      }
    };
    fetchData();
  }, [user]);

  return {
    state,
    getChatsByUser,
    getCallsByUser,
    deletechat,
    getChatById,
    addMessage,
    deleteMessage,
    updateStatusMessage,
  };
}

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const {
    state,
    getChatsByUser,
    getCallsByUser,
    deletechat,
    getChatById,
    addMessage,
    deleteMessage,
    updateStatusMessage,
  } = useChats();

  return (
    <ChatsContext.Provider
      value={{
        chatData: state,
        getChatsByUser,
        getCallsByUser,
        deletechat,
        getChatById,
        addMessage,
        deleteMessage,
        updateStatusMessage,
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
}

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
