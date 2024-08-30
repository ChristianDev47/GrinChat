'use client';
import { useConversation } from '@/src/hooks/useConversation';
import styles from '../../../../styles/Chat.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { Logout } from '@/src/services/user';
import toast from 'react-hot-toast';

interface Props {
  setShowAdjustProfile: React.Dispatch<React.SetStateAction<boolean>>;
  closeModal: () => void
}

export default function UserModal({setShowAdjustProfile, closeModal}: Props) {
  const { logout } = useAuth();
  const router = useRouter();
  const { addConversationData } = useConversation();

  const handleLogout = () => {
    const myUserLogout = async () => {
      await Logout();
    };
    const logoutWithToast = () => {
      toast.promise(
        myUserLogout().then(() => {
          logout();
          addConversationData({ chatId: null, participants: null });
          router.push('/');
        }),
        {
          loading: 'Cerrando sesión...',
          success: '¡Sesión cerrada exitosamente!',
          error: 'Error al cerrar sesión',
        },
        {
          duration: 6000,
        }
      );
    };
    closeModal();
    logoutWithToast();
  };
  return (
    <div
    className={`${styles.ShowModalInfoContact}`}
    >
      <ul className={styles.FilesModal}>
        <button
          onClick={() => {
            setShowAdjustProfile(true);
            closeModal();
          }}
        >
          Ajustes
        </button>
        <button onClick={() => handleLogout()}>Cerrar Sesión</button>
      </ul>
    </div>
  );
    
}
