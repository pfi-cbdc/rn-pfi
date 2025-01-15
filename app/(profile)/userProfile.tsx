import { storage } from '@/utils/storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ENV from '../../config/env';

export default function UserProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
      const fetchToken = async () => {
          const storedToken = await storage.getToken() || "";
          try {
              const response = await fetch(`${ENV.API_URL}/users/userInfo`, {
                  method: 'POST', 
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ token: storedToken }), 
              });
  
              if (!response.ok) {
                  console.error('Failed to fetch user info:', response.statusText);
                  return;
              }
  
              const user = await response.json();
              setUser({name: '', email: '', phone: user.user.phoneNumber});
          } catch (error) {
              console.error('Error fetching user info:', error);
          }
      };
  
      fetchToken();
  }, []);
  

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
            await storage.removeToken();
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        } catch (error) {
          console.error(' Logout Error:', error);
          Alert.alert('Error', 'Something went wrong while logging out');
        }
      };
    

    return (
        <View style={styles.container}>
            <Text style={styles.text}>User Profile</Text>
            <View style={styles.profileSection}>
                <Text style={styles.label}>Name: {user.name}</Text>
                <Text style={styles.label}>Email: {user.email}</Text>
                <Text style={styles.label}>Phone: {user.phone}</Text>
                {/* <Text style={styles.label}>Token: {token}</Text> */}
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    profileSection: {
        width: '100%',
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
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
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
});