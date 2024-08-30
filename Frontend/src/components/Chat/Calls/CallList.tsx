'use client';
import styles from '../../../../styles/Chat.module.css';
import Image from 'next/image';
import { useAuth } from '@/src/hooks/useAuth';
import { User } from '@/src/types/user';
import Search from '../Search';
import { useEffect, useState } from 'react';
import { Call, ParticipantsTypes } from '@/src/types/chat';
import { formatDate } from '@/src/utilities/dateFormat';
import { useChat } from '@/src/hooks/useChat';
import backIcon from '../../../assets/back.svg';
import userIcon from '../../../assets/user.svg';
import responseIcon from '../../../assets/response.svg';
import notResponseIcon from '../../../assets/notResponse.svg';
import callIcon from '../../../assets/call.svg';
import videoIcon from '../../../assets/video.svg';

interface Props {
  setCallList: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CallList({ setCallList }: Props) {
  const { user } = useAuth();
  const [findCalls, setFindCalls] = useState<Call[] | []>([]);
  const { chatData } = useChat();
  const { calls } = chatData;

  useEffect(() => {
    if (user._id.trim() !== '') {
      setFindCalls(calls);
    }
  }, [user]);

  const handleSearch = (searchTerm: string) => {
    if (calls.length > 0) {
      const callsFind = calls
        .map((call) => {
          const myUser: ParticipantsTypes | undefined = call.participants.find(
            (part) => part.userId._id !== user._id
          );
          if (myUser) {
            const user: User = myUser.userId;
            const fullname = `${user?.name} ${user?.surname}`;
            if (fullname.toLowerCase().startsWith(searchTerm)) {
              return call;
            }
          }
          return undefined;
        })
        .filter((user): user is Call => user !== undefined);

      if (callsFind.length > 0) {
        setFindCalls(callsFind);
      } else {
        setFindCalls([]);
      }
    }
    if (searchTerm === '') {
      setFindCalls(calls);
    }
  };


  return (
    <>
      <div className={styles.PageContentChat}>
        <div className={styles.ContactListNav}>
          <button onClick={() => setCallList(false)}>
            <Image src={backIcon} alt="search" width={15} height={15} />
          </button>
          <p>Lista de llamadas</p>
        </div>
        <Search onSearch={handleSearch} />
        <div className={styles.ContactListBody}>
          {findCalls.length > 0 ? (
            findCalls
              .slice()
              .reverse()
              .map((myCall) => {
                const myuser: ParticipantsTypes | undefined =
                  myCall.participants.find(
                    (part) => part.userId._id !== user._id
                  );
                if (myuser) {
                  return (
                    <div key={myuser._id} className={styles.Contact}>
                      <div className={styles.Image}>
                        {myuser.userId && myuser.userId.profilePicture ? (
                          <Image
                            className={styles.ImagePosition}
                            src={myuser.userId.profilePicture}
                            alt="user"
                            width={100}
                            height={100}
                            priority
                          />
                        ) : (
                          <Image
                            src={userIcon}
                            alt="user"
                            width={25}
                            height={25}
                            priority
                          />
                        )}
                      </div>
                      <div className={styles.Info}>
                        <div>
                          <h3>
                            {user.name} {user.surname}
                          </h3>
                          <div className={styles.callData}>
                            <Image
                              src={
                                myCall.status === 'Completed'
                                  ? responseIcon
                                  : notResponseIcon
                              }
                              alt="user"
                              width={25}
                              height={25}
                            />
                            <p>{formatDate(myCall.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={styles.CallButton}
                      >
                        <Image
                          src={
                            myCall.callType === 'Audio' ? callIcon : videoIcon
                          }
                          alt="user"
                          width={25}
                          height={25}
                        />
                      </div>
                    </div>
                  );
                }
              })
          ) : (
            <p className={styles.WithoutData}>
              No tienen ningun registro de llamada
            </p>
          )}
        </div>
      </div>
    </>
  );
}
