import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { storage } from '../utils/storage';
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function Splash() {
  const router = useRouter();
  const scaleAnimP = useRef(new Animated.Value(1)).current;
  const scaleAnimFi = useRef(new Animated.Value(0.5)).current;
  const opacityAnimFi = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnimP, {
        toValue: 0.5,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(opacityAnimFi, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimFi, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    const checkAuthAndRedirect = async () => {
      const isAuthenticated = await storage.isAuthenticated();
      await SplashScreen.hideAsync();
      
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(welcome)/welcomeScreen');
      }
    };

    const timer = setTimeout(checkAuthAndRedirect, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Animated.Text
          style={[
            styles.text,
            { transform: [{ scale: scaleAnimP }] },
          ]}
        >
          P
        </Animated.Text>

        <Animated.Text
          style={[
            styles.text,
            { transform: [{ scale: scaleAnimFi }], opacity: opacityAnimFi },
          ]}
        >-fi
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF3E7',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#4F2D13',
  },
});