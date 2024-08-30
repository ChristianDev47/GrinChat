interface User {
  _id: string;
  email: string;
  name: string;
  surname: string;
  password: string;
  access_token: string;
  status: string;
  profilePicture?: null | undefined | string;
  contacts: Contacts[];
  friendRequests: FriendRequests[];
  groups: Groups[];
  createdAt: string;
  updatedAt: string;
}

interface ParticipantsTypes {
  _id?: string;
  userId: User;
  role?: string;
  status?: string;
}

export interface ChatType {
  _id: string;
  name?: string;
  image?: string;
  type: string;
  participants: ParticipantsTypes[];
  messages: Message[];
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  messageType: string;
  content: string;
  response: Message;
  DeliverTime: string;
  ReadTime: string;
  status: string;
  fileUrl: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropConversation {
  participants: ParticipantsTypes[] | null | undefined;
  chatId: string | null | undefined;
}

export interface SendMessage {
  origin: string;
  message: string;
  destination: ParticipantsTypes[] | null;
  chatId?: string;
  response?: string;
}

export interface ChatFilters {
  not_read: boolean;
  type: string;
}

export interface GroupContactType {
  show: boolean;
  showDataPage: boolean;
  contacts: User[] | [];
}

export interface AddParticipantType {
  show: boolean;
  participants: User[] | [];
  type: string;
}

export interface Call {
  _id: string;
  callType: string;
  participants: ParticipantsTypes[];
  startTime: string;
  status: string;
  chatId: string | null | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface CallType {
  call: Call;
  userStartCalling?: User;
}
