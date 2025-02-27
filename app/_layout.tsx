import React from 'react';
import { View } from 'react-native';
import { Stack, Redirect } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load custom fonts
  const [loaded] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
  });

  React.useEffect(() => {
    if (loaded) {
      // Hide splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Show loading screen while fonts load
  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: '#4a6fd8' }} />;
  }

  // Return the root stack navigator
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="index" />
    </Stack>
  );
}
