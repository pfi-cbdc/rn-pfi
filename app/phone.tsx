import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

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
        console.log('❌ API error:', data.error);
        Alert.alert('Error', data.error || 'Failed to send verification code');
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
      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>+91</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          maxLength={10}
          editable={!loading}
        />
      </View>
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
          {loading ? 'Sending code...' : 'Continue'}
        </Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  prefix: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
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
