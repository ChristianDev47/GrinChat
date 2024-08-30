'use client';
import styles from '../../../../styles/Chat.module.css';
import { DeleteMessageType } from '@/src/types/message';

interface Props {
  setDeleteModal: React.Dispatch<React.SetStateAction<DeleteMessageType>>;
  handleDeleteMessage: () => void;
}

export default function ModalDelete({
  setDeleteModal,
  handleDeleteMessage,
}: Props) {
  return (
    <div className={styles.DeleteModalContent}>
      <h3>¿Deseas eliminar este mensaje?</h3>
      <div>
        <button
          className="modal-close-button"
          onClick={() => setDeleteModal({ show: false, message: null })}
        >
          Cancelar
        </button>
        <button
          className="modal-close-button"
          onClick={() => handleDeleteMessage()}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
