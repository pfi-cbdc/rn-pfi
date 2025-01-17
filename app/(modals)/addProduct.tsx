import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { storage } from '../../utils/storage';
import ENV from '../../config/env';

interface Product {
  id: string | number;
  productName: string;
  sellingPrice: string;
}

export default function AddProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await storage.getToken();
        const response = await fetch(`${ENV.API_URL}/sell/getProducts`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Add Product List',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#fff',
        }}
      />
      <TextInput
        style={styles.search}
        placeholder="Search by Name"
        placeholderTextColor="#888"
      />
      {loading ? (
        <Text style={styles.loadingText}>Loading products...</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <View style={styles.product}>
              <Text style={styles.productText}>{item.productName}</Text>
              <Text style={styles.productText}>{item.sellingPrice}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(modals)/newProduct')}
      >
        <Text style={styles.addButtonText}>+ Add New Product</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  search: { backgroundColor: '#222', padding: 12, borderRadius: 8, color: '#fff', marginBottom: 16 },
  product: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  productText: { color: '#fff' },
  addButton: { backgroundColor: '#3B82F6', padding: 16, borderRadius: 8, marginTop: 20 },
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  loadingText: { color: '#888', textAlign: 'center', marginTop: 20 },
});
