import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ENV from '../../config/env';
import { storage } from '../../utils/storage';

export default function VerifyScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();

  const handleVerify = async () => {
    console.log('🔵 Verify button pressed with code:', code);

    if (!code.trim()) {
      console.log('❌ Empty verification code');
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    if (code.length !== 6) {
      console.log('❌ Invalid code length');
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Making verify request to:', `${ENV.API_URL}/users/verify-otp`);
      console.log('📤 Request payload:', { phoneNumber, code });

      const response = await fetch(`${ENV.API_URL}/users/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, code }),
      });

      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('📥 Response data:', data);

      if (response.ok) {
        console.log('✅ Verification successful');
        await storage.setToken(data.token);
        await storage.setPhone(phoneNumber as string);
        console.log('✅ Token and phone number stored successfully');
        Alert.alert('Success', 'Phone number verified successfully', [
          {
            text: 'OK',
            onPress: () => {
              console.log('➡️ Navigating to tabs');
              router.replace('/(tabs)');
            },
          },
        ]);
      } else {
        console.log('❌ Verification error:', data.error);
        Alert.alert('Error', data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('❌ Verification Error:', error);
      Alert.alert('Error', 'Something went wrong during verification');
    } finally {
      console.log('🔄 Verification request completed');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to {phoneNumber}
      </Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="Enter 6-digit code"
        keyboardType="number-pad"
        maxLength={6}
        editable={!loading}
      />
      <TouchableOpacity
        style={[
          styles.button,
          code.length === 6 ? styles.buttonActive : styles.buttonInactive,
          loading && styles.buttonLoading,
        ]}
        onPress={handleVerify}
        disabled={code.length !== 6 || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Verifying...' : 'Verify'}
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
