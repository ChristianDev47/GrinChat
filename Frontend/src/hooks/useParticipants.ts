import { useEffect, useState } from 'react';
import { User, Contacts } from '@/src/types/user';
import { AddParticipantType, ParticipantsTypes } from '@/src/types/chat';
import { useConversation } from '@/src/hooks/useConversation';
import { socket } from '@/src/config/socket';
import { useAuth } from '@/src/hooks/useAuth';

export const useParticipants = (
  editGroupPage: AddParticipantType,
  setEditGroupPage: React.Dispatch<React.SetStateAction<AddParticipantType>>
) => {
  const { user } = useAuth();
  const [findUsers, setFindUsers] = useState<User[] | null>([]);
  const [availableParticipants, setAvailableParticipants] = useState<
    User[] | null
  >([]);
  const { conversationData } = useConversation();
  const { participants, chatId } = conversationData;

  const getAvailableParticipants = (
    arr1: ParticipantsTypes[],
    arr2: Contacts[]
  ): User[] => {
    return arr2
      .filter(
        (contact) =>
          !arr1.some(
            (participant) =>
              participant.status !== 'Eliminated' &&
              participant.status !== 'Out' &&
              participant.userId._id === contact.contactId._id
          )
      )
      .map((contact) => contact.contactId);
  };

  useEffect(() => {
    if (participants) {
      const myParticipants =
        editGroupPage.type === 'add'
          ? getAvailableParticipants(participants, user.contacts).filter(
              (user) => user !== undefined
            )
          : participants
              .filter((obj) => obj.status === 'Active' && obj.role !== 'Admin')
              .map((obj) => obj.userId);

      setAvailableParticipants(myParticipants as User[]);
      setFindUsers(myParticipants as User[]);
    }
  }, [participants, editGroupPage.type]);

  const handleSearch = (searchTerm: string) => {
    if (availableParticipants && availableParticipants.length > 0) {
      const usersFind = availableParticipants
        .map((user) => {
          const fullname = `${user.name} ${user.surname}`;
          return fullname.startsWith(searchTerm) ? user : undefined;
        })
        .filter((user): user is User => user !== undefined);

      setFindUsers(usersFind.length > 0 ? usersFind : []);
    }
    if (searchTerm === '') {
      setFindUsers(availableParticipants);
    }
  };

  const handleAddContact = (contact: User) => {
    const userInContacts = editGroupPage.participants.find(
      (user) => user._id === contact._id
    );
    if (!userInContacts) {
      setEditGroupPage((prevState) => ({
        ...prevState,
        participants: [...prevState.participants, contact],
      }));
    } else {
      const newContacts = editGroupPage.participants.filter(
        (user) => user._id !== contact._id
      );
      setEditGroupPage((prevState) => ({
        ...prevState,
        participants: newContacts,
      }));
    }
  };

  const handleAddParticipants = () => {
    if (editGroupPage.type === 'add') {
      if (participants) {
        const participantsExisten = participants.filter(
          (obj2) =>
            !editGroupPage.participants.some(
              (obj1) => obj1._id === obj2.userId._id
            )
        );

        const newData = editGroupPage.participants.map((user) => ({ userId: user, role: 'Member', status: 'Active', _id: user._id }));

            console.log(newData, participantsExisten, [...participantsExisten, ...newData]); 

        socket.emit('add_participant', {
          admin: user,
          new_participants: newData,
          all_participants: [...participantsExisten, ...newData],
          chatId,
        });
      }
    } else {
      if (participants) {
        const newUsers = participants.filter(
          (obj2) =>
            !editGroupPage.participants.some(
              (obj1) => obj1._id === obj2.userId._id
            )
        );
        const deletedUsers = participants.filter((obj1) =>
          editGroupPage.participants.some(
            (obj2) => obj1.userId._id === obj2._id
          )
        );
        const allParticipants = deletedUsers.map((participant) => ({
          ...participant,
          status: 'Eliminated',
        }));
        console.log(allParticipants, deletedUsers); 

        socket.emit('delete_participant', {
          admin: user,
          all_participants: [...newUsers, ...allParticipants],
          deleted_participants: deletedUsers,
          chatId,
        });
      }
    }
    setEditGroupPage({ show: false, participants: [], type: '' });
  };

  return {
    findUsers,
    handleSearch,
    handleAddContact,
    handleAddParticipants,
  };
};
