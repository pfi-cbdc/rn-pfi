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
      console.log("🔄 Fetching products...");
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
          console.log("✅ Products fetched:");
          setProducts(data);
        } else {
          console.log("❌ Failed to fetch products");
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
        console.log("⏳ Finished loading products.");
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
          headerStyle: { backgroundColor: '#FAF3E7' },
          headerTintColor: '#888',
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
              <Text style={styles.productText}>₹{item.sellingPrice}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          console.log("➕ Navigating to Add New Product page...");
          router.push('/(modals)/newProduct');
        }}
      >
        <Text style={styles.addButtonText}>+ Add New Product</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF3E7', padding: 16 },
  search: { backgroundColor: '#FAF3E7', padding: 12, borderRadius: 8, color: '#888', borderWidth: 1, borderColor: '#D77A61', marginBottom: 16 },
  product: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  productText: { color: '#888' },
  addButton: { backgroundColor: '#D77A61', padding: 16, borderRadius: 8, marginTop: 20 },
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  loadingText: { color: '#888', textAlign: 'center', marginTop: 20 },
});
