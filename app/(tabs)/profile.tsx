import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ENV from '../../config/env';
import { storage } from '../../utils/storage';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = await storage.getToken();
      
      if (!token) {
        console.log('No token found, redirecting to login');
        await storage.clearAll();
        router.replace('/(auth)/phone');
        return;
      }

      const response = await fetch(`${ENV.API_URL}/users/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        await storage.clearAll();
        router.replace('/(auth)/phone');
      } else {
        const errorData = await response.json();
        console.error('Logout failed:', errorData);
        
        if (response.status === 401) {
          // If unauthorized, clear storage and redirect anyway
          await storage.clearAll();
          router.replace('/(auth)/phone');
        } else {
          Alert.alert('Error', 'Failed to logout. Please try again.');
        }
      }
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('Error', 'Something went wrong while logging out');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/userDetails')}
      >
        <Text style={styles.buttonText}>User Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/companyDetails')}
      >
        <Text style={styles.buttonText}>Company Details</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    marginTop: 20,
  },
  logoutButtonText: {
    fontWeight: 'bold',
  },
});
