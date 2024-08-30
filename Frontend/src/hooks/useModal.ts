import { useContext } from 'react';
import { ModalContext } from '../context/modal';

export const useModal = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error('useModal must be used within a modalProvider');
  }

  return context;
};
