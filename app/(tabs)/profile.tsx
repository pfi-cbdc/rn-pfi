import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ENV from '../../config/env';
import { storage } from '../../utils/storage';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    console.log(' Logout button pressed');
    
    try {
      console.log(' Retrieving stored token');
      const token = await storage.getToken();
      
      if (!token) {
        console.log(' No token found, redirecting to login');
        router.replace('/(auth)/phone');
        return;
      }

      console.log(' Making logout request to:', `${ENV.API_URL}/users/logout`);
      const response = await fetch(`${ENV.API_URL}/users/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(' Logout response status:', response.status);
      
      if (response.ok) {
        console.log(' Logout successful, clearing token');
        await storage.removeToken();
        console.log(' Token cleared successfully');
        console.log(' Navigating to login screen');
        router.replace('/(auth)/phone');
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
      <Text style={styles.title}>Profile</Text>
      
      <TouchableOpacity 
        style={styles.profileButton} 
        onPress={() => router.push('/userDetails')}
      >
        <Text style={styles.buttonText}>User Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.profileButton} 
        onPress={() => router.push('/companyDetails')}
      >
        <Text style={styles.buttonText}>Company Details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  profileButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
