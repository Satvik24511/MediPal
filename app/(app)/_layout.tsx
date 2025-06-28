import React from 'react';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function AppLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#8A2BE2',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
      },
      headerShadowVisible: false,
      headerTransparent: true,
      headerShown: false,
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
