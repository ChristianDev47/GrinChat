'use client';

import { useAuth } from '@/src/hooks/useAuth';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import addUserIcon from '../../../assets/addUser.svg';
import userIcon from '../../../assets/user.svg';
import userRequestIcon from '../../../assets/userRequest.svg';
import messageIcon from '../../../assets/message.svg';
import callIcon from '../../../assets/call.svg';
import menuIcon from '../../../assets/menu.svg';
import ModalToggle from '@/src/utilities/ModalToggle';
import UserModal from './UserModal';

interface Props {
  setShowNewChat: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRequestList: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPageUsersSection: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAdjustProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setCallList: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatNav({
  setShowNewChat,
  setShowRequestList,
  setShowPageUsersSection,
  setShowAdjustProfile,
  setCallList,
}: Props) {
  const { user } = useAuth();

 

  const requestList = user.friendRequests.filter(
    (req) => req.status === 'Pending'
  );


  return (
    <div className={styles.ChatNav}>
      <div className={styles.Image}>
        {user && user.profilePicture ? (
          <Image
            src={user.profilePicture}
            alt="user"
            width={100}
            height={100}
            style={{ width: 'auto', height: '100%', objectFit: 'cover' }}
            priority
          />
        ) : (
          <Image src={userIcon} alt="user" width={30} height={30} priority/>
        )}
      </div>
      <div className={styles.Config}>
        <button onClick={() => setShowPageUsersSection(true)}>
          <Image
            src={addUserIcon}
            alt="user"
            width={20}
            height={20}
            title="Buscar usuarios"
          />
        </button>
        <button onClick={() => setShowRequestList(true)}>
          {requestList.length > 0 && (
            <div className={styles.FrienRequestNotify}>
              <p>{requestList.length}</p>
            </div>
          )}
          <Image
            src={userRequestIcon}
            alt="user"
            width={25}
            height={25}
            title="Solicitudes de conversación"
          />
        </button>
        <button onClick={() => setShowNewChat(true)}>
          <Image
            src={messageIcon}
            alt="user"
            width={25}
            height={25}
            title="Nuevo chat"
          />
        </button>
        <button onClick={() => setCallList(true)}>
          <Image
            src={callIcon}
            alt="user"
            width={25}
            height={25}
            title="Registro de llamadas"
          />
        </button>
        <ModalToggle
          modalId="user-modal"
          toggleButtonId="user-toggle-btn"
          ModalComponent={UserModal}
          title={
            <Image
              src={menuIcon}
              alt="user"
              width={25}
              height={25}
              title="Menú"
            />
          }
          setShowAdjustProfile={setShowAdjustProfile}
        />
      </div>  
    </div>
  );
}
