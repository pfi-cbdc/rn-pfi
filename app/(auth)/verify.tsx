import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInputProps,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ENV from '../../config/env';
import { storage } from '../../utils/storage';

export default function VerifyScreen() {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState<boolean>(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(false);
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();
  const [isResending, setIsResending] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d$/.test(value) && value !== '') return; // Only allow digits
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Automatically move to the next input if a digit is entered
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
    // Move to the previous input if input is cleared
    if (value === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (isResending || loading) return; // Prevent multiple requests
    setIsResending(true);
  };

  const handleVerify = async () => {
    const otpCode = code.join('');
    console.log('🔵 Verify button pressed with code:', otpCode);

    if (!otpCode.trim()) {
      console.log('❌ Empty verification code');
      return;
    }

    if (otpCode.length !== 6) {
      console.log('❌ Invalid code length');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${ENV.API_URL}/users/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, code: otpCode }),
      });

      const data = await response.json();
      if (response.ok) {
        await storage.setToken(data.token);
        await storage.setPhone(phoneNumber as string);

        // Show loading screen while routing
        setShowLoadingScreen(true);
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 2000); // Add slight delay for better UX
      } else {
        console.log('❌ Verification failed:', data.error);
      }
    } catch (error) {
      console.error('❌ Verification Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showLoadingScreen) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#D77A61" />
        <Text style={styles.loadingText}>Verifying, please wait...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to {phoneNumber}
      </Text>
      <View style={styles.otpContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            keyboardType="number-pad"
            maxLength={1}
            editable={!loading}
          />
        ))}
      </View>
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive OTP? </Text>
        <TouchableOpacity onPress={handleResendOTP} disabled={isResending || loading}>
          <Text style={[styles.resendButton, (isResending || loading) && styles.resendButtonDisabled]}>
            Send again
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          code.join('').length === 6 ? styles.buttonActive : styles.buttonInactive,
          loading && styles.buttonLoading,
        ]}
        onPress={handleVerify}
        disabled={code.join('').length !== 6 || loading}
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
    backgroundColor: '#FAF3E7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#F9F5F0'
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#C2A15A',
    backgroundColor: '#F9F5F0',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#D77A61',
  },
  buttonInactive: {
    backgroundColor: '#B0B0B0',
  },
  buttonLoading: {
    backgroundColor: '#D77A61',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF3E7',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  resendContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendButton: {
    fontSize: 14,
    color: '#D77A61',
    fontWeight: '600',
  },
  resendButtonDisabled: {
    color: '#E0E0E0',
  },
});
