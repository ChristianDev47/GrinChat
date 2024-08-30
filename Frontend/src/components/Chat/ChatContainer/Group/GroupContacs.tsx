'use client';
import styles from '../../../../../styles/Chat.module.css';
import Image from 'next/image';
import { useAuth } from '@/src/hooks/useAuth';
import Search from '../../Search';
import { useEffect, useState } from 'react';
import { Contacts, User } from '@/src/types/user';
import { GroupContactType } from '@/src/types/chat';
import GroupData from './GroupData';
import { config, useSpring, animated } from 'react-spring';
import backIcon from '../../../../assets/back.svg';
import userIcon from '../../../../assets/user.svg';

interface Props {
  setGroupContacts: React.Dispatch<React.SetStateAction<GroupContactType>>;
  setShowNewChat: React.Dispatch<React.SetStateAction<boolean>>;
  groupContacts: GroupContactType;
}

export default function GroupContactList({
  setGroupContacts,
  groupContacts,
  setShowNewChat,
}: Props) {
  const { user } = useAuth();
  const [findUsers, setFindUsers] = useState<Contacts[] | []>([]);

  useEffect(() => {
    setFindUsers(user.contacts);
  }, [user]);

  const handleSearch = (searchTerm: string) => {
    if (user.contacts.length > 0) {
      const usersFind = user.contacts
        .map((myuser) => {
          const user = myuser.contactId;
          const fullname = `${user.name} ${user.surname}`;
          if (fullname.toLowerCase().startsWith(searchTerm)) {
            return myuser;
          }
          return undefined;
        })
        .filter((user): user is Contacts => user !== undefined);

      if (usersFind.length > 0) {
        setFindUsers(usersFind);
      } else {
        setFindUsers([]);
      }
    }
    if (searchTerm === '') {
      setFindUsers(user.contacts);
    }
  };

  const handleAddContact = (contact: User) => {
    const userInContacts = groupContacts.contacts.find(
      (user) => user._id === contact._id
    );

    if (!userInContacts) {
      setGroupContacts((prevState) => ({
        ...prevState,
        contacts: [...prevState.contacts, contact],
      }));
    } else {
      const newContacts = groupContacts.contacts.filter(
        (user) => user._id !== contact._id
      );

      setGroupContacts((prevState) => ({
        ...prevState,
        contacts: newContacts,
      }));
    }
  };

  const animationProps = useSpring({
    transform: groupContacts.showDataPage
      ? 'translateX(0)'
      : 'translateX(-100%)',
    config: config.stiff,
  });

  return (
    <>
      <animated.div className={`${styles.InfoUserPage}`} style={animationProps}>
        <GroupData
          setGroupContacts={setGroupContacts}
          groupContacts={groupContacts}
          setShowNewChat={setShowNewChat}
        />
      </animated.div>
      <div className={styles.PageContentChat}>
        <div className={styles.ContactListNav}>
          <button
            onClick={() =>
              setGroupContacts({
                show: false,
                contacts: [],
                showDataPage: false,
              })
            }
          >
            <Image src={backIcon} alt="search" width={15} height={15} />
          </button>
          <p>Nuevo Grupo</p>
        </div>
        <Search onSearch={handleSearch} />
        <div className={styles.ListContacts}>
          <h3>Selecciona usuarios</h3>
          {groupContacts.contacts.length > 1 && !groupContacts.showDataPage && (
            <button
              onClick={() =>
                setGroupContacts((prevState) => ({
                  ...prevState,
                  showDataPage: true,
                }))
              }
              className={styles.GroupContactContinue}
            >
              Continuar
            </button>
          )}
        </div>
        <div className={styles.ContactListBody}>
          {findUsers &&
            findUsers.map((contact) => {
              const userInContacts = groupContacts.contacts.find(
                (user) => user._id === contact.contactId._id
              );
              return (
                <div
                  key={contact._id}
                  className={`${styles.Contact} ${
                    userInContacts && styles.ContactSelected
                  }`}
                  onClick={() => handleAddContact(contact.contactId)}
                >
                  <div className={styles.Image}>
                    {contact.contactId.profilePicture ? (
                      <Image
                        className={styles.ImagePosition}
                        src={contact.contactId.profilePicture}
                        alt="user"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <Image src={userIcon} alt="user" width={25} height={25} />
                    )}
                  </div>
                  <div className={styles.Info}>
                    <div>
                      <h3>
                        {contact.contactId.name} {contact.contactId.surname}
                      </h3>
                      <p>{contact.contactId.status}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
