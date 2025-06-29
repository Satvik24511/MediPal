import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar'; 
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import {
  View,
  Text,
  StyleSheet
} from 'react-native'; 

import AppContext from '../AppContext';
import { ModalMessage } from '../components/ModalMessage';

export default function RootLayout() {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>('info');
  const [modalOnConfirm, setModalOnConfirm] = useState < (() => void) | undefined > (undefined);

  const [medicalHistoryData, setMedicalHistoryData] = useState<any | null>(null);

  const showModal = (message: string, type: 'success' | 'error' | 'info' = 'info', onConfirm?: () => void) => {
    setModalMessage(message);
    setModalType(type);
    setModalOnConfirm(() => onConfirm);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={rootLayoutStyles.loadingContainer}>
        <Text style={rootLayoutStyles.loadingText}>Loading Medilab...</Text>
      </View>
    );
  }

  const contextValue = React.useMemo(() => ({
    showModal,
    medicalHistoryData,
    setMedicalHistoryData
  }), [showModal, medicalHistoryData, setMedicalHistoryData]);
  
  return (
    <AppContext.Provider value={contextValue}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
        <ModalMessage
          visible={modalVisible} 
          message={modalMessage}
          type={modalType}
          onClose={() => {
            setModalVisible(false);
            setModalOnConfirm(undefined);
          }}
          onConfirm={modalOnConfirm}
        />
      </SafeAreaProvider>
    </AppContext.Provider>
  );
}

const rootLayoutStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7f6',
  },
  loadingText: {
    fontSize: 22,
    color: '#007bff',
  },
});