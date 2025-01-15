import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  USER_TOKEN: 'userToken',
  USER_PHONE: 'userPhone',
};

export const storage = {
  getToken: () => AsyncStorage.getItem(StorageKeys.USER_TOKEN),
  setToken: (token: string) => AsyncStorage.setItem(StorageKeys.USER_TOKEN, token),
  removeToken: () => AsyncStorage.removeItem(StorageKeys.USER_TOKEN),
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem(StorageKeys.USER_TOKEN);
    return !!token;
  },
  setPhone: (phone: string) => AsyncStorage.setItem(StorageKeys.USER_PHONE, phone),
  getPhone: () => AsyncStorage.getItem(StorageKeys.USER_PHONE),
  clearAll: async () => {
    await AsyncStorage.multiRemove([StorageKeys.USER_TOKEN, StorageKeys.USER_PHONE]);
  },
};
