import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.102.191:5002/api';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    console.log(' Logout button pressed');
    
    try {
      console.log(' Retrieving stored token');
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        console.log(' No token found, redirecting to login');
        router.replace('/phone');
        return;
      }

      console.log(' Making logout request to:', `${API_URL}/users/logout`);
      const response = await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(' Logout response status:', response.status);
      
      if (response.ok) {
        console.log(' Logout successful, clearing token');
        await AsyncStorage.removeItem('userToken');
        console.log(' Token cleared successfully');
        console.log(' Navigating to login screen');
        router.replace('/phone');
      } else {
        const errorData = await response.json();
        console.log(' Logout failed:', errorData);
        Alert.alert('Error', 'Failed to logout. Please try again.');
      }
    } catch (error) {
      console.error(' Logout Error:', error);
      Alert.alert('Error', 'Something went wrong while logging out');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hi</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
