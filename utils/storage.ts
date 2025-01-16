import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  USER_TOKEN: 'userToken',
  USER_PHONE: 'userPhone',
};

export const storage = {
  getToken: async () => {
    try {
      const token = await AsyncStorage.getItem(StorageKeys.USER_TOKEN);
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  setToken: async (token: string) => {
    try {
      await AsyncStorage.setItem(StorageKeys.USER_TOKEN, token);
      return true;
    } catch (error) {
      console.error('Error setting token:', error);
      return false;
    }
  },

  removeToken: async () => {
    try {
      await AsyncStorage.removeItem(StorageKeys.USER_TOKEN);
      return true;
    } catch (error) {
      console.error('Error removing token:', error);
      return false;
    }
  },

  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem(StorageKeys.USER_TOKEN);
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  setPhone: async (phone: string) => {
    try {
      await AsyncStorage.setItem(StorageKeys.USER_PHONE, phone);
      return true;
    } catch (error) {
      console.error('Error setting phone:', error);
      return false;
    }
  },

  getPhone: async () => {
    try {
      const phone = await AsyncStorage.getItem(StorageKeys.USER_PHONE);
      return phone;
    } catch (error) {
      console.error('Error getting phone:', error);
      return null;
    }
  },

  clearAll: async () => {
    try {
      await AsyncStorage.multiRemove([StorageKeys.USER_TOKEN, StorageKeys.USER_PHONE]);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },
};
