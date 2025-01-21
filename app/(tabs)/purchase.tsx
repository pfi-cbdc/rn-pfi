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
import { Alert } from 'react-native';

interface Purchase {
  id: string;
  companyId: string;
  productId: string;
  quantity: number;
  price: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  vendor?: {
    brandName: string;
    companyName: string;
  };
  product?: {
    productName: string;
  };
}

export default function Purchase() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'purchases' | 'sales'>('purchases');
  const [statusFilter, setStatusFilter] = useState<Purchase['status'] | 'ALL'>('ALL');

  const filteredPurchases = purchases.filter(purchase => 
    statusFilter === 'ALL' ? true : purchase.status === statusFilter
  );

  const fetchPurchases = async () => {
    setLoading(true);
    console.log('🚀 Fetching purchases...');
    try {
      const token = await storage.getToken();
      console.log('🔑 Retrieved token:', token);
      const endpoint = statusFilter === 'ALL' 
        ? `${ENV.API_URL}/purchase/all`
        : `${ENV.API_URL}/purchase/status/${statusFilter}`;
      
      const response = await fetch(endpoint, {
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
    console.log('📂 Component mounted or status filter changed. Fetching purchases...');
    fetchPurchases();
  }, [statusFilter]); // Re-fetch when status filter changes

  const onRefresh = async () => {
    setRefreshing(true);
    console.log('🔄 Refreshing purchases...');
    await fetchPurchases();
    setRefreshing(false);
    console.log('🔁 Refresh complete.');
  };

  const updatePurchaseStatus = async (purchaseId: string, newStatus: Purchase['status']) => {
    try {
      const token = await storage.getToken();
      const response = await fetch(`${ENV.API_URL}/purchase/${purchaseId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to update status');
      }

      // Update the local state
      setPurchases(prevPurchases => 
        prevPurchases.map(purchase => 
          purchase.id === purchaseId 
            ? { ...purchase, status: newStatus }
            : purchase
        )
      );
    } catch (error) {
      console.error('Error updating purchase status:', error);
      Alert.alert('Error', 'Failed to update purchase status');
    }
  };

  const renderPurchaseItem = ({ item }: { item: Purchase }) => (
    <View style={styles.purchaseItem}>
      <View style={styles.purchaseDetails}>
        {item.vendor && (
          <Text style={styles.vendorName}>
            {item.vendor.brandName} ({item.vendor.companyName})
          </Text>
        )}
        {item.product && (
          <Text style={styles.productName}>{item.product.productName}</Text>
        )}
        <Text style={styles.quantityPrice}>
          Qty: {item.quantity} | Unit: ₹{item.price} | Total: ₹{item.quantity * item.price}
        </Text>
        <Text style={[styles.statusText, getStatusStyle(item.status)]}>
          {item.status}
        </Text>
      </View>
      {item.status === 'PENDING' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => updatePurchaseStatus(item.id, 'IN_PROGRESS')}
          >
            <Ionicons name="checkmark" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => updatePurchaseStatus(item.id, 'FAILED')}
          >
            <Ionicons name="close" size={24} color="#FF6347" />
          </TouchableOpacity>
        </View>
      )}
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
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'purchases' && styles.activeToggle,
          ]}
          onPress={() => setActiveTab('purchases')}
        >
          <Text style={[
            styles.toggleText,
            activeTab === 'purchases' && styles.activeToggleText
          ]}>Purchases</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'sales' && styles.activeToggle,
          ]}
          onPress={() => setActiveTab('sales')}
        >
          <Text style={[
            styles.toggleText,
            activeTab === 'sales' && styles.activeToggleText
          ]}>Sales</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'purchases' && (
        <View style={styles.filterContainer}>
          {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                statusFilter === status && styles.activeFilterButton
              ]}
              onPress={() => setStatusFilter(status)}
            >
              <Text style={[
                styles.filterButtonText,
                statusFilter === status && styles.activeFilterButtonText
              ]}>
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {activeTab === 'purchases' ? 'My Purchases' : 'My Sales'}
        </Text>
        <TouchableOpacity onPress={fetchPurchases}>
          <Ionicons name="refresh" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading purchases...</Text>
      ) : (
        <FlatList
          data={filteredPurchases}
          renderItem={renderPurchaseItem}
          keyExtractor={(item) => item.id}
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
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#000000',
    fontWeight: '600',
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
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  quantityPrice: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  acceptButton: {
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  rejectButton: {
    borderColor: '#FF6347',
    borderWidth: 1,
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FAF3E7',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#EAEAEA',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  activeFilterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#4A90E2',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});
