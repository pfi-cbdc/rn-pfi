import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { storage } from '../../utils/storage';
import ENV from '../../config/env';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Product {
  id: string | number;
  productName: string;
  sellingPrice: number;
  units: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    console.log('🛍️ Fetching products...');
    try {
      const token = await storage.getToken();
      console.log('🔑 Token retrieved successfully.');
      const response = await fetch(`${ENV.API_URL}/sell/getProducts`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        console.log(`✅ Successfully fetched ${data.length} products.`);
      } else {
        console.error('❌ Failed to fetch products. Response not OK.');
      }
    } catch (error) {
      console.error(`⚠️ Error fetching products: ${error}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
      console.log('⏹️ Finished fetching products.');
    }
  }, []);

  const deleteProduct = async (productId: string | number) => {
    try {
      const token = await storage.getToken();
      const response = await fetch(`${ENV.API_URL}/sell/product/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Product deleted successfully');
        // Refresh the products list
        fetchProducts();
      } else {
        console.error('❌ Failed to delete product:', data.error);
        if (data.hasPurchases) {
          Alert.alert(
            'Cannot Delete Product',
            'This product has existing purchases. Please delete associated purchases first before deleting the product.'
          );
        } else {
          Alert.alert('Error', data.error || 'Failed to delete product');
        }
      }
    } catch (error) {
      console.error(`⚠️ Error deleting product: ${error}`);
      Alert.alert('Error', 'Failed to delete product');
    }
  };

  const handleDeletePress = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete ${product.productName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProduct(product.id),
        },
      ]
    );
  };

  useEffect(() => {
    console.log('📦 Component mounted. Initiating fetch...');
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = () => {
    console.log('🔄 Refreshing products...');
    setRefreshing(true);
    fetchProducts();
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Ionicons name="pricetag" size={24} color="#888" />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productPrice}>₹{item.sellingPrice}</Text>
      </View>
      <Text style={styles.productQuantity}>Qty: {item.units}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => console.log('Edit pressed')}
        >
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeletePress(item)}
        >
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#888"
        />
        <Ionicons name="search" size={24} color="#888" style={styles.searchIcon} />
        <Ionicons name="funnel" size={24} color="#888" style={styles.filterIcon} />
      </View>

      {loading ? (
        <Text style={styles.loadingText}>⏳ Loading products...</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>Sort</Text>
              <Text style={styles.sortValue}>Default</Text>
            </View>
          }
          ListFooterComponent={
            <View style={styles.footer}>
              {/* <Text style={styles.footerTitle}>Batch & Expiry</Text>
              <Text style={styles.footerDescription}>
                Manage and organize products in Batches for seamless inventory
                management.
              </Text> */}
              <Ionicons name="headset" size={24} color="#007AFF" />
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          console.log('➕ Navigating to add new product page...');
          router.push('/(modals)/newProduct');
        }}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>New Product</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
  },
  searchIcon: {
    marginLeft: 8,
  },
  filterIcon: {
    marginLeft: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sortLabel: {
    color: '#888',
  },
  sortValue: {
    color: '#fff',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  productPrice: {
    color: '#007AFF',
    fontSize: 14,
    marginTop: 4,
  },
  productQuantity: {
    color: '#888',
    fontSize: 14,
    marginRight: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  footerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  footerDescription: {
    color: '#888',
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});
