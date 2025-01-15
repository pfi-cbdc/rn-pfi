import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';

export default function UserDetailsScreen() {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    loadPhoneNumber();
  }, []);

  const loadPhoneNumber = async () => {
    const phone = await storage.getPhone();
    setPhoneNumber(phone);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Details</Text>
      <View style={styles.detailsCard}>
        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.value}>{phoneNumber || 'Not available'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#f5f5f5',
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
