import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useEffect, useState } from 'react';
import { storage } from '../../utils/storage';
import ENV from '../../config/env';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [brandName, setBrandName] = useState('');

  useEffect(() => {
    loadCompanyDetails();
  }, []);

  const loadCompanyDetails = async () => {
    try {
      console.log('📡 Fetching company details...');
      const token = await storage.getToken();
      const response = await fetch(`${ENV.API_URL}/company/details`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBrandName(data.brandName);
        console.log('✅ Company details loaded successfully:', data);
      } else {
        console.log('❌ Failed to fetch company details:', response.status);
      }
    } catch (error) {
      console.error('⚠️ Error loading company details:', error);
    }
  };

  const handleSell = () => {
    console.log('🛒 Navigating to Sell page...');
    router.push('/(modals)/sell');
  };

  const handlePurchase = () => {
    console.log('📦 Navigating to Purchase page...');
    router.push('/(modals)/purchase');
  };

  const handleHelp = () => {
    console.log('🤔 Opening WhatsApp support...');
    const whatsappNumber = ENV.WHATSAPP_NUMBER.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello! I need assistance with PFI app.`;

    Linking.canOpenURL(whatsappUrl)
      .then(supported => {
        if (supported) {
          console.log('✅ WhatsApp is supported. Opening...');
          return Linking.openURL(whatsappUrl);
        } else {
          console.log('❌ WhatsApp is not installed or URL is unsupported.');
        }
      })
      .catch(err => console.error('⚠️ Error opening WhatsApp:', err));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.brandName}>{brandName}</Text>
        <Text style={styles.pfiText}>PFI</Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={handleSell}>
          <Text style={styles.buttonText}>Sell</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.purchaseButton]} onPress={handlePurchase}>
          <Text style={styles.buttonText}>Purchase</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.helpButton]} onPress={handleHelp}>
          <Text style={styles.buttonText}>Help</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  brandName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pfiText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  purchaseButton: {
    backgroundColor: '#34C759',
  },
  helpButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
