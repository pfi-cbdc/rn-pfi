import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ENV from '../../config/env';
import { storage } from '../../utils/storage';

interface Purchase {
  id: string;
  companyId: string;
  productId: string;
  quantity: number;
  price: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export default function Purchase() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPurchases = async () => {
    setLoading(true);
    console.log('🚀 Fetching purchases...');
    try {
      const token = await storage.getToken();
      console.log('🔑 Retrieved token:', token);
      const response = await fetch(`${ENV.API_URL}/purchase/all`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error('❌ Failed to fetch purchases. Status:', response.status);
        return;
      }
      const data = await response.json();
      console.log('✅ Purchases fetched successfully:');
      setPurchases(data);
    } catch (error: any) {
      console.error('⚠️ Error fetching purchases:', error.message);
    } finally {
      setLoading(false);
      console.log('✨ Fetch complete.');
    }
  };

  useEffect(() => {
    console.log('📂 Component mounted. Fetching purchases...');
    fetchPurchases();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    console.log('🔄 Refreshing purchases...');
    await fetchPurchases();
    setRefreshing(false);
    console.log('🔁 Refresh complete.');
  };

  const renderPurchaseItem = ({ item }: { item: Purchase }) => (
    <View style={styles.purchaseItem}>
      <View style={styles.purchaseDetails}>
        <Text style={styles.quantityPrice}>
          Qty: {item.quantity} | Unit: ₹{item.price} | Total: ₹{item.quantity * item.price}
        </Text>
        <Text style={[styles.statusText, getStatusStyle(item.status)]}>
          {item.status}
        </Text>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  const getStatusStyle = (status: Purchase['status']) => {
    switch (status) {
      case 'PENDING':
        return styles.statusPending;
      case 'IN_PROGRESS':
        return styles.statusInProgress;
      case 'COMPLETED':
        return styles.statusCompleted;
      case 'FAILED':
        return styles.statusFailed;
      default:
        return {};
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Purchases</Text>
        <TouchableOpacity onPress={fetchPurchases}>
          <Ionicons name="refresh" size={24} color="#D77A61" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Loading purchases...</Text>
      ) : (
        <FlatList
          data={purchases}
          keyExtractor={(item) => item.id}
          renderItem={renderPurchaseItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No purchases found.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3E7',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  purchaseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF3E7',
    fontWeight: 'bold',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  purchaseDetails: {
    flex: 1,
  },
  productName: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyName: {
    color: '#888',
    fontSize: 14,
    marginVertical: 4,
  },
  quantityPrice: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 14,
  },
  viewButton: {
    backgroundColor: '#D77A61',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 12,
    marginTop: 4,
  },
  statusPending: {
    color: '#FFA500',
  },
  statusInProgress: {
    color: '#1E90FF',
  },
  statusCompleted: {
    color: '#32CD32',
  },
  statusFailed: {
    color: '#FF6347',
  },
});
