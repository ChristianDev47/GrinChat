'use client';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import { useAuth } from '@/src/hooks/useAuth';
import { useConversation } from '@/src/hooks/useConversation';
import Search from '../Search';
import { useEffect, useState } from 'react';
import { Contacts } from '@/src/types/user';
import { GroupContactType } from '@/src/types/chat';
import GroupContactList from '../ChatContainer/Group/GroupContacs';
import { config, useSpring, animated } from 'react-spring';
import backIcon from '../../../assets/back.svg';
import usersIcon from '../../../assets/users.svg';
import userIcon from '../../../assets/user.svg';

interface Props {
  setShowNewChat: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContactList({ setShowNewChat }: Props) {
  const { user } = useAuth();
  const { addConversationData } = useConversation();
  const [findUsers, setFindUsers] = useState<Contacts[] | []>([]);
  const [groupContacts, setGroupContacts] = useState<GroupContactType>({
    show: false,
    showDataPage: false,
    contacts: [],
  });

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

  const animationProps = useSpring({
    transform: groupContacts.show ? 'translateX(0)' : 'translateX(-100%)',
    config: config.stiff,
  });

  return (
    <>
      <animated.div className={`${styles.InfoUserPage}`} style={animationProps}>
        <GroupContactList
          setGroupContacts={setGroupContacts}
          groupContacts={groupContacts}
          setShowNewChat={setShowNewChat}
        />
      </animated.div>
      <div className={styles.PageContentChat}>
        <div className={styles.ContactListNav}>
          <button onClick={() => setShowNewChat(false)}>
            <Image src={backIcon} alt="search" width={15} height={15} />
          </button>
          <p>Nuevo Chat</p>
        </div>
        <Search onSearch={handleSearch} />
        <div className={styles.ContactListBody}>
          {findUsers.length > 0 && (
            <>
              <div className={styles.Contact}>
                <div className={styles.Image}>
                  <Image src={usersIcon} alt="user" width={30} height={30} />
                </div>
                <div
                  onClick={() =>
                    setGroupContacts({
                      show: true,
                      contacts: [],
                      showDataPage: false,
                    })
                  }
                  className={styles.Info}
                >
                  <h3 className={styles.NewGroup}>Nuevo Grupo</h3>
                </div>
              </div>
              <div className={styles.ListContacts}>
                <h3>Tu Lista de Contactos</h3>
              </div>
            </>
          )}
          {findUsers.length > 0 ? (
            findUsers.sort((a, b) => a.contactId.name.localeCompare(b.contactId.name)).map((contact) => {
              if (contact.contactId._id !== user._id) {
                return (
                  <div
                    key={contact._id}
                    className={styles.Contact}
                    onClick={() => {
                      addConversationData({
                        participants: [{ userId: contact.contactId }],
                      });
                      setShowNewChat(false);
                    }}
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
                        <Image
                          src={userIcon}
                          alt="user"
                          width={25}
                          height={25}
                        />
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
              }
            })
          ) : (
            <p className={styles.WithoutData}>No tienen contactos</p>
          )}
        </div>
      </div>
    </>
  );
}
