import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
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

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

export default function RootLayout() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>('info');

  const showModal = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setModalMessage(message);
    setModalType(type);
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

  const contextValue = { auth, db, userId: currentUser?.uid || '', appId, showModal };

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
          onClose={() => setModalVisible(false)}
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

  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
