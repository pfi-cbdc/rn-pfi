import { Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import ENV from '../../config/env';
import { storage } from '@/utils/storage';

interface Product {
  id: string;
  productName: string;
  sellingPrice: number;
}

export default function SelectProductScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { vendorInfo } = useLocalSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const vendorId = (() => {
    try {
      console.log('🔑 Parsing vendor info:');
      if (vendorInfo) {
        const vendor = JSON.parse(vendorInfo as string);
        console.log('✅ Parsed vendor:');
        return vendor.id;
      }
    } catch (error) {
      console.error('⚠️ Error parsing vendor info:', error);
    }
    return undefined;
  })();

  useEffect(() => {
    const getToken = async () => {
      console.log('🔑 Fetching token...');
      const t = await storage.getToken();
      setToken(t);
      console.log('✅ Token retrieved:', t);
    };
    getToken();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (vendorId && token) {
          console.log('📡 Fetching products for vendor:');
          const response = await fetch(`${ENV.API_URL}/company/products/${vendorId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setProducts(data);
          console.log('✅ Products fetched successfully:');
        }
      } catch (error) {
        console.error('❌ Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId && token) {
      fetchProducts();
    } else {
      console.log('⚠️ Vendor ID or token missing, skipping product fetch.');
      setLoading(false);
    }
  }, [vendorId, token]);

  const handleSelectProduct = (product: Product) => {
    console.log('🛒 Product selected:');
    router.replace({
      pathname: '/purchase',
      params: { selectedProduct: JSON.stringify(product), selectedVendor: vendorInfo },
    });
  };

  if (loading) {
    console.log('⌛ Loading products...');
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading Products...</Text>
      </SafeAreaView>
    );
  }

  if (!vendorId) {
    console.log('⚠️ No valid vendor ID. Redirecting...');
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No valid vendor selected. Please try again.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Select Product', headerStyle: { backgroundColor: '#000' } }} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productItem} onPress={() => handleSelectProduct(item)}>
            <Text style={styles.productText}>
              {item.productName} - ₹{item.sellingPrice}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No products found for this vendor.</Text>
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
  loadingText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    color: '#FF6347',
    textAlign: 'center',
    fontSize: 16,
  },
  productItem: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  productText: {
    color: '#FFF',
    fontSize: 14,
  },
  emptyListText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
  },
});
