import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';

export default function SellScreen() {
  const router = useRouter();

  const handleAddProducts = () => {
    console.log('📦 Add Products button clicked. Navigating...');
    router.push('/(modals)/addProduct');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Your Catalog',
          headerShadowVisible: true,
          headerStyle: { backgroundColor: '#FAF3E7' },
          headerTintColor: '#888',
        }}
      />
      <View style={styles.content}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProducts}>
          <Text style={styles.addButtonText}>+ Add Products</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3E7',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: '#888',
  },
  addButton: {
    backgroundColor: '#D77A61',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
