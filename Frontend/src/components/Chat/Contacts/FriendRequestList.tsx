'use client';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import { useAuth } from '@/src/hooks/useAuth';
import { FriendRequests, UserInfoType } from '@/src/types/user';
import InfoRequestList from './InfoRequestList';
import Search from '../Search';
import { useEffect, useState } from 'react';
import { config, useSpring, animated } from 'react-spring';
import backIcon from '../../../assets/back.svg';
import userIcon from '../../../assets/user.svg';

interface Props {
  setShowRequestList: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPageUsers: React.Dispatch<React.SetStateAction<UserInfoType>>;
  showPageUsers: UserInfoType;
}

export default function FriendRequestList({
  setShowRequestList,
  setShowPageUsers,
  showPageUsers,
}: Props) {
  const { user } = useAuth();
  const [findUsers, setFindUsers] = useState<FriendRequests[] | []>([]);

  useEffect(() => {
    setFindUsers(user.friendRequests.filter(friend => friend.status === 'Pending'));
  }, [user]);

  const handleSearch = (searchTerm: string) => {
    if (user.friendRequests.filter(friend => friend.status === 'Pending').length > 0) {
      const usersFind = user.friendRequests
        .map((myuser) => {
          const user = myuser.fromUserId;
          const fullname = `${user.name} ${user.surname}`;
          if (fullname.toLowerCase().startsWith(searchTerm)) {
            return myuser;
          }
          return undefined;
        })
        .filter((user): user is FriendRequests => user !== undefined);

      if (usersFind.length > 0) {
        setFindUsers(usersFind);
      } else {
        setFindUsers([]);
      }
    }
    if (searchTerm === '') {
      setFindUsers(user.friendRequests.filter(friend => friend.status === 'Pending'));
    }
  };

  const animationProps = useSpring({
    transform: showPageUsers.show ? 'translateX(0)' : 'translateX(-100%)',
    config: config.stiff,
  });

  return (
    <>
      <animated.div className={`${styles.InfoUserPage}`} style={animationProps}>
        <InfoRequestList
          showPageUsers={showPageUsers}
          setShowPageUsers={setShowPageUsers}
        />
      </animated.div>
      <div className={styles.PageContentChat}>
        <div className={styles.ContactListNav}>
          <button onClick={() => setShowRequestList(false)}>
            <Image src={backIcon} alt="search" width={15} height={15} />
          </button>
          <p>Solicitudes de mensaje</p>
        </div>
        <div className={styles.ContactListBody}>
          <Search onSearch={handleSearch} />

          {findUsers.length > 0 ? (
            findUsers.map((myuser) => {
              const user = myuser.fromUserId;
               {
                return (
                  <div
                    onClick={() => setShowPageUsers({ show: true, user })}
                    key={user._id}
                    className={styles.Contact}
                  >
                    <div className={styles.Image}>
                      {user && user.profilePicture ? (
                        <Image
                          className={styles.ImagePosition}
                          src={user.profilePicture}
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
                          {user.name} {user.surname}
                        </h3>
                        <p>{user.status}</p>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          ) : user.friendRequests.filter(friend => friend.status === 'Pending').length === 0 ? (
            <p className={styles.WithoutData}>
              No tienen solicitudes de mensaje
            </p>
          ):
          <p className={styles.WithoutData}>
         Sin resultados
        </p>
          }
        </div>
      </div>
    </>
  );
}
