'use client';
import { ReactNode, createContext, useState } from 'react';
import { ChatFilters } from '../types/chat';

export function filterInitialState(): ChatFilters {
  return {
    not_read: false,
    type: 'Chat',
  };
}

interface FiltersContextProps {
  filters: ChatFilters;
  setFilters: React.Dispatch<React.SetStateAction<ChatFilters>>;
}

export const FiltersContext = createContext<FiltersContextProps | undefined>(
  undefined
);

interface FiltersProviderProps {
  children: ReactNode;
}

export function FiltersProvider({ children }: FiltersProviderProps) {
  const [filters, setFilters] = useState<ChatFilters>(filterInitialState);

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}
