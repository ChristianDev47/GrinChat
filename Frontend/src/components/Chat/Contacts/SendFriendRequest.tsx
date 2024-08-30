'use client';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { User, UserInfoType } from '@/src/types/user';
import { useAuth } from '@/src/hooks/useAuth';
import InfoUser from '../User/InfoUser';
import Search from '../Search';
import { config, useSpring, animated } from 'react-spring';
import backIcon from '../../../assets/back.svg';
import userIcon from '../../../assets/user.svg';

interface Props {
  setShowPageUsersSection: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPageUsers: React.Dispatch<React.SetStateAction<UserInfoType>>;
  showPageUsers: UserInfoType;
}

export default function SendFriendRequest({
  setShowPageUsersSection,
  setShowPageUsers,
  showPageUsers,
}: Props) {
  const { user, users } = useAuth();
  const [findUsers, setFindUsers] = useState<User[] | []>([]);

  useEffect(() => {
    const myUsersAvailables = users.filter(
      (myuser) =>
        user.contacts.find((cont) => cont.contactId._id === myuser._id)
          ?.contactId._id !== myuser._id
    );
    setFindUsers(myUsersAvailables);
  }, [users]);

  const handleSearch = (searchTerm: string) => {
    if (users.length > 0) {
      const usersFind = users
        .map((user) => {
          const fullname = `${user.name} ${user.surname}`;
          if (fullname.toLowerCase().startsWith(searchTerm)) {
            return user;
          }
          return undefined;
        })
        .filter((user): user is User => user !== undefined);

      if (usersFind.length > 0) {
        setFindUsers(usersFind);
      } else {
        setFindUsers([]);
      }
    }
    if (searchTerm === '') {
      setFindUsers(users);
    }
  };

  const animationProps = useSpring({
    transform: showPageUsers.show ? 'translateX(0)' : 'translateX(-100%)',
    config: config.stiff,
  });

  return (
    <>
      <animated.div className={`${styles.InfoUserPage}`} style={animationProps}>
        <InfoUser
          showPageUsers={showPageUsers}
          setShowPageUsers={setShowPageUsers}
        />
      </animated.div>
      <div className={styles.PageContentChat}>
        <div className={styles.ContactListNav}>
          <button onClick={() => setShowPageUsersSection(false)}>
            <Image src={backIcon} alt="search" width={15} height={15} />
          </button>
          <p>Buscar Usuarios</p>
        </div>
        <Search onSearch={handleSearch} />
        <div className={styles.ContactListBody}>
          {findUsers.length === 0 && (
            <p className={styles.NoResult}>No se encontraron coincidencias</p>
          )}
          {findUsers.length > 0 &&
            findUsers.map((myUser) => {
              if (myUser._id !== user._id) {
                return (
                  <div
                    onClick={() =>
                      setShowPageUsers({ show: true, user: myUser })
                    }
                    key={myUser._id}
                    className={styles.ContactAdd}
                  >
                    <div className={styles.Contact}>
                      <div className={styles.Image}>
                        {myUser && myUser.profilePicture ? (
                          <Image
                            className={styles.ImagePosition}
                            src={myUser.profilePicture}
                            alt="user"
                            width={100}
                            height={100}
                          />
                        ) : (
                          <Image
                            src={userIcon}
                            alt="user"
                            width={30}
                            height={30}
                          />
                        )}
                      </div>
                      <div className={styles.Info}>
                        <div>
                          <h3>
                            {myUser.name} {myUser.surname}
                          </h3>
                          <p>{myUser.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </div>
    </>
  );
}
