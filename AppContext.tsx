import React, { createContext, useContext } from 'react';

interface MedicalHistoryData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  weight: string;
  height: string;
  medicalHistory: string[];
  otherMedicalHistory: string;
  postSurgeries: string;
  allergies: string;
  currentMedications: string;
  recentMedicalEvents: string;
  lifestyleFactors: { [key: string]: boolean };
  timestamp: Date;
}


interface AppContextType {
  showModal: (message: string, type?: 'success' | 'error' | 'info', onConfirm?: () => void) => void;
  medicalHistoryData: MedicalHistoryData | null;
  setMedicalHistoryData: (data: MedicalHistoryData | null) => void;
}

const AppContext = createContext<AppContextType>({
  showModal: () => {},
  medicalHistoryData: null,
  setMedicalHistoryData: () => {}, 
});

export const useAppContext = () => useContext(AppContext);

export default AppContext; 
