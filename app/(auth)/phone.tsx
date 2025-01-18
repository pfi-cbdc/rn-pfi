import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import ENV from '../../config/env';
import Checkbox from 'expo-checkbox';

const API_URL = ENV.API_URL;

export default function PhoneScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    if (!isChecked) {
      Alert.alert('Error', 'You must accept the terms and conditions');
      return;
    }

    try {
      setLoading(true);
      const url = `${API_URL}/users/send-otp`;
      const payload = { phoneNumber: '+91' + phoneNumber };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Request Failed', JSON.stringify(data, null, 2));
        return;
      }

      setIsNavigating(true);
      setTimeout(() => {
        router.push({
          pathname: '/verify',
          params: { phoneNumber: '+91' + phoneNumber },
        });
      }, 1000);   
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (isNavigating) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D77A61" />
        <Text style={styles.loaderText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you OK!</Text>
      <Text style={styles.subtitleHead}>Enter your phone number to find out:</Text>
      <View style={styles.phoneInputContainer}>
        <Text style={styles.countryCode}>+91</Text>
        <TextInput
          style={styles.phoneInput}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter phone number"
          keyboardType="number-pad"
          maxLength={10}
          editable={!loading}
        />
      </View>
      <Text style={styles.subtitle}>
        *We will send you a 6 digit One Time Password (OTP) to your phone number to verify it belongs to you.
      </Text>
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isChecked}
          onValueChange={setIsChecked}
          color={isChecked ? '#D77A61' : undefined}
        />
        <Text style={styles.termsText}>
          I accept the{' '}
          <Text style={styles.linkText} onPress={() => Alert.alert('Terms and Conditions')}>
            Terms and Conditions
          </Text>
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          phoneNumber.length === 10 && isChecked ? styles.buttonActive : styles.buttonInactive,
          loading && styles.buttonLoading,
        ]}
        onPress={handleSubmit}
        disabled={phoneNumber.length !== 10 || loading || !isChecked}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending...' : 'Send OTP'}
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
    backgroundColor: '#F9F5F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000',
  },
  greenText: {
    color: 'green',
  },
  redText: {
    color: 'red',
  },
  subtitleHead: {
    fontSize: 20,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    marginEnd: 24,
    marginStart: 24,
    textAlign: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C2A15A',
    borderRadius: 8,
    backgroundColor: '#F9F5F0',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  countryCode: {
    fontSize: 16,
    color: '#000',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 10,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#D77A61',
  },
  buttonInactive: {
    backgroundColor: '#E0E0E0',
  },
  buttonLoading: {
    backgroundColor: '#F4A261',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F5F0',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  linkText: {
    color: '#D77A61',
  },
});
