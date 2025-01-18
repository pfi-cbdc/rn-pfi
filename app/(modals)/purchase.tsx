import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import ENV from '../../config/env';
import { storage } from '@/utils/storage';
import { Alert } from 'react-native';

interface Vendor {
  id: string;
  brandName: string;
  companyName: string;
}

interface Product {
  id: string;
  productName: string;
  sellingPrice: number;
}

export default function PurchaseScreen() {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const router = useRouter();
  const { selectedVendor: vendorParam, selectedProduct: productParam } = useLocalSearchParams();

  useEffect(() => {
    if (vendorParam) {
      const vendor = JSON.parse(vendorParam as string) as Vendor;
      setSelectedVendor(vendor);
      console.log("Vendor selected: 🏢");
    }

    if (productParam) {
      const product = JSON.parse(productParam as string) as Product;
      setSelectedProduct(product);
      console.log("Product selected: 🛍️");
    }
  }, [vendorParam, productParam]);

  const handleSelectVendor = () => {
    console.log("Navigating to Add Vendor screen... 🚶‍♂️");
    router.push('/(modals)/addVendor');
  };

  const handleSelectProduct = () => {
    if (selectedVendor) {
      console.log("Navigating to Vendor Products screen... 📦");
      router.push({
        pathname: '/(modals)/vendorProducts',
        params: { vendorInfo: JSON.stringify(selectedVendor) },
      });
    } else {
      console.log("No vendor selected! 🛑");
    }
  };

  const handlePurchase = async () => {
    if (selectedProduct && selectedVendor) {
      const purchaseDetails = {
        vendorId: selectedVendor.id,
        productId: selectedProduct.id,
        quantity,
        totalAmount: selectedProduct.sellingPrice * quantity,
      };
      console.log("Attempting to make purchase... 🛒");
      const token = await storage.getToken();
      const response = await fetch(`${ENV.API_URL}/purchase/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseDetails),
      });
      if (response.ok) {
        console.log("Purchase successful! ✅");
        Alert.alert('Purchase Successful');
        router.push('/(tabs)/purchase');
      } else {
        console.log("Purchase failed! ❌", await response.text());
        Alert.alert('Error', 'Failed to make purchase');
      }
    } else {
      console.log("No product or vendor selected for purchase! 🚫");
    }
  };

  const totalAmount = selectedProduct ? selectedProduct.sellingPrice * quantity : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Purchase',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#000' },
        }}
      />
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Vendor</Text>
        {selectedVendor ? (
          <View style={styles.vendorDetails}>
            <Text style={styles.vendorText}>
              {selectedVendor.brandName} - {selectedVendor.companyName}
            </Text>
            <TouchableOpacity style={styles.changeButton} onPress={handleSelectVendor}>
              <Text style={styles.buttonText}>Change Vendor</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSelectVendor}>
            <Text style={styles.buttonText}>+ Select Vendor</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Product</Text>
        {selectedProduct ? (
          <View style={styles.productDetails}>
            <Text style={styles.vendorText}>
              {selectedProduct.productName} - ₹{selectedProduct.sellingPrice}
            </Text>
            <TouchableOpacity style={styles.changeButton} onPress={handleSelectProduct}>
              <Text style={styles.buttonText}>Change Product</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, !selectedVendor && { backgroundColor: '#555' }]}
            onPress={handleSelectProduct}
            disabled={!selectedVendor}
          >
            <Text style={styles.buttonText}>
              {selectedVendor ? '+ Select Product' : 'Select a Vendor First'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {selectedProduct && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Total Amount</Text>
            <Text style={styles.totalText}>₹{totalAmount.toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
            <Text style={styles.buttonText}>Make Purchase</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2E2E2E',
    padding: 16,
    borderRadius: 8,
  },
  changeButton: {
    marginTop: 8,
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 8,
  },
  purchaseButton: {
    backgroundColor: '#32CD32',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  },
  vendorDetails: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
  },
  productDetails: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
  },
  vendorText: {
    color: '#FFF',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  quantityText: {
    color: '#FFF',
    fontSize: 16,
    width: 40,
    textAlign: 'center',
  },
  totalText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
