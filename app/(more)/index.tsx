import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function MoreScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.cardEntry} onPress={() => router.replace('/userProfile')}>
          <Text style={styles.cardText}>User Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardEntry} onPress={() => router.replace('/companyDetails')}>
          <Text style={styles.cardText}>Company Details</Text>
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
    backgroundColor: 'white',
  },
  card: {
    width: '90%',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardEntry: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
  },
  cardText: {
    fontSize: 18,
    color: '#007AFF',
  },
});