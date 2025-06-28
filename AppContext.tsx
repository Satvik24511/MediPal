import React, { createContext, useContext } from 'react';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

interface AppContextType {
  auth: Auth | null;
  db: Firestore | null;
  userId: string;
  appId: string;
  showModal: (message: string, type?: 'success' | 'error' | 'info', onConfirm?: () => void) => void;
}

const AppContext = createContext<AppContextType>({
  auth: null,
  db: null,
  userId: '',
  appId: '',
  showModal: () => {},
});

export const useAppContext = () => useContext(AppContext);

export default AppContext; 
