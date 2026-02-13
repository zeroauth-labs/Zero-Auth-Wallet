import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';
// Polyfill for crypto
import { useAuthStore } from '@/store/auth-store';
import { useWalletStore } from '@/store/wallet-store';
import { getRandomValues } from 'expo-crypto';
// import 'react-native-get-random-values'; // DISABLED

if (!global.crypto) {
  // @ts-ignore
  global.crypto = {};
}
// @ts-ignore
if (!global.crypto.getRandomValues) {
  // @ts-ignore
  global.crypto.getRandomValues = getRandomValues;
}

// Polyfill for TextEncoder (required by @stablelib/base64 and ed25519)
import { TextDecoder, TextEncoder } from 'text-encoding';
if (!global.TextEncoder) {
  // @ts-ignore
  global.TextEncoder = TextEncoder;
}
if (!global.TextDecoder) {
  // @ts-ignore
  global.TextDecoder = TextDecoder;
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const checkInitialization = useWalletStore((state) => state.checkInitialization);
  const isInitialized = useWalletStore((state) => state.isInitialized);
  const isLoading = useWalletStore((state) => state.isLoading);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync();
    checkInitialization().then(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (!isReady || isLoading || !hasHydrated) return;

    if (!isInitialized) {
      router.replace('/onboarding');
    }
  }, [isReady, isLoading, isInitialized, hasHydrated]);

  if (!isReady || !hasHydrated) {
    return null;
  }

  return (
    <View className="flex-1 bg-[#1a1b26]">
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      </Stack>
    </View>
  );
}
