import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.102.191:5002/api';

export default function PhoneScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    console.log('🔵 Submit pressed with phone number:', phoneNumber);

    if (!phoneNumber.trim()) {
      console.log('❌ Empty phone number');
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      console.log('❌ Invalid phone number format:', phoneNumber);
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Making API request to:', `${API_URL}/users`);
      console.log('📤 Request payload:', { phoneNumber });

      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('📥 Response data:', data);
      
      if (response.ok) {
        console.log('✅ Login successful, storing token');
        await AsyncStorage.setItem('userToken', data.token);
        console.log('✅ Token stored successfully');
        Alert.alert('Success', data.message, [
          {
            text: 'OK',
            onPress: () => {
              console.log('➡️ Navigating to tabs');
              router.replace('/(tabs)');
            },
          },
        ]);
      } else {
        console.log('❌ API error:', data.error);
        Alert.alert('Error', data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection and try again.'
      );
    } finally {
      console.log('🔄 Request completed');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        maxLength={10}
        editable={!loading}
      />
      <TouchableOpacity 
        style={[
          styles.button,
          phoneNumber.length >= 10 ? styles.buttonActive : styles.buttonInactive,
          loading && styles.buttonLoading,
        ]}
        onPress={handleSubmit}
        disabled={phoneNumber.length < 10 || loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Please wait...' : 'Continue'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#000',
  },
  buttonInactive: {
    backgroundColor: '#ccc',
  },
  buttonLoading: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
