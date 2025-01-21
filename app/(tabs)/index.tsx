import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../../utils/storage';
import ENV from '../../config/env';

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
          Authorization: `Bearer ${token}`,
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
      .then((supported) => {
        if (supported) {
          console.log('✅ WhatsApp is supported. Opening...');
          return Linking.openURL(whatsappUrl);
        } else {
          console.log('❌ WhatsApp is not installed or URL is unsupported.');
        }
      })
      .catch((err) => console.error('⚠️ Error opening WhatsApp:', err));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.brandName}>{brandName}</Text>
        <Text style={styles.pfiText}>PFI</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.squareButton} onPress={handleSell}>
            <Ionicons name="cart-outline" size={32} color="#fff" />
            <Text style={styles.buttonText}>Sell</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.squareButton} onPress={handlePurchase}>
            <Ionicons name="cube-outline" size={32} color="#fff" />
            <Text style={styles.buttonText}>Purchase</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.squareButton} onPress={handleHelp}>
            <Ionicons name="help-circle-outline" size={32} color="#fff" />
            <Text style={styles.buttonText}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3E7',
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  squareButton: {
    backgroundColor: '#D77A61',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
});
