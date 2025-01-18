import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';

export default function SellScreen() {
  const router = useRouter();

  const handleAddProducts = () => {
    console.log('🛒 Navigating to Add Products screen...');
    router.push('/(modals)/addProduct');
  };

  const handleCreate = () => {
    console.log('✅ Create button clicked. Proceeding with the action...');
    // Add logic here for the "Create" button functionality.
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Sell',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#fff',
        }}
      />
      <View style={styles.content}>
        {/* Company Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>+ Add Company Details</Text>
        </View>

        {/* Sell Details Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Sell #</Text>
          <Text style={styles.text}>PINV-1</Text>
          <Text style={styles.label}>16-01-2025</Text>
        </View>

        {/* Add Products Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddProducts}>
          <Text style={styles.addButtonText}>+ Add Products</Text>
        </TouchableOpacity>
      </View>

      {/* Create Button */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  label: {
    color: '#888',
    marginVertical: 8,
  },
  text: {
    color: '#fff',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
