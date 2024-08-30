import Image from 'next/image';
import styles from '../../../../styles/Chat.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { socket } from '@/src/config/socket';
import { useAuth } from '@/src/hooks/useAuth';
import { useConversation } from '@/src/hooks/useConversation';
import {
  EmojiModalType,
  ResponseMessageType,
  SendFileType,
} from '@/src/types/message';
import { useEffect, useState } from 'react';
import FilesModal from './FilesModal';
import EmojiModal from './EmojiModal';
import { SendMessage } from '@/src/types/chat';
import RecordVoice from './RecordVoice';
import closeIcon from '../../../assets/close.svg';
import emoticonIcon from '../../../assets/emoticon.svg';
import plusIcon from '../../../assets/plus.svg';
import MessageResponse from './MessageResponse';
import ModalToggle from '@/src/utilities/ModalToggle';

type FormTypes = {
  message: string;
};

interface Props {
  responseMessage: ResponseMessageType;
  setResponseMessage: React.Dispatch<React.SetStateAction<ResponseMessageType>>;
  setImageSrc: React.Dispatch<React.SetStateAction<SendFileType[]>>;
}

export default function SendMessages({
  responseMessage,
  setResponseMessage,
  setImageSrc,
}: Props) {
  const { user } = useAuth();
  const { conversationData } = useConversation();
  const { participants, chatId } = conversationData;
  const { register, handleSubmit, reset, getValues, setValue } =
    useForm<FormTypes>();
  const [emojiModal, setEmojiModal] = useState<EmojiModalType>({
    show: false,
    emoji: null,
  });

  const myUser = participants?.find(
    (participant) => participant.userId._id === user._id
  );
  const participant = participants?.find(
    (participant) => participant.userId._id !== user._id
  );

  const onSubmit: SubmitHandler<FormTypes> = (data) => {
    let newParticipants;

    if (
      myUser?.status === 'Delete' ||
      myUser?.status === 'Out' ||
      participant?.status === 'Delete' ||
      participant?.status === 'Out'
    ) {
      newParticipants = participants?.map((participant) => {
        return {
          ...participant,
          status: 'Active',
        };
      });
      socket.emit('update_user_chat', {
        chatId,
        newParticipants,
        user,
        status: 'Active',
      });
    } else {
      newParticipants = participants;
    }
    const myAvailableParticipants =
      newParticipants?.filter(
        (participant) => participant.status !== 'Eliminated'
      ) || null;

    let message: SendMessage = {
      origin: user._id,
      message: data.message,
      destination: myAvailableParticipants,
    };
    if (chatId !== null) {
      message = {
        ...message,
        chatId: chatId,
      };
    }
    if (responseMessage.message !== null) {
      message = {
        ...message,
        response: responseMessage.message._id,
      };
    }
    setEmojiModal({emoji: null, show: false});
    socket.emit('message_sent', message);
    reset();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(onSubmit)();
      setResponseMessage({ show: false, message: null });
    }
  };

  useEffect(() => {
    if (emojiModal.emoji) {
      const currentValue = getValues('message');
      setValue('message', `${currentValue}${emojiModal.emoji}`);
    }
  }, [emojiModal, getValues, setValue]);

  return (
    <>
      <div className={styles.SendMessages}>
        {myUser?.status === 'Eliminated' ? (
          <p className={styles.Bloquet}>
            No puedes escribir en este chat porque estas eliminado
          </p>
        ) : myUser?.status === 'Bloqued' || myUser?.status === 'Out' ? (
          <p className={styles.Bloquet}>
            No puedes escribir en este chat porque estas bloqueado
          </p>
        ) : participant?.status === 'Bloqued' ||
          participant?.status === 'Out' ? (
          <p className={styles.Bloquet}>
            No puedes escribir en este chat porque bloqueaste a este usuario
          </p>
        ) : (
          <>
            <div
              className={`${styles.EmojiModal} ${
                emojiModal.show === true && styles.EmojiModalActived
              }`}
            >
              <EmojiModal setEmojiModal={setEmojiModal} />
            </div>
            <div
              className={`${styles.ResponseMessage} ${
                responseMessage.show === true && styles.ShowSendMessages
              }`}
            >
              {responseMessage.message && (
                <MessageResponse data={responseMessage.message} />
              )}
              <button
                onClick={() => {
                  setResponseMessage({ show: false, message: null });
                }}
              >
                <Image src={closeIcon} alt="emoticon" width={25} height={25} />
              </button>
            </div>
            <div className={styles.SendMessageInput}>
              <button
                className={styles.ButtonEmoji}
                onClick={() =>
                  setEmojiModal({ show: !emojiModal.show, emoji: null })
                }
              >
                <Image
                  src={emoticonIcon}
                  alt="emoticon"
                  width={25}
                  height={25}
                />
              </button>
              <ModalToggle
                modalId="file-modal"
                toggleButtonId="file-toggle-btn"
                ModalComponent={FilesModal}
                title={
                  <Image
                    src={plusIcon}
                    alt="plus"
                    width={25}
                    height={25}
                    title="Adjuntar"
                  />
                }
                setImageSrc={setImageSrc}
              />
              <form
                className={styles.SendInput}
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  autoComplete="off"
                  type="text"
                  {...register('message', { required: true })}
                  placeholder="Escribe un mensaje"
                  onKeyDown={handleKeyDown}
                />
              </form>
              <RecordVoice />
            </div>
          </>
        )}
      </div>
    </>
  );
}
