'use client';
import styles from '../../../../../styles/Chat.module.css';
import Image from 'next/image';
import { useParticipants } from '@/src/hooks/useParticipants';
import { AddParticipantType } from '@/src/types/chat';
import Search from '../../Search';
import backIcon from '../../../../assets/back.svg';
import userIcon from '../../../../assets/user.svg';

interface Props {
  setEditGroupPage: React.Dispatch<React.SetStateAction<AddParticipantType>>;
  editGroupPage: AddParticipantType;
}

export default function AddParticipants({
  setEditGroupPage,
  editGroupPage,
}: Props) {
  const { findUsers, handleSearch, handleAddContact, handleAddParticipants } =
    useParticipants(editGroupPage, setEditGroupPage);

  return (
    <div className={styles.PageContentChat}>
      <div className={styles.ContactListNav}>
        <button
          onClick={() =>
            setEditGroupPage({ show: false, participants: [], type: '' })
          }
        >
          <Image src={backIcon} alt="search" width={15} height={15} />
        </button>
        <p>
          {editGroupPage.type === 'add'
            ? 'Agregar participantes al grupo'
            : 'Eliminar participantes del grupo'}
        </p>
      </div>
      <Search onSearch={handleSearch} />
      <div className={styles.ListContacts}>
        <h3>
          {editGroupPage.type === 'add'
            ? 'Selecciona participantes'
            : 'Selecciona a los eliminados'}
        </h3>
        {editGroupPage.participants.length > 0 && (
          <button
            onClick={handleAddParticipants}
            className={styles.GroupContactContinue}
          >
            {editGroupPage.type === 'add' ? 'Agregar' : 'Eliminar'}
          </button>
        )}
      </div>
      <div className={styles.ContactListBody}>
        {findUsers &&
          findUsers.sort((a, b) => a.name.localeCompare(b.name)).map((contact, index) => {
            const userInContacts = editGroupPage.participants.find(
              (user) => user._id === contact._id
            );
            return (
              <div
                key={index}
                className={`${styles.Contact} ${
                  userInContacts && styles.ContactSelected
                }`}
                onClick={() => handleAddContact(contact)}
              >
                <div className={styles.Image}>
                  {contact.profilePicture ? (
                    <Image
                      className={styles.ImagePosition}
                      src={contact.profilePicture}
                      alt="user"
                      width={100}
                      height={100}
                      priority
                    />
                  ) : (
                    <Image src={userIcon} alt="user" width={25} height={25} priority/>
                  )}
                </div>
                <div className={styles.Info}>
                  <div>
                    <h3>
                      {contact.name} {contact.surname}
                    </h3>
                    <p>{contact.status}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}