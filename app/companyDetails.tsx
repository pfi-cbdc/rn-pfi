import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import ENV from '../config/env';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Company Details</Text>

        <TouchableOpacity style={styles.logoContainer}>
          <Text style={styles.logoText}>Upload Company Logo</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Company Name *</Text>
          <TextInput
            style={styles.input}
            value={companyDetails.companyName}
            onChangeText={(value) => handleInputChange('companyName', value)}
            placeholder="Business/Company Name"
          />
        </View>

        <Text style={styles.label}>GST Number *</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.flex]}
            value={companyDetails.gstin}
            onChangeText={(value) => handleInputChange('gstin', value)}
            placeholder="GST Number"
          />
          <TouchableOpacity style={styles.fetchButton} onPress={loadCompanyDetails}>
            <Text style={styles.fetchButtonText}>Fetch Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Trade/Brand Name *</Text>
          <TextInput
            style={styles.input}
            value={companyDetails.brandName}
            onChangeText={(value) => handleInputChange('brandName', value)}
            placeholder="Trade/Brand Name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Email *</Text>
          <TextInput
            style={styles.input}
            value={companyDetails.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Business Email"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>PAN *</Text>
          <TextInput
            style={styles.input}
            value={companyDetails.pan}
            onChangeText={(value) => handleInputChange('pan', value)}
            placeholder="PAN"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Alternate Contact</Text>
          <TextInput
            style={styles.input}
            value={companyDetails.alternateContact}
            onChangeText={(value) => handleInputChange('alternateContact', value)}
            placeholder="Alternate Contact"
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
      </ScrollView>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save & Update</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF4EE',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5
  },
  logoContainer: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
    backgroundColor: '#FAF4EE',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D77A61',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#FAF4EE',
  },
  flex: {
    flex: 1,
  },
  fetchButton: {
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#D77A61',
    borderRadius: 5,
  },
  fetchButtonText: {
    color: '#FFF',
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#D77A61',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
