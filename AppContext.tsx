import React, { createContext, useContext } from 'react';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

interface AppContextType {
  showModal: (message: string, type?: 'success' | 'error' | 'info', onConfirm?: () => void) => void;
}

const AppContext = createContext<AppContextType>({
  showModal: () => {},
});

export const useAppContext = () => useContext(AppContext);

export default AppContext; 
