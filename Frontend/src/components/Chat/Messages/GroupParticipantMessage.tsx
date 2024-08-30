import { useAuth } from '@/src/hooks/useAuth';
import styles from '../../../../styles/Chat.module.css';
import { ChatType } from '@/src/types/chat';

interface Props {
  chat: ChatType | undefined;
}

export default function GroupParticipantData({ chat }: Props) {
  const { user } = useAuth();
  const adminGroup =
    chat && chat.participants.find((userG) => userG.role === 'Admin');

  return (
    <>
      {chat && chat.type === 'Group' && (
        <div className={styles.GroupParticipantData}>
          {user._id === adminGroup?.userId._id ? (
            <p> Haz creado el grupo {chat.name}</p>
          ) : (
            <p>
              {adminGroup?.userId.name} {adminGroup?.userId.surname} ha creado
              el grupo {chat.name}
            </p>
          )}
        </div>
      )}
    </>
  );
}
