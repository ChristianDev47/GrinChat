'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import { User, UserInfoType } from '@/src/types/user';
import { useAuth } from '@/src/hooks/useAuth';
import { socket } from '@/src/config/socket';
import closeIcon from '../../../assets/close.svg';
import userIcon from '../../../assets/user.svg';

interface Props {
  showPageUsers: UserInfoType;
  setShowPageUsers: Dispatch<SetStateAction<UserInfoType>>;
}

export default function InfoRequestList({
  showPageUsers,
  setShowPageUsers,
}: Props) {
  const { user, users } = useAuth();
  const [myUser, setMyUser] = useState<User | null>(null);

  useEffect(() => {
    if (showPageUsers.user) {
      const myUserData = users.find(
        (user) => showPageUsers.user?._id === user._id
      );
      if (myUserData !== undefined) {
        setMyUser(myUserData);
      }
    }
  }, [showPageUsers.user, user, users, myUser]);

  const requestData = user.friendRequests.filter(
    (myuser) => myuser.fromUserId._id === myUser?._id
  );
  const handleAcceptRequest = (myUser: User) => {
    socket.emit('friend_request_accept', { user, friend: myUser });
  };
  const handleRejectRequest = (myUser: User) => {
    socket.emit('friend_request_rejected', { user, friend: myUser });
  };

  return (
    <div className={styles.ShowInfoPageContact}>
      <div className={styles.ContactListNav}>
        <button onClick={() => setShowPageUsers({ show: false, user: null })}>
          <Image src={closeIcon} alt="search" width={22} height={22} priority/>
        </button>
        <p>Informacion del usuario</p>
      </div>
      {myUser && (
        <div className={styles.ContactListContent}>
          <div className={styles.ContactListImage}>
            <div className={styles.Image}>
              {myUser.profilePicture ? (
                <Image
                  src={myUser.profilePicture}
                  alt="search"
                  width={302}
                  height={302}
                  style={{
                    width: '230px',
                    height: '230px',
                    objectFit: 'cover',
                    borderRadius: '100rem',
                  }}
                />
              ) : (
                <Image src={userIcon} alt="user" width={150} height={150} />
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
            <>
              {requestData.length > 0 && requestData[0].status === 'Pending' ? (
                <>
                  <button onClick={() => handleAcceptRequest(myUser)}>
                    Aceptar solicitud
                  </button>
                  <button onClick={() => handleRejectRequest(myUser)}>
                    Rechazar solicitud
                  </button>
                </>
              ) : requestData.length > 0 &&
                requestData[0].status === 'Accepted' ? (
                <p className={styles.ContactAddSend}>Solicitud Aceptada</p>
              ) : (
                requestData.length > 0 &&
                requestData[0].status === 'Rejected' && (
                  <p className={styles.ContactAddSend}>Solicitud Rechazada</p>
                )
              )}
            </>
          </div>
        </div>
      )}
    </div>
  );
}
