'use client';
import styles from '../../../../styles/Chat.module.css';
import { AddParticipantType } from '@/src/types/chat';
import { MessageInfo } from '@/src/types/message';
import { useState } from 'react';
import Conversation from './Conversation';
import InfoPage from './InfoPage';
import InfoContact from './InfoContact';
import InfoGroup from './InfoGroup';

interface Props {
  setEditGroupPage: React.Dispatch<React.SetStateAction<AddParticipantType>>;
}

export default function ConversationContainer({ setEditGroupPage }: Props) {
  const [showInfoPage, setShowInfoPage] = useState<MessageInfo>({
    showPage: false,
    message: null,
  });
  const [showInfoContact, setShowInfoContact] = useState<boolean>(false);
  const [showInfoGroup, setShowInfoGroup] = useState<boolean>(false);
  return (
    <>
      <div
        className={`${styles.Conversation} ${
          (showInfoPage.showPage === true ||
            showInfoContact === true ||
            showInfoGroup === true) &&
          styles.ConversationPageWithInfo
        }`}
      >
        <Conversation
          setShowInfoPage={setShowInfoPage}
          setShowInfoContact={setShowInfoContact}
          setShowInfoGroup={setShowInfoGroup}
          setEditGroupPage={setEditGroupPage}
        />
      </div>
      <div
        className={`${styles.InfoPage} ${
          showInfoPage.showPage === true && styles.ShowInfoPage
        }`}
      >
        <InfoPage
          setShowInfoPage={setShowInfoPage}
          showInfoPage={showInfoPage}
        />
      </div>
      <div
        className={`${styles.InfoPage} ${
          showInfoContact === true && styles.ShowInfoPage
        }`}
      >
        <InfoContact setShowInfoContact={setShowInfoContact} />
      </div>
      <div
        className={`${styles.InfoPage} ${
          showInfoGroup === true && styles.ShowInfoPage
        }`}
      >
        <InfoGroup setShowInfoGroup={setShowInfoGroup} />
      </div>
    </>
  );
}
