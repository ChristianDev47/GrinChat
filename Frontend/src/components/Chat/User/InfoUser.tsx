'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import { FriendRequests, User, UserInfoType } from '@/src/types/user';
import { useAuth } from '@/src/hooks/useAuth';
import { socket } from '@/src/config/socket';
import closeIcon from '../../../assets/close.svg';
import userIcon from '../../../assets/user.svg';

interface Props {
  showPageUsers: UserInfoType;
  setShowPageUsers: Dispatch<SetStateAction<UserInfoType>>;
}

export default function InfoUser({ showPageUsers, setShowPageUsers }: Props) {
  const { user, users } = useAuth();
  const [myUser, setMyUser] = useState<User | null>(null);
  const [userRequest, setUserRequest] = useState<FriendRequests[]>();

  const handleSendRequest = (myUser: User) => {
    socket.emit('friend_request', { user, friend: myUser });
  };

  useEffect(() => {
    if (showPageUsers.user) {
      const myUserData = users.find(
        (user) => showPageUsers.user?._id === user._id
      );
      if (myUserData !== undefined) {
        setMyUser(myUserData);
        const userRequested = myUserData.friendRequests.filter(
          (friend) => friend.fromUserId._id === user._id
        );
        setUserRequest(userRequested);
      }
    }
  }, [showPageUsers.user, user, users, myUser]);

  return (
    <div className={styles.ShowInfoPageContact}>
      <div className={styles.ContactListNav}>
        <button onClick={() => setShowPageUsers({ show: false, user: null })}>
          <Image src={closeIcon} alt="search" width={22} height={22} />
        </button>
        <p>Informacion del usuario</p>
      </div>
      {myUser && (
        <div className={styles.ContactListContent}>
          <div className={styles.ContactListImage}>
            <div className={styles.Image}>
              {myUser.profilePicture ? (
                <Image
                  className={styles.ImagePosition}
                  src={myUser.profilePicture}
                  alt="search"
                  width={302}
                  height={302}
                  priority
                />
              ) : (
                <Image src={userIcon} alt="user" width={150} height={150} priority/>
              )}
            </div>
            <p>
              {myUser.name} {myUser.surname}
            </p>
          </div>
          <div className={styles.ContactState}>
            <h3 className={styles.ContactTitle}>Estado</h3>
            <p>{myUser.status}</p>
          </div>
          <div className={styles.ContactAdd}>
            {userRequest && userRequest.length > 0 ? (
              userRequest[0].status === 'Pending' ? (
                <p className={styles.ContactAddSend}>Solicitud enviada</p>
              ) : userRequest[0].status === 'Accepted' ? (
                <p className={styles.ContactAddSend}>Solicitud Aceptada</p>
              ) : (
                userRequest[0].status === 'Rejected' && (
                  <p className={styles.ContactAddSend}>Solicitud Rechazada</p>
                )
              )
            ) : (
              <button onClick={() => handleSendRequest(myUser)}>
                Enviar solicitud
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
