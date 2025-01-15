import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  USER_TOKEN: 'userToken',
};

export const storage = {
  getToken: () => AsyncStorage.getItem(StorageKeys.USER_TOKEN),
  setToken: (token: string) => AsyncStorage.setItem(StorageKeys.USER_TOKEN, token),
  removeToken: () => AsyncStorage.removeItem(StorageKeys.USER_TOKEN),
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem(StorageKeys.USER_TOKEN);
    return !!token;
  },
};
