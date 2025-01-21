import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ENV from '../../config/env';
import { storage } from '../../utils/storage';
import { useState, useEffect } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const [brandName, setBrandName] = useState('Your Company Name');

  const loadCompanyDetails = async () => {
    try {
      console.log('📡 Fetching company details...');
      const token = await storage.getToken();
      const response = await fetch(`${ENV.API_URL}/company/details`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBrandName(data.brandName);
        console.log('✅ Company details loaded successfully:', data);
      } else {
        console.log('❌ Failed to fetch company details:', response.status);
      }
    } catch (error) {
      console.error('⚠️ Error loading company details:', error);
    }
  };

  useEffect(() => {
    loadCompanyDetails();
  }, []);

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      const token = await storage.getToken();

      if (!token) {
        console.log('⚠️ No token found. Redirecting to login...');
        await storage.clearAll();
        router.replace('/(welcome)/welcomeScreen');
        return;
      }

      console.log('📡 Sending logout request...');
      const response = await fetch(`${ENV.API_URL}/users/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('✅ Logout successful. Clearing storage...');
        await storage.clearAll();
        router.replace('/(welcome)/welcomeScreen');
      } else {
        const errorData = await response.json();
        console.error('❌ Logout failed:', errorData);

        if (response.status === 401) {
          console.log('⚠️ Unauthorized. Clearing storage and redirecting...');
          await storage.clearAll();
          router.replace('/(welcome)/welcomeScreen');
        } else {
          Alert.alert('❗ Error', 'Failed to logout. Please try again.');
        }
      }
    } catch (error) {
      console.error('⚠️ Logout Error:', error);
      Alert.alert('❗ Error', 'Something went wrong while logging out');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.businessName}>{brandName}</Text>
        <TouchableOpacity style={styles.notificationButton} onPress={() => console.log('🔔 Notification clicked!')}>
          <Ionicons name="notifications-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Profile</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log('🏢 Navigating to Company Details...');
          router.push('/companyDetails');
        }}
      >
        <Text style={styles.buttonText}>Company Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log('👤 Navigating to User Profile...');
          router.push('/userDetails');
        }}
      >
        <Text style={styles.buttonText}>User Profile</Text>
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
    padding: 20,
    backgroundColor: '#FAF3E7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#D77A61',
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
    backgroundColor: '#D77A61',
    marginTop: 20,
  },
  logoutButtonText: {
    fontWeight: 'bold',
  },
});
