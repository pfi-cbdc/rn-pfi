import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import ENV from '../config/env';

interface CompanyDetails {
  companyName: string;
  gstin: string;
  brandName: string;
  email: string;
  pan: string;
  alternateContact: string;
  website: string;
}

export default function CompanyDetailsScreen() {
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    companyName: '',
    gstin: '',
    brandName: '',
    email: '',
    pan: '',
    alternateContact: '',
    website: ''
  });
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    loadCompanyDetails();
    loadPhoneNumber();
  }, []);

  const loadPhoneNumber = async () => {
    console.log('🔑 Loading phone number...');
    const phone = await storage.getPhone();
    setPhoneNumber(phone);
    console.log('🔑 Phone number loaded:', phone);
  };

  const loadCompanyDetails = async () => {
    try {
      console.log('🔑 Loading company details...');
      const token = await storage.getToken();
      
      // Fetch company details from API
      const response = await fetch(`${ENV.API_URL}/company/details`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompanyDetails(data);
        console.log('🔑 Company details loaded:', data);
      }
    } catch (error) {
      console.error('⚠️ Error loading company details:', error);
    }
  };

  const handleSave = async () => {
    try {
      console.log('🔑 Saving company details...');
      const token = await storage.getToken();
      const response = await fetch(`${ENV.API_URL}/company/details`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyDetails), // Only sending editable company details
      });

      if (response.ok) {
        Alert.alert('Success', 'Company details saved successfully');
        console.log('🔑 Company details saved successfully');
      } else {
        Alert.alert('Error', 'Failed to save company details');
        console.error('⚠️ Failed to save company details');
      }
    } catch (error) {
      console.error('⚠️ Error saving company details:', error);
      Alert.alert('Error', 'Something went wrong while saving');
    }
  };

  const handleInputChange = (field: keyof CompanyDetails, value: string) => {
    setCompanyDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Company Details</Text>
      
      <View style={styles.detailsCard}>
        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.value}>{phoneNumber || 'Not available'}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Company Name</Text>
        <TextInput
          style={styles.input}
          value={companyDetails.companyName}
          onChangeText={(value) => handleInputChange('companyName', value)}
          placeholder="Enter company name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>GSTIN</Text>
        <TextInput
          style={styles.input}
          value={companyDetails.gstin}
          onChangeText={(value) => handleInputChange('gstin', value)}
          placeholder="Enter GSTIN"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Brand Name</Text>
        <TextInput
          style={styles.input}
          value={companyDetails.brandName}
          onChangeText={(value) => handleInputChange('brandName', value)}
          placeholder="Enter brand name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={companyDetails.email}
          onChangeText={(value) => handleInputChange('email', value)}
          placeholder="Enter email address"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>PAN</Text>
        <TextInput
          style={styles.input}
          value={companyDetails.pan}
          onChangeText={(value) => handleInputChange('pan', value)}
          placeholder="Enter PAN"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Alternate Contact</Text>
        <TextInput
          style={styles.input}
          value={companyDetails.alternateContact}
          onChangeText={(value) => handleInputChange('alternateContact', value)}
          placeholder="Enter alternate contact"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          value={companyDetails.website}
          onChangeText={(value) => handleInputChange('website', value)}
          placeholder="Enter website"
          keyboardType="url"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save & Update</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
