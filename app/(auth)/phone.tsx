import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ENV from '../../config/env';

const API_URL = ENV.API_URL;

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
      console.log('🔄 Making API request to:', `${API_URL}/users/send-otp`);
      console.log('📤 Request payload:', { phoneNumber: '+91' + phoneNumber });

      const response = await fetch(`${API_URL}/users/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: '+91' + phoneNumber }),
      });

      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('📥 Response data:', data);
      
      if (response.ok) {
        console.log('✅ OTP sent successfully');
        Alert.alert('Success', 'Verification code sent to your phone number', [
          {
            text: 'OK',
            onPress: () => {
              console.log('➡️ Navigating to verify screen');
              router.push({
                pathname: '/verify',
                params: { phoneNumber: '+91' + phoneNumber }
              });
            },
          },
        ]);
      } else {
        console.log('❌ Failed to send OTP:', data.error);
        Alert.alert('Error', data.error || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      console.log('🔄 Request completed');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Phone Number</Text>
      <Text style={styles.subtitle}>
        We'll send you a verification code
      </Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter your phone number"
        keyboardType="number-pad"
        maxLength={10}
        editable={!loading}
      />
      <TouchableOpacity
        style={[
          styles.button,
          phoneNumber.length === 10 ? styles.buttonActive : styles.buttonInactive,
          loading && styles.buttonLoading,
        ]}
        onPress={handleSubmit}
        disabled={phoneNumber.length !== 10 || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending...' : 'Send Code'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#007AFF',
  },
  buttonInactive: {
    backgroundColor: '#B0B0B0',
  },
  buttonLoading: {
    backgroundColor: '#4DA1FF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
