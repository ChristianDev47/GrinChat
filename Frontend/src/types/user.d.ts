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

interface Contacts {
  _id: string;
  contactId: User;
}

interface FriendRequests {
  _id?: string;
  fromUserId: User;
  status?: string;
}

export interface UpdateUserType {
  name: string;
  surname: string;
  status: string;
}

interface Groups {
  _id: string;
  groupId: string;
}

interface CreateUser {
  email: string;
  name: string;
  surname: string;
  password: string;
  status: string;
  profile?: File | null | undefined;
}

export interface LoginType {
  email: string;
  password: string;
}

export interface RegisterType {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface ChatType {
  participants: Participant[];
}

interface Participant {
  _id: string;
  userId: User;
}

export interface UserInfoType {
  show: boolean;
  user: User | null;
}
