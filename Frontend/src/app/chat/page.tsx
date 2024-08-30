'use client';

import { useState } from 'react';
import styles from '../../../styles/Chat.module.css';
import ChatNav from '@/src/components/Chat/ChatContainer/ChatNav';
import { useAuth } from '@/src/hooks/useAuth';
import { useConversation } from '@/src/hooks/useConversation';
import { AddParticipantType } from '@/src/types/chat';
import { useUserSearch } from '@/src/hooks/useParticipantSearch';
import ChatGroupComponent from '@/src/components/Chat/ChatContainer/Group/ChatGroup';
import ChatPages from '@/src/components/Chat/ChatContainer/ChatPages';
import ConversationContainer from '@/src/components/Chat/ConversationContainer/Content';
import ChatComponent from '@/src/components/Chat/ChatContainer/Chat/Chat';
import ChatFilters from '@/src/components/Chat/ChatContainer/ChatFilters';
import { useSocketListeners } from '@/src/hooks/useSocketListener';
import Loading from '../../ui/Loading';
import Search from '@/src/components/Chat/Search';

export default function Chat() {
  useSocketListeners();
  const { user } = useAuth();
  const { addConversationData, callPage, videoCallPage, conversationData } = useConversation();
  const [showNewChat, setShowNewChat] = useState<boolean>(false);
  const [showRequestList, setShowRequestList] = useState<boolean>(false);
  const [showPageUsersSection, setShowPageUsersSection] =
    useState<boolean>(false);
  const [showAdjustProfile, setShowAdjustProfile] = useState<boolean>(false);
  const [callList, setCallList] = useState<boolean>(false);
  const [editGroupPage, setEditGroupPage] = useState<AddParticipantType>({
    show: false,
    participants: [],
    type: '',
  });
  const { sortedAndFilteredChats, handleSearch } = useUserSearch();

  return (
    <Loading>
      <div className={styles.Chat}>
        <div className={styles.Content}>
          <div className={styles.Contacts}>
            <div className={styles.ContactsPage}>
              <ChatNav
                setShowNewChat={setShowNewChat}
                setShowRequestList={setShowRequestList}
                setShowPageUsersSection={setShowPageUsersSection}
                setShowAdjustProfile={setShowAdjustProfile}
                setCallList={setCallList}
              />
              <Search onSearch={handleSearch} />
              <ChatFilters />
              <div className={styles.ChatList}>
                <div className={styles.ChatListContent}>
                  {sortedAndFilteredChats.length > 0 ? (
                    sortedAndFilteredChats.map((chat) => {
                      const message = chat.messages[chat.messages.length - 1];
                      const messagesDontReaded = chat.messages.filter(
                        (message) =>
                          message.status === 'Delivered' &&
                          message.senderId !== user._id
                      );
                      const participnat =
                        chat.participants.find(
                          (userP) => userP.userId._id !== user._id
                        )?.userId ?? user;
                      const myParticipant =
                        chat.participants &&
                        chat.participants.find(
                          (participant) => participant.userId._id === user._id
                        );
                      if (
                        myParticipant &&
                        myParticipant.status !== 'Out' &&
                        myParticipant?.status !== 'Delete' &&
                        myParticipant?.status !== 'Eliminated'
                      ) {
                        return (
                          <div
                            key={chat._id}
                            onClick={() =>
                              addConversationData({
                                chatId: chat._id,
                                participants: chat.participants,
                              })
                            }
                            className={`${styles.Contact} ${conversationData.chatId === chat._id && styles.ContactSelected}`}
                          >
                            {chat.type === 'Chat' ? (
                              <ChatComponent
                                chat={chat}
                                message={message}
                                messagesDontReaded={messagesDontReaded}
                                participnat={participnat}
                                key={chat._id}
                              />
                            ) : (
                              <ChatGroupComponent
                                chat={chat}
                                message={message}
                                messagesDontReaded={messagesDontReaded}
                                participnat={participnat}
                                key={chat._id}
                              />
                            )}
                          </div>
                        );
                      }
                    })
                  ) : (
                    <p className={styles.WithoutData}>
                      No tienens ninguna conversacion
                    </p>
                  )}
                </div>
              </div>
              <ChatPages
                showNewChat={showNewChat}
                setShowNewChat={setShowNewChat}
                showRequestList={showRequestList}
                setShowRequestList={setShowRequestList}
                showPageUsersSection={showPageUsersSection}
                setShowPageUsersSection={setShowPageUsersSection}
                showAdjustProfile={showAdjustProfile}
                setShowAdjustProfile={setShowAdjustProfile}
                callList={callList}
                setCallList={setCallList}
                editGroupPage={editGroupPage}
                setEditGroupPage={setEditGroupPage}
                callPage={callPage}
                videoCallPage={videoCallPage}
              />
            </div>
          </div>
          <ConversationContainer setEditGroupPage={setEditGroupPage} />
        </div>
      </div>
    </Loading>
  );
}
