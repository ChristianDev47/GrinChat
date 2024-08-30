import { Call, ChatType, Message } from '../types/chat';

export const CHAT_ACTION_TYPES = {
  GET_CHAT_BY_USER: 'GET_CHAT_BY_USER',
  GET_CHAT_BY_ID: 'GET_CHAT_BY_ID',
  DELETE_CHAT: 'DELETE_CHAT',
  // Messages
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_STATUS_MESSAGE: 'UPDATE_STATUS_MESSAGE',
  DELETE_MESSAGE: 'DELETE_MESSAGE',
  // Calls
  GET_CALLS_BY_USER: 'GET_CALLS_BY_USER',
} as const;

interface GetChatsByUserAction {
  type: typeof CHAT_ACTION_TYPES.GET_CHAT_BY_USER;
  payload: ChatType[];
}

interface GetCallsByUserAction {
  type: typeof CHAT_ACTION_TYPES.GET_CALLS_BY_USER;
  payload: ChatType[];
}

interface GetChatByIdAction {
  type: typeof CHAT_ACTION_TYPES.GET_CHAT_BY_ID;
  payload: ChatType;
}

interface DeleteChatAction {
  type: typeof CHAT_ACTION_TYPES.DELETE_CHAT;
  payload: string;
}

interface AddMessageAction {
  type: typeof CHAT_ACTION_TYPES.ADD_MESSAGE;
  payload: Message;
}

interface UpdateStatusMessageAction {
  type: typeof CHAT_ACTION_TYPES.UPDATE_STATUS_MESSAGE;
  payload: Message;
}

interface DeleteMessageAction {
  type: typeof CHAT_ACTION_TYPES.DELETE_MESSAGE;
  payload: Message;
}

type ChatAction =
  | GetChatsByUserAction
  | GetCallsByUserAction
  | GetChatByIdAction
  | DeleteChatAction
  | AddMessageAction
  | DeleteMessageAction
  | UpdateStatusMessageAction;

interface ChatState {
  chats: ChatType[];
  myChat: ChatType;
  calls: Call[];
}

const UPDATE_STATE_BY_ACTION = {
  [CHAT_ACTION_TYPES.GET_CHAT_BY_USER]: (
    state: ChatState,
    action: GetChatsByUserAction
  ) => ({
    ...state,
    chats: action.payload,
  }),
  [CHAT_ACTION_TYPES.GET_CALLS_BY_USER]: (
    state: ChatState,
    action: GetCallsByUserAction
  ) => ({
    ...state,
    calls: action.payload,
  }),
  [CHAT_ACTION_TYPES.GET_CHAT_BY_ID]: (
    state: ChatState,
    action: GetChatByIdAction
  ) => ({
    ...state,
    myChat: action.payload,
  }),
  [CHAT_ACTION_TYPES.DELETE_CHAT]: (
    state: ChatState,
    action: DeleteChatAction
  ) => ({
    ...state,
    chats: state.chats.filter((chat) => chat._id !== action.payload),
  }),
  [CHAT_ACTION_TYPES.ADD_MESSAGE]: (
    state: ChatState,
    action: AddMessageAction
  ) => ({
    ...state,
    chats: state.chats.map((chat) => {
      if (chat._id === action.payload.chatId) {
        return {
          ...chat,
          messages: [...chat.messages, action.payload],
        };
      }
      return chat;
    }),
  }),
  [CHAT_ACTION_TYPES.UPDATE_STATUS_MESSAGE]: (
    state: ChatState,
    action: AddMessageAction
  ) => ({
    ...state,
    chats: state.chats.map((chat) => {
      if (chat._id === action.payload.chatId) {
        return {
          ...chat,
          messages: chat.messages.map((message) => {
            if (message._id === action.payload._id) {
              return {
                ...message,
                ...action.payload,
              };
            }
            return message;
          }),
        };
      }
      return chat;
    }),
  }),
  [CHAT_ACTION_TYPES.DELETE_MESSAGE]: (
    state: ChatState,
    action: AddMessageAction
  ) => ({
    ...state,
    chats: state.chats.map((chat) => {
      if (chat._id === action.payload.chatId) {
        return {
          ...chat,
          messages: chat.messages.filter(
            (message) => message._id !== action.payload._id
          ),
        };
      }
      return chat;
    }),
  }),
};

export const chatReducer = (
  state: ChatState,
  action: ChatAction
): ChatState => {
  const updateState = UPDATE_STATE_BY_ACTION[action.type];
  return action
    ? (updateState as (state: ChatState, action: ChatAction) => ChatState)(
        state,
        action
      )
    : state;
};
