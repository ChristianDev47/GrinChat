'use client';

import Image from 'next/image';
import { useAuth } from '@/src/hooks/useAuth';
import checkIcon from '../../../assets/check.svg';
import checksIcon from '../../../assets/checks.svg';
import checkBlueIcon from '../../../assets/checksBlue.svg';
import { Message } from '@/src/types/message';

export default function CheckMessages({ message }: { message: Message }) {
  const { user } = useAuth();

  return (
    <>
      {message.senderId === user._id &&
        message.messageType !== 'Call_Ended' &&
        message.messageType !== 'Call_Cancelled' &&
        message.messageType !== 'Call_Missed' &&
        message.messageType !== 'VideoCall_Ended' &&
        message.messageType !== 'VideoCall_Cancelled' &&
        message.messageType !== 'VideoCall_Missed' &&
        message.senderId === user._id &&
        message.messageType !== 'AddGroupParticipant' &&
        message.messageType !== 'DeleteGroupParticipant' &&
        (() => {
          switch (message.status) {
            case 'Sent':
              return (
                <Image src={checkIcon} alt="user" width={18} height={18} />
              );
            case 'Delivered':
              return (
                <Image src={checksIcon} alt="user" width={18} height={18} />
              );
            case 'Read':
              return (
                <Image src={checkBlueIcon} alt="user" width={18} height={18} />
              );
            default:
              return null;
          }
        })()}
    </>
  );
}
