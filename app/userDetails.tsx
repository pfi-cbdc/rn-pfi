import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserDetailsScreen() {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    loadPhoneNumber();
  }, []);

  const loadPhoneNumber = async () => {
    console.log('🔑 Loading phone number...');
    const phone = await storage.getPhone();
    setPhoneNumber(phone);
    console.log('🔑 Phone number loaded:', phone);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>User Details</Text>
        <View style={styles.detailsCard}>
          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.value}>{phoneNumber || 'Not available'}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF4EE',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#FAF4EE',
    borderColor: '#D77A61',
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
});
