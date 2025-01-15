import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function CompanyDetailsScreen() {
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const handleSaveOrUpdate = () => {
    // Add save or update functionality here
    console.log('Company details saved or updated');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Company Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Company Name"
        value={companyName}
        onChangeText={setCompanyName}
      />
      <TextInput
        style={styles.input}
        placeholder="GST Number"
        value={gstNumber}
        onChangeText={setGstNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Business Email"
        value={businessEmail}
        onChangeText={setBusinessEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Trade Name"
        value={tradeName}
        onChangeText={setTradeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Billing Address"
        value={billingAddress}
        onChangeText={setBillingAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Shipping Address"
        value={shippingAddress}
        onChangeText={setShippingAddress}
      />
      <View style={styles.buttonContainer}>
        <Button title="Save/Update" onPress={handleSaveOrUpdate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
});