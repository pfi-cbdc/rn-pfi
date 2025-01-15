import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { storage } from '../utils/storage';

SplashScreen.preventAutoHideAsync();

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const isAuthenticated = await storage.isAuthenticated();
      await SplashScreen.hideAsync();
      
      if (isAuthenticated) {
        router.replace('/(tabs)'); // Replace with your main app route
      } else {
        router.replace('/(auth)/phone');
      }
    };

    const timer = setTimeout(checkAuthAndRedirect, 2000);
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
