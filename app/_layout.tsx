import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AppContext from '../AppContext';
import { ModalMessage } from '../components/ModalMessage';
import { View, Text, StyleSheet } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyA6o167Xbyf37-xfIclITfbsDB4VTQ4-Oo",
  authDomain: "medipal-ddfc9.firebaseapp.com",
  projectId: "medipal-ddfc9",
  storageBucket: "medipal-ddfc9.firebasestorage.app",
  messagingSenderId: "632599606212",
  appId: "1:632599606212:web:1dc400c2c707218a36ea91",
  measurementId: "G-N3PXSEPNKW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appId = 'your-canvas-app-id';
const initialAuthToken = null; 

export default function RootLayout() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>('info');
  const [modalOnConfirm, setModalOnConfirm] = useState<(() => void) | undefined>(undefined);

  const showModal = (message: string, type: 'success' | 'error' | 'info' = 'info', onConfirm?: () => void) => {
    console.log("Show modal with message:", message);
    setModalMessage(message);
    setModalType(type);
    setModalOnConfirm(() => onConfirm); 
    setModalVisible(true);
  };

  useEffect(() => {
    const signInUser = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
        console.log("Firebase signed in successfully!");
        showModal('Signed in to Firebase successfully!', 'success');
      } catch (error: any) {
        console.error("Firebase Auth Error:", error.message);
        showModal(`Authentication failed: ${error.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!initialAuthToken && loading) {
         setLoading(false);
      }
    });

    signInUser();

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={rootLayoutStyles.loadingContainer}>
        <Text style={rootLayoutStyles.loadingText}>Loading Medilab...</Text>
      </View>
    );
  }

  const contextValue = React.useMemo(() => ({ auth, db, userId: currentUser?.uid || '', appId, showModal }), [auth, db, currentUser, appId,showModal]);

  return (
    <AppContext.Provider value={contextValue}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
        <ModalMessage
          visible={true}
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
