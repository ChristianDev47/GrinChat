export interface MessageInfo {
  showPage: boolean;
  message: Message | null;
}

export interface ResponseMessageType {
  show: boolean;
  message: Message | null;
}

interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  messageType: string;
  response: Message;
  content: string;
  DeliverTime: string;
  fileUrl: string;
  fileName: string;
  ReadTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendFileType {
  data: File;
  content: string | null;
  file: string;
}

export interface FileType {
  chatId: string;
  senderId: string;
  content: string;
  messageType: string;
  fileUrl: string;
  fileName: string;
  DeliverTime: string;
  ReadTime: string;
}

export interface EmojiModalType {
  show: boolean;
  emoji: string | null;
}

export interface DeleteMessageType {
  show: boolean;
  message: Message | null;
}

export interface MessageFileType {
  show: boolean;
  message: Message[] | [];
  messageSelected: string | null;
}
