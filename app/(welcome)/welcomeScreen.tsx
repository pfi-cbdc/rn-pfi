import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome to <Text style={styles.highlight}>P-fi</Text>.
      </Text>
      <Text style={styles.subtitle}>Where something happens!</Text>

      <Swiper
        style={styles.slider}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        autoplay
        autoplayTimeout={3}
        showsButtons={false}
      >
        <Image
          source={{ uri: 'https://via.placeholder.com/300x400.png?text=Slide+1' }}
          style={styles.slideImage}
        />
        <Image
          source={{ uri: 'https://via.placeholder.com/300x400.png?text=Slide+2' }}
          style={styles.slideImage}
        />
        <Image
          source={{ uri: 'https://via.placeholder.com/300x400.png?text=Slide+3' }}
          style={styles.slideImage}
        />
      </Swiper>

      <Text style={styles.whyText}>Why?{"\n"}Because less is more.</Text>

      <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/(auth)/phone')}>
        <Text style={styles.loginButtonText}>Login with Phone</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF4EE',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginTop: 50,
  },
  highlight: {
    color: '#C1440E',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: '#000',
    marginBottom: 30,
  },
  slider: {
    height: height * 0.4,
  },
  slideImage: {
    width: width * 0.8,
    height: height * 0.4,
    borderRadius: 10,
    alignSelf: 'center',
  },
  dot: {
    backgroundColor: '#E0E0E0',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#C1440E',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  whyText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: '#000',
    marginVertical: 20,
  },
  loginButton: {
    backgroundColor: '#C1440E',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
