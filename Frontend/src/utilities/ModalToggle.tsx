import { useState, useEffect, MouseEvent, FC, useRef } from 'react';
import { AddParticipantType, Message } from '../types/chat';
import { MessageInfo, ResponseMessageType, SendFileType } from '../types/message';
import styles from '../../styles/Chat.module.css';

interface ModalToggleProps {
  modalId: string;
  toggleButtonId: string;
  ModalComponent: React.ElementType;
  className?: string;
  title: string | JSX.Element;
  setShowAdjustProfile?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInfoContact?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInfoGroup?: React.Dispatch<React.SetStateAction<boolean>>;
  setEditGroupPage?: React.Dispatch<React.SetStateAction<AddParticipantType>>;
  data?: Message;
  setShowInfoPage?: React.Dispatch<React.SetStateAction<MessageInfo>>;
  setResponseMessage?: React.Dispatch<React.SetStateAction<ResponseMessageType>>;
  setImageSrc?: React.Dispatch<React.SetStateAction<SendFileType[]>>;
}

const ModalToggle: FC<ModalToggleProps> = ({
  modalId,
  toggleButtonId,
  ModalComponent,
  className,
  title,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | globalThis.MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.ModalToogle}>
      <button
        id={toggleButtonId}
        onClick={handleToggleClick}
        className={className}
        title={typeof title === 'string' ? title : undefined}
      >
        {title}
      </button>
      {isOpen && (
        <div id={modalId} ref={modalRef}>
          <ModalComponent {...props} closeModal={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default ModalToggle;
