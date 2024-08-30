'use client';

import { useState } from 'react';
import styles from '../../../../styles/Chat.module.css';
import { UserInfoType } from '@/src/types/user';
import { AddParticipantType } from '@/src/types/chat';
import ContactList from '../Contacts/ContactList';
import FriendRequestList from '../Contacts/FriendRequestList';
import CallList from '../Calls/CallList';
import CallComponent from '../Calls/CallComponent';
import VideoCallComponent from '../Calls/VideoCallComponent';
import { animated, config, useSpring } from 'react-spring';
import SendFriendRequest from '../Contacts/SendFriendRequest';
import AdjustProfile from '../User/AdjustProfile';
import AddParticipants from './Group/AddParticipant';

interface Props {
  showNewChat: boolean;
  showRequestList: boolean;
  showPageUsersSection: boolean;
  showAdjustProfile: boolean;
  callList: boolean;
  callPage: boolean;
  videoCallPage: boolean;
  editGroupPage: AddParticipantType;
  setShowNewChat: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRequestList: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPageUsersSection: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAdjustProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setCallList: React.Dispatch<React.SetStateAction<boolean>>;
  setEditGroupPage: React.Dispatch<React.SetStateAction<AddParticipantType>>;
}

export default function ChatPages({
  showNewChat,
  setShowNewChat,
  showRequestList,
  setShowRequestList,
  showPageUsersSection,
  setShowPageUsersSection,
  showAdjustProfile,
  setShowAdjustProfile,
  callList,
  setCallList,
  setEditGroupPage,
  editGroupPage,
  callPage,
  videoCallPage,
}: Props) {
  const [showPageUsers, setShowPageUsers] = useState<UserInfoType>({
    show: false,
    user: null,
  });

  const showComponent =
    showNewChat ||
    showRequestList ||
    showPageUsersSection ||
    editGroupPage.show ||
    showAdjustProfile ||
    callList ||
    callPage ||
    videoCallPage;

  const animationProps = useSpring({
    transform: showComponent ? 'translateX(0)' : 'translateX(-100%)',
    config: config.stiff,
  });

  const renderComponent = () => {
    switch (true) {
      case showNewChat:
        return (
          <animated.div className={styles.ContactList} style={animationProps}>
            <ContactList setShowNewChat={setShowNewChat} />
          </animated.div>
        );
      case showRequestList:
        return (
          <animated.div className={styles.RequestList} style={animationProps}>
            <FriendRequestList
              setShowRequestList={setShowRequestList}
              setShowPageUsers={setShowPageUsers}
              showPageUsers={showPageUsers}
            />
          </animated.div>
        );
      case showPageUsersSection:
        return (
          <animated.div className={styles.RequestList} style={animationProps}>
            <SendFriendRequest
              setShowPageUsersSection={setShowPageUsersSection}
              setShowPageUsers={setShowPageUsers}
              showPageUsers={showPageUsers}
            />
          </animated.div>
        );
      case editGroupPage.show:
        return (
          <animated.div className={styles.RequestList} style={animationProps}>
            <AddParticipants
              setEditGroupPage={setEditGroupPage}
              editGroupPage={editGroupPage}
            />
          </animated.div>
        );
      case showAdjustProfile:
        return (
          <animated.div className={styles.RequestList} style={animationProps}>
            <AdjustProfile setShowAdjustProfile={setShowAdjustProfile} />
          </animated.div>
        );
      case callList:
        return (
          <animated.div className={styles.RequestList} style={animationProps}>
            <CallList setCallList={setCallList} />
          </animated.div>
        );
      case callPage:
        return (
          <animated.div
            className={styles.RequestListCall}
            style={animationProps}
          >
            <CallComponent />
          </animated.div>
        );
      case videoCallPage:
        return (
          <animated.div
            className={styles.RequestListCall}
            style={animationProps}
          >
            <VideoCallComponent />
          </animated.div>
        );
      default:
        return null;
    }
  };

  return renderComponent();
}
