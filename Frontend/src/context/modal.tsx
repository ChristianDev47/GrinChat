'use client';

import { createContext, useState, ReactNode, FC } from 'react';

interface ModalContextType {
  openModalId: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const openModal = (id: string) => setOpenModalId(id);
  const closeModal = () => setOpenModalId(null);

  return (
    <ModalContext.Provider value={{ openModalId, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
