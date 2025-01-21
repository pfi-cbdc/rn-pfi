import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import ENV from '../../config/env';
import { storage } from '../../utils/storage';

export default function NewProduct() {
  const [productName, setProductName] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [units, setUnits] = useState('Pieces');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showUnitModal, setShowUnitModal] = useState(false);

  const unitOptions = ['Pieces', 'Kilograms', 'Liters', 'Dozens'];

  const handleImagePicker = async () => {
    console.log("🚀 Opening image picker...");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("📷 Image selected:", result.assets[0].uri);
      setImage(result.assets[0].uri);
    } else {
      console.log("❌ Image selection canceled.");
    }
  };

  const handleAddProduct = async () => {
    const token = await storage.getToken();
    if (!productName || !sellingPrice || !units) {
      console.log("⚠️ Missing required fields!");
      Alert.alert('Error', 'Please fill in all the required fields.');
      return;
    }

    const newProduct = {
      productName,
      sellingPrice,
      units,
      ...(description && { description }),
      ...(image && { image }),
    };

    console.log("🛒 Adding new product:");

    try {
      const response = await fetch(`${ENV.API_URL}/sell/addProduct`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(newProduct),
      });
      
      if (response.ok) {
        console.log("✅ Product added successfully!");
        Alert.alert('Success', 'Product added successfully!');
        setProductName('');
        setSellingPrice('');
        setUnits('Pieces');
        setDescription('');
        setImage(null);
      } else {
        console.log("❌ Failed to add product.");
        Alert.alert('Error', 'Failed to add product. Please try again.');
      }
    } catch (error) {
      console.error("🔥 Error occurred while adding product:", error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Add New Product',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FAF3E7' },
          headerTintColor: '#888',
        }}
      />
      <View>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          placeholderTextColor="#888"
          value={productName}
          onChangeText={setProductName}
        />
        <TextInput
          style={styles.input}
          placeholder="Selling Price"
          placeholderTextColor="#888"
          value={sellingPrice}
          onChangeText={setSellingPrice}
          keyboardType="numeric"
        />
        <TouchableOpacity 
          style={styles.input}
          onPress={() => setShowUnitModal(true)}
        >
          <Text style={{ color: '#888' }}>{units}</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showUnitModal}
          onRequestClose={() => setShowUnitModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1} 
            onPress={() => setShowUnitModal(false)}
          >
            <View style={styles.modalContent}>
              {unitOptions.map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={styles.unitOption}
                  onPress={() => {
                    console.log(`📦 Unit selected: ${unit}`);
                    setUnits(unit);
                    setShowUnitModal(false);
                  }}
                >
                  <Text style={styles.unitText}>{unit}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
        <TextInput
          style={styles.input}
          placeholder="Optional Description"
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
          <Text style={styles.uploadButtonText}>
            {image ? 'Change Image' : 'Upload Image'}
          </Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3E7',
    padding: 16,
  },
  input: {
    backgroundColor: '#FAF3E7',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#FAF3E7',
  },
  modalContent: {
    backgroundColor: '#FAF3E7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  unitOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#888',
  },
  unitText: {
    color: '#D77A61',
    fontSize: 16,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#D77A61',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  uploadButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#D77A61',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
