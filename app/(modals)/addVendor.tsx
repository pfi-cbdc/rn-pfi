import { Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import ENV from '../../config/env';
import { storage } from '@/utils/storage';

interface Vendor {
  id: string;
  brandName: string;
  companyName: string;
}

export default function VendorsScreen() {
  const [search, setSearch] = useState('');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    const fetchVendors = async () => {
      console.log("🚀 Fetching vendors...");
      const token = await storage.getToken();
      try {
        const response = await fetch(`${ENV.API_URL}/company/all`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        console.log('Successfully fetched vendors:');
        setVendors(data);
        setFilteredVendors(data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    console.log("🔍 Filtering vendors with search term:", search);
    const vendorsArray = Object.values(vendors);
    if (vendorsArray.length === 0) {
      console.log("⚠️ No vendors available to filter.");
      setFilteredVendors([]);
      return;
    }
    const filtered = vendorsArray.filter(
      (vendor) =>
        vendor?.brandName?.toLowerCase().includes(search?.toLowerCase() || '') ||
        vendor?.companyName?.toLowerCase().includes(search?.toLowerCase() || '')
    );
    console.log("✅ Filtered vendors:");
    setFilteredVendors(filtered);
  }, [search, vendors]);

  const handleSelectVendor = (vendor: Vendor) => {
    console.log("🛒 Vendor selected:", vendor);
    router.replace({
      pathname: '/purchase',
      params: { selectedVendor: JSON.stringify(vendor) },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Select Vendor',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#000' },
        }}
      />
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Brand or Company"
        placeholderTextColor="#AAA"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredVendors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.vendorItem} onPress={() => handleSelectVendor(item)}>
            <Text style={styles.vendorText}>
              {item.brandName} - {item.companyName}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No vendors found. Try a different search.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  searchBar: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  vendorItem: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  vendorText: {
    color: '#FFF',
    fontSize: 14,
  },
  emptyListText: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});
