import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { storage } from '../utils/storage';

SplashScreen.preventAutoHideAsync();

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
      const token = await storage.getToken();
      if (token) {
        console.log('✅ Token found, navigating to home screen');
        router.replace('/(tabs)');
      } else {
        console.log('❌ Token not found, navigating to phone screen');
        router.replace('/(auth)/phone');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>PFI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
});
